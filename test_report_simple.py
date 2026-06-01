import asyncio
from datetime import datetime, timezone
from pentest_mcp.report_engine import generate_report
from pentest_mcp.models import ScanSession

async def test_report():
    session = ScanSession(
        session_id='test',
        target='http://localhost:3001',
        mode='quick',
        started_at=datetime.now(timezone.utc),
        completed_at=datetime.now(timezone.utc),
        findings=[]
    )
    res = await generate_report(session)
    print(res[:100])

asyncio.run(test_report())
