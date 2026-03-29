# Reports Directory

## New Report Location

As of the latest version, all scan reports are now saved to:

```
~/.pentest-mcp/sessions/<session_id>/report.md
```

This directory contains legacy reports from previous scans.

## Accessing Reports

After running a scan, Claude will tell you the exact path to your report. You can also find it by session ID:

```bash
ls ~/.pentest-mcp/sessions/
```

Each session directory contains:
- `report.md` - Full scan report with AI analysis
- `session.db` - SQLite database with findings
- `summary.json` - Session metadata
