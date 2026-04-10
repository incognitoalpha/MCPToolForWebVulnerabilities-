#!/usr/bin/env python3
"""Quick demo of the enhanced UI with 42 tools."""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from pentest_mcp.cli_ui import (
    print_banner,
    print_scan_start,
    print_tool_connection,
    print_tool_execution,
    print_tool_complete,
    print_phase_transition,
    print_scan_complete,
    print_success
)
from pentest_mcp.tools.tool_registry import TOOL_SCHEMAS
import time

# Show banner
print_banner()

# Show tool connection
print_tool_connection(len(TOOL_SCHEMAS), "Google Gemini", "gemini-2.0-flash-exp")

# Show scan start
print_scan_start("https://mohit-kumar-sahoo-portfolio.vercel.app/", "quick", "demo-session-123")

# Simulate tool execution
tools = [
    ("dns_enum", "mohit-kumar-sahoo-portfolio.vercel.app", 0.15, 0),
    ("header_analysis", "https://mohit-kumar-sahoo-portfolio.vercel.app/", 0.22, 2),
    ("robots_txt_scan", "https://mohit-kumar-sahoo-portfolio.vercel.app/", 0.18, 1),
    ("ssl_certificate_check", "mohit-kumar-sahoo-portfolio.vercel.app", 0.12, 1),
    ("clickjacking_test", "https://mohit-kumar-sahoo-portfolio.vercel.app/", 0.09, 0),
    ("tech_fingerprint", "https://mohit-kumar-sahoo-portfolio.vercel.app/", 0.31, 3),
]

print_phase_transition("INITIALIZATION", "RECONNAISSANCE")

for tool_name, target, duration, findings in tools:
    print_tool_execution(tool_name, target)
    time.sleep(0.3)  # Simulate work
    print_tool_complete(tool_name, duration, findings)

print_phase_transition("RECONNAISSANCE", "ANALYSIS")

# Show completion
findings_count = {
    "critical": 0,
    "high": 1,
    "medium": 3,
    "low": 2,
    "info": 1
}

print_scan_complete(
    "demo-session-123",
    "45.2s",
    findings_count,
    "reports/demo_scan_report.md"
)

print_success("Scan completed successfully! All 42 tools available and working.")
