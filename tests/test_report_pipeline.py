import asyncio
from datetime import datetime, timezone
from pathlib import Path

import pentest_mcp.tools.analysis as analysis_module
import pentest_mcp.mcp_server as mcp_server
from pentest_mcp.config import settings
from pentest_mcp.llm_providers import GeminiProvider
from pentest_mcp.models import Finding, Phase, ScanSession, Severity
from pentest_mcp.report_engine import generate_report
from pentest_mcp.session import SessionManager


def test_report_engine_uses_gemini_directly(monkeypatch):
    async def _run():
        monkeypatch.setattr(settings, "llm_provider", "groq", raising=False)

        called = {}

        class FakeGeminiProvider:
            async def generate_report(self, target, findings, scan_metadata):
                called["target"] = target
                called["findings"] = findings
                called["scan_metadata"] = scan_metadata
                return "# Gemini report"

        monkeypatch.setattr("pentest_mcp.llm_providers.GeminiProvider", lambda: FakeGeminiProvider())

        session = ScanSession(
            session_id="test-session",
            target="http://example.test",
            mode="quick",
            started_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
            findings=[],
        )

        report = await generate_report(session)

        assert called["target"] == "http://example.test"
        assert report.startswith("<!-- generated-by: gemini -->")
        assert "# Gemini report" in report
        assert "<!-- generated-by: basic-formatter -->" not in report

    asyncio.run(_run())


def test_analysis_generate_report_saves_shared_and_session_copy(monkeypatch, tmp_path):
    async def _run():
        monkeypatch.setattr(settings, "session_dir", tmp_path / "sessions", raising=False)
        monkeypatch.setattr(settings, "reports_dir", tmp_path / "reports", raising=False)
        settings.session_dir.mkdir(parents=True, exist_ok=True)
        settings.reports_dir.mkdir(parents=True, exist_ok=True)

        session_mgr = SessionManager()
        session_id = session_mgr.create_session("http://example.test")
        await session_mgr.init_db(session_id)

        finding = Finding(
            id="finding-1",
            tool="demo-tool",
            severity=Severity.HIGH,
            title="Demo finding",
            description="A test finding for the report pipeline.",
            evidence={"proof": "demo"},
        )
        await session_mgr.save_finding(session_id, finding)

        summary = session_mgr.read_summary(session_id)
        summary.current_phase = Phase.ANALYSIS_COMPLETE
        summary.scan_mode = "quick"
        summary.scan_start_time = datetime.now(timezone.utc)
        summary.scan_end_time = datetime.now(timezone.utc)
        session_mgr._write_summary(session_id, summary)

        async def fake_render_report(session):
            return "# Report\n\nRendered by Gemini."

        monkeypatch.setattr(analysis_module, "render_report", fake_render_report)

        result = await analysis_module.generate_report(session_id)

        shared_report_path = Path(result["report_path"])
        legacy_report_path = Path(result["legacy_report_path"])

        assert shared_report_path.exists()
        assert legacy_report_path.exists()
        assert shared_report_path.parent == settings.reports_dir
        assert legacy_report_path.parent == session_mgr.get_session_path(session_id)
        assert shared_report_path.read_text(encoding="utf-8") == legacy_report_path.read_text(encoding="utf-8")

        updated_summary = session_mgr.read_summary(session_id)
        assert updated_summary.report_path == str(shared_report_path)

    asyncio.run(_run())


def test_get_report_rejects_empty_session(monkeypatch, tmp_path):
    async def _run():
        monkeypatch.setattr(settings, "session_dir", tmp_path / "sessions", raising=False)
        monkeypatch.setattr(settings, "reports_dir", tmp_path / "reports", raising=False)
        settings.session_dir.mkdir(parents=True, exist_ok=True)
        settings.reports_dir.mkdir(parents=True, exist_ok=True)

        session_mgr = SessionManager()
        session_id = session_mgr.create_session("http://example.test")
        await session_mgr.init_db(session_id)
        monkeypatch.setattr(mcp_server, "session_mgr", session_mgr)

        result = await mcp_server.call_tool("get_report", {"session_id": session_id})
        assert result
        assert "No findings were recorded for session" in result[0].text

    asyncio.run(_run())


def test_gemini_report_prompt_includes_target(monkeypatch):
    class FakeResponse:
        text = "# Report\n"

    captured = {}

    class FakeModels:
        async def generate_content(self, **kwargs):
            captured.update(kwargs)
            return FakeResponse()

    class FakeClient:
        def __init__(self):
            self.aio = type("AIO", (), {"models": FakeModels()})()

    monkeypatch.setattr(GeminiProvider, "client", property(lambda self: FakeClient()))

    async def _run():
        provider = GeminiProvider()
        await provider.generate_report(
            "http://localhost:3001",
            [{"tool": "demo", "severity": "low", "title": "Test", "description": "Demo"}],
            {"mode": "quick"},
        )

    asyncio.run(_run())
    assert "http://localhost:3001" in captured["contents"]


def test_report_engine_replaces_placeholder_target():
    from pentest_mcp.report_engine import _finalize_report

    report = """# Security Assessment Report — [Target System Name]

Target: [Target System Name]
"""

    cleaned = _finalize_report(report, "http://localhost:3001")

    assert "[Target System Name]" not in cleaned
    assert "http://localhost:3001" in cleaned


def test_report_engine_collapses_duplicate_target_in_title():
    from pentest_mcp.report_engine import _finalize_report

    report = """# Security Assessment Report — http://localhost:3001 — http://localhost:3001

## Executive Summary
"""

    cleaned = _finalize_report(report, "http://localhost:3001")

    assert cleaned.startswith("# Security Assessment Report — http://localhost:3001")
    assert cleaned.splitlines()[0] == "# Security Assessment Report — http://localhost:3001"
