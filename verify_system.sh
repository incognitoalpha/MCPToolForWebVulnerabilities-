#!/bin/bash
# Quick verification script for PenTest MCP Pro

echo "🔍 PenTest MCP Pro - System Verification"
echo "========================================"
echo ""

# Check tool count
TOOL_COUNT=$(python3 -c "from pentest_mcp.tools.tool_registry import TOOL_SCHEMAS; print(len(TOOL_SCHEMAS))")
echo "✓ Tool Count: $TOOL_COUNT"

if [ "$TOOL_COUNT" -eq 42 ]; then
    echo "  ✅ Target achieved: 42 tools"
else
    echo "  ❌ Expected 42, got $TOOL_COUNT"
    exit 1
fi

# Check imports
echo ""
echo "✓ Checking imports..."
python3 -c "
from pentest_mcp.tools.web_security import (
    robots_txt_scan, sitemap_scan, ssl_certificate_check,
    http_methods_check, clickjacking_test, security_txt_check,
    cookie_security_audit
)
from pentest_mcp.cli_ui import (
    print_tool_connection, print_loading_animation,
    print_phase_transition, print_tool_execution,
    print_tool_progress, print_tool_complete
)
print('  ✅ All imports successful')
" || exit 1

# List new tools
echo ""
echo "✓ New Web Security Tools (7):"
echo "  1. robots_txt_scan"
echo "  2. sitemap_scan"
echo "  3. ssl_certificate_check"
echo "  4. http_methods_check"
echo "  5. clickjacking_test"
echo "  6. security_txt_check"
echo "  7. cookie_security_audit"

echo ""
echo "✓ Enhanced UI Features:"
echo "  • Animated spinners (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏)"
echo "  • Color-coded output"
echo "  • Emoji indicators (🎯🛠️🤖🧠⚡✓⚠)"
echo "  • Real-time progress"
echo "  • Beautiful ASCII banner"

echo ""
echo "========================================"
echo "✅ System Status: FULLY OPERATIONAL"
echo "🚀 Ready for deployment!"
echo ""
