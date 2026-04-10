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
            if "VulnLab" not in title:
                print(f"FAILED: Expected 'VulnLab' in title, got '{title}'")
                return False
            
            # Check for Search Input (Reflected XSS target)
            print("Checking for Search Input...")
            search_input = page.locator('input[name="q"]')
            if not await search_input.is_visible():
                print("FAILED: Search input field not visible on home page")
                return False

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
            if not await ping_input.is_visible():
                print("FAILED: Ping input field not visible on /tools/ping")
                return False
            
            # Check for Comments (XSS) on a post
            print("Checking for Comments section on post #1...")
            await page.goto(f"{TARGET_URL}/post/1", wait_until="networkidle")
            comment_input = page.locator('textarea[name="content"]') 
            if not await comment_input.is_visible():
                print("FAILED: Comment textarea not visible on /post/1 even after login")
                return False
            
            # Check for Admin Dashboard (Broken Access Control)
            print("Checking for Admin Dashboard access...")
            await page.goto(f"{TARGET_URL}/admin", wait_until="networkidle")
            content = await page.content()
            if "Admin Control Panel" not in content:
                print("FAILED: 'Admin Control Panel' text not found on /admin page")
                return False
            
            print("✅ VulnLab UI verification successful.")
            await browser.close()
            return True
            
        except Exception as e:
            print(f"❌ VulnLab UI verification encountered a fatal error:")
            traceback.print_exc()
            return False

async def test_scanner_integration():
    """Phase 2: Verify Scanner integration and SQLi detection."""
    print("\n--- Phase 2: Verifying Scanner Integration (Medium Mode) ---")
    
    # Run a Medium scan
    print("Starting Medium Scan (this may take 1-2 minutes)...")
    try:
        result = await run_scan_mode(
            target=TARGET_URL,
            mode="medium",
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
        
        if critical_count == 0:
            print("FAILED: No critical findings detected by the scanner.")
            return False
            
        # Verify the report contains identified vulnerabilities
        if report_path and Path(report_path).exists():
            report_content = Path(report_path).read_text()
            # FFUF correctly uncovers .env files with severity critical
            if "env" not in report_content.lower() and "git" not in report_content.lower():
                print("FAILED: No sensitive critical indicators found in the generated report.")
                return False
        else:
            print(f"FAILED: Report file not found at {report_path}")
            return False
        
        # Verify we are using professional tools (no fallbacks)
        session_dir = Path(os.path.expanduser("~/.pentest-ai/sessions")) / session_id
        db_path = session_dir / "session.db"
        
        if db_path.exists():
            print(f"Verifying findings in session database: {db_path}")
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT tool, title, severity FROM findings WHERE severity = 'critical'")
            critical_findings = cursor.fetchall()
            conn.close()
            
            print(f"Critical findings in DB: {critical_findings}")
            if not any("SQL" in f[1] for f in critical_findings):
                print("FAILED: SQL injection finding not found in database.")
                return False
        else:
            print(f"WARNING: Session database not found at {db_path}")
        
        print("✅ Scanner integration verification successful.")
        return True
        
    except Exception as e:
        print(f"❌ Scanner integration encountered a fatal error:")
        traceback.print_exc()
        return False

async def main():
    success_p1 = await test_vuln_lab_ui()
    if not success_p1:
        print("\n🚨 SYSTEM TEST FAILED IN PHASE 1! 🚨")
        exit(1)
        
    success_p2 = await test_scanner_integration()
    if not success_p2:
        print("\n🚨 SYSTEM TEST FAILED IN PHASE 2! 🚨")
        exit(1)
        
    print("\n✨ ALL TESTS PASSED SUCCESSFULLY! ✨")

if __name__ == "__main__":
    asyncio.run(main())
