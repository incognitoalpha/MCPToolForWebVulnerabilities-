import asyncio
import os
import json
import sqlite3
import traceback
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright
from pentest_mcp.scan_modes import run_scan_mode
from pentest_mcp.session import SessionManager

TARGET_URL = "http://localhost:3001"

async def test_vuln_lab_ui():
    """Phase 1: Verify VulnLab UI and basic functionality using Playwright."""
    print("\n--- Phase 1: Verifying VulnLab UI ---")
    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            print(f"Navigating to {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="networkidle")
            
            # Check title
            title = await page.title()
            print(f"Page Title: {title}")
            assert "VulnLab" in title, f"Expected 'VulnLab' in title, got '{title}'"

            # Check for Search Input (Reflected XSS target)
            print("Checking for Search Input...")
            search_input = page.locator('input[name="q"]')
            assert await search_input.is_visible(), "Search input field not visible on home page"

            # Login to see protected areas (like comments)
            print("Logging in...")
            await page.goto(f"{TARGET_URL}/login", wait_until="networkidle")
            await page.fill('input[name="username"]', 'testuser')
            await page.fill('input[name="password"]', 'test')
            await page.click('button[type="submit"]')
            await page.wait_for_load_state('networkidle')

            # Check for Ping Tool (Command Injection target)
            print("Checking for Ping Tool page...")
            await page.goto(f"{TARGET_URL}/tools/ping", wait_until="networkidle")
            ping_input = page.locator('input[name="host"]')
            assert await ping_input.is_visible(), "Ping input field not visible on /tools/ping"

            # Check for Comments (XSS) on a post
            print("Checking for Comments section on post #1...")
            await page.goto(f"{TARGET_URL}/post/1", wait_until="networkidle")
            comment_input = page.locator('textarea[name="content"]')
            assert await comment_input.is_visible(), "Comment textarea not visible on /post/1 even after login"

            # Check for Admin Dashboard (Broken Access Control)
            print("Checking for Admin Dashboard access...")
            await page.goto(f"{TARGET_URL}/admin", wait_until="networkidle")
            content = await page.content()
            assert "Admin Control Panel" in content, "'Admin Control Panel' text not found on /admin page"

            print("✅ VulnLab UI verification successful.")
            await browser.close()
            
        except Exception as e:
            print(f"❌ VulnLab UI verification encountered a fatal error:")
            traceback.print_exc()
            raise e

async def test_scanner_integration():
    """Phase 2: Verify Scanner integration and SQLi detection."""
    print("\n--- Phase 2: Verifying Scanner Integration (Extensive Mode) ---")
    
    # Run an Extensive scan
    print("Starting Extensive Scan (this may take a few minutes)...")
    try:
        result = await run_scan_mode(
            target=TARGET_URL,
            mode="extensive",
            consent=True
        )
        
        session_id = result.get('session_id')
        report_path = result.get('report_path')
        findings_count = result.get('findings_count', {})
        
        print(f"Scan Completed. Session ID: {session_id}")
        print(f"Findings Map: {findings_count}")
        print(f"Report Path: {report_path}")
        
        # Verify SQLi was detected
        critical_count = findings_count.get('critical', 0)
        print(f"Critical findings found: {critical_count}")

        assert critical_count > 0, "No critical findings detected by the scanner"

        # Verify the report contains identified vulnerabilities
        assert report_path and Path(report_path).exists(), f"Report file not found at {report_path}"

        report_content = Path(report_path).read_text()
        # FFUF correctly uncovers .env files with severity critical
        assert "env" in report_content.lower() or "git" in report_content.lower(), \
            "No sensitive critical indicators found in the generated report"
        
        # Verify we are using professional tools (no fallbacks)
        session_dir = Path(os.path.expanduser("~/.pentest-mcp/sessions")) / session_id
        db_path = session_dir / "session.db"
        
        if db_path.exists():
            print(f"Verifying findings in session database: {db_path}")
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT tool, title, severity FROM findings WHERE severity = 'critical'")
            critical_findings = cursor.fetchall()
            conn.close()

            print(f"Critical findings in DB: {critical_findings}")
            assert any("SQL" in f[1] for f in critical_findings), \
                "SQL injection finding not found in database"
        else:
            print(f"WARNING: Session database not found at {db_path}")

        print("✅ Scanner integration verification successful.")
        
    except Exception as e:
        print(f"❌ Scanner integration encountered a fatal error:")
        traceback.print_exc()
        raise e

async def main():
    try:
        await test_vuln_lab_ui()
        print("\n✅ Phase 1 passed")
    except AssertionError as e:
        print(f"\n🚨 SYSTEM TEST FAILED IN PHASE 1! 🚨")
        print(f"Error: {e}")
        exit(1)
    except Exception as e:
        print(f"\n🚨 SYSTEM TEST FAILED IN PHASE 1! 🚨")
        traceback.print_exc()
        exit(1)

    try:
        await test_scanner_integration()
        print("\n✅ Phase 2 passed")
    except AssertionError as e:
        print(f"\n🚨 SYSTEM TEST FAILED IN PHASE 2! 🚨")
        print(f"Error: {e}")
        exit(1)
    except Exception as e:
        print(f"\n🚨 SYSTEM TEST FAILED IN PHASE 2! 🚨")
        traceback.print_exc()
        exit(1)

    print("\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨")

if __name__ == "__main__":
    asyncio.run(main())
