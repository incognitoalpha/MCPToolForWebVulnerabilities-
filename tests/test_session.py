"""Tests for session management."""

import pytest
from pathlib import Path
import tempfile
from pentest_mcp.session import SessionManager
from pentest_mcp.models import Phase, NextStep


@pytest.fixture
def temp_session_dir():
    """Create a temporary session directory."""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


def test_create_session(temp_session_dir):
    """Test session creation."""
    mgr = SessionManager(temp_session_dir)
    session_id = mgr.create_session("https://example.com")
    
    assert session_id
    assert len(session_id) == 8
    assert (temp_session_dir / session_id).exists()
    assert (temp_session_dir / session_id / "session_summary.md").exists()


def test_read_summary(temp_session_dir):
    """Test reading session summary."""
    mgr = SessionManager(temp_session_dir)
    session_id = mgr.create_session("https://example.com")
    
    summary = mgr.read_summary(session_id)
    
    assert summary.session_id == session_id
    assert summary.target == "https://example.com"
    assert summary.current_phase == Phase.INIT
    assert len(summary.next_steps) > 0


def test_update_summary(temp_session_dir):
    """Test updating session summary."""
    mgr = SessionManager(temp_session_dir)
    session_id = mgr.create_session("https://example.com")
    
    new_steps = [
        NextStep(tool="xss_scan", reason="Test for XSS", priority=1)
    ]
    
    mgr.update_summary(
        session_id,
        current_phase=Phase.SCANNING_PARTIAL,
        next_steps=new_steps,
        narrative="Started scanning phase"
    )
    
    summary = mgr.read_summary(session_id)
    assert summary.current_phase == Phase.SCANNING_PARTIAL
    assert len(summary.next_steps) == 1
    assert summary.next_steps[0].tool == "xss_scan"


@pytest.mark.asyncio
async def test_save_and_get_findings(temp_session_dir):
    """Test saving and retrieving findings."""
    from pentest_mcp.models import Finding, Severity
    
    mgr = SessionManager(temp_session_dir)
    session_id = mgr.create_session("https://example.com")
    await mgr.init_db(session_id)
    
    finding = Finding(
        id="test123",
        tool="xss_scan",
        severity=Severity.HIGH,
        title="XSS vulnerability",
        description="Reflected XSS found",
        evidence={"param": "q"}
    )
    
    await mgr.save_finding(session_id, finding)
    findings = await mgr.get_findings(session_id)
    
    assert len(findings) == 1
    assert findings[0].id == "test123"
    assert findings[0].severity == Severity.HIGH
