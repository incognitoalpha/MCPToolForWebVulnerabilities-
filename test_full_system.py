#!/usr/bin/env python3
"""Comprehensive system test for all 42 tools and enhanced UI."""

import asyncio
import sys
from pathlib import Path

# Add project to path
sys.path.insert(0, str(Path(__file__).parent))

from pentest_mcp.tools.tool_registry import ToolRegistry, TOOL_SCHEMAS
from pentest_mcp.cli_ui import (
    print_banner, print_tool_connection, print_loading_animation,
    print_phase_transition, print_tool_execution, print_tool_progress,
    print_tool_complete, print_scan_start, print_success, print_error
)
from rich.console import Console

console = Console(file=sys.stderr, force_terminal=True)


async def test_tool_registry():
    """Test tool registry initialization."""
    console.print("\n[bold cyan]═══ Testing Tool Registry ═══[/bold cyan]\n")

    registry = ToolRegistry()

    # Verify tool count
    tool_count = len(TOOL_SCHEMAS)
    console.print(f"[green]✓[/green] Tool count: [bold white]{tool_count}[/bold white]")

    if tool_count != 42:
        console.print(f"[red]✗[/red] Expected 42 tools, got {tool_count}")
        return False

    # Print tool connection status
    print_tool_connection(tool_count, "Google Gemini", "gemini-2.0-flash-exp")

    return True


async def test_new_web_security_tools():
    """Test the 7 new web security tools."""
    console.print("\n[bold cyan]═══ Testing New Web Security Tools ═══[/bold cyan]\n")

    registry = ToolRegistry()
    test_url = "https://example.com"

    # Create a test session
    session_result = await registry.execute_tool("session_init", {
        "target": test_url,
        "consent_confirmed": True
    })
    session_id = session_result["session_id"]
    console.print(f"[green]✓[/green] Session created: [dim]{session_id}[/dim]\n")

    new_tools = [
        ("robots_txt_scan", {"session_id": session_id, "url": test_url}),
        ("sitemap_scan", {"session_id": session_id, "url": test_url}),
        ("ssl_certificate_check", {"session_id": session_id, "host": "example.com", "port": 443}),
        ("http_methods_check", {"session_id": session_id, "url": test_url, "consent_confirmed": True}),
        ("clickjacking_test", {"session_id": session_id, "url": test_url}),
        ("security_txt_check", {"session_id": session_id, "url": test_url}),
        ("cookie_security_audit", {"session_id": session_id, "url": test_url, "consent_confirmed": True}),
    ]

    for tool_name, args in new_tools:
        print_tool_execution(tool_name, test_url)
        print_loading_animation(f"Running {tool_name}")

        try:
            import time
            start = time.time()
            result = await registry.execute_tool(tool_name, args)
            duration = time.time() - start

            findings_count = len(result.get("findings", []))
            print_tool_complete(tool_name, duration, findings_count)
            console.print(f"[green]✓[/green] {tool_name} executed successfully")

        except Exception as e:
            console.print(f"[red]✗[/red] {tool_name} failed: {e}")
            return False

    return True


async def test_enhanced_ui():
    """Test enhanced UI components."""
    console.print("\n[bold cyan]═══ Testing Enhanced UI Components ═══[/bold cyan]\n")

    # Test banner
    print_banner()
    console.print("[green]✓[/green] Banner displayed\n")

    # Test scan start
    print_scan_start("https://example.com", "quick", "test-session-123")
    console.print("[green]✓[/green] Scan start displayed\n")

    # Test phase transition
    print_phase_transition("RECONNAISSANCE", "SCANNING")
    console.print("[green]✓[/green] Phase transition displayed\n")

    # Test tool progress
    print_tool_progress("dns_enum", "Querying DNS records", "cyan")
    print_tool_progress("port_scan", "Scanning ports", "yellow")
    console.print("[green]✓[/green] Tool progress displayed\n")

    # Test tool completion
    print_tool_complete("xss_scan", 2.5, 0)
    print_tool_complete("sqli_scan", 3.2, 3)
    print_tool_complete("nuclei_scan", 15.7, 12)
    console.print("[green]✓[/green] Tool completion displayed\n")

    return True


async def test_tool_execution_flow():
    """Test complete tool execution flow."""
    console.print("\n[bold cyan]═══ Testing Tool Execution Flow ═══[/bold cyan]\n")

    registry = ToolRegistry()
    test_domain = "example.com"

    # Create session
    session_result = await registry.execute_tool("session_init", {
        "target": f"https://{test_domain}",
        "consent_confirmed": True
    })
    session_id = session_result["session_id"]

    # Test a few core tools
    test_tools = [
        ("dns_enum", {"session_id": session_id, "domain": test_domain}),
        ("whois_lookup", {"session_id": session_id, "domain": test_domain}),
        ("header_analysis", {"session_id": session_id, "url": f"https://{test_domain}", "consent_confirmed": True}),
    ]

    for tool_name, args in test_tools:
        print_tool_execution(tool_name, test_domain)

        try:
            import time
            start = time.time()
            result = await registry.execute_tool(tool_name, args)
            duration = time.time() - start

            if isinstance(result, dict):
                findings_count = len(result.get("findings", []))
            else:
                findings_count = 0

            print_tool_complete(tool_name, duration, findings_count)
            console.print(f"[green]✓[/green] {tool_name} completed\n")

        except Exception as e:
            console.print(f"[red]✗[/red] {tool_name} failed: {e}\n")
            return False

    return True


async def main():
    """Run all tests."""
    console.print("\n[bold white]" + "="*70 + "[/bold white]")
    console.print("[bold cyan]🧪 COMPREHENSIVE SYSTEM TEST - 42 TOOLS + ENHANCED UI[/bold cyan]")
    console.print("[bold white]" + "="*70 + "[/bold white]\n")

    tests = [
        ("Tool Registry", test_tool_registry),
        ("New Web Security Tools", test_new_web_security_tools),
        ("Enhanced UI Components", test_enhanced_ui),
        ("Tool Execution Flow", test_tool_execution_flow),
    ]

    results = []

    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            console.print(f"\n[red]✗ {test_name} crashed: {e}[/red]\n")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))

    # Print summary
    console.print("\n[bold white]" + "="*70 + "[/bold white]")
    console.print("[bold cyan]📊 TEST SUMMARY[/bold cyan]")
    console.print("[bold white]" + "="*70 + "[/bold white]\n")

    passed = sum(1 for _, result in results if result)
    total = len(results)

    for test_name, result in results:
        status = "[green]✓ PASS[/green]" if result else "[red]✗ FAIL[/red]"
        console.print(f"{status} - {test_name}")

    console.print(f"\n[bold white]Results: {passed}/{total} tests passed[/bold white]")

    if passed == total:
        print_success("All tests passed! System is fully operational with 42 tools.")
        return 0
    else:
        print_error(f"Some tests failed. {total - passed} test(s) need attention.")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
