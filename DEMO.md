# Demo Guide - PenTest MCP

## Prerequisites

1. **Install dependencies:**
   ```bash
   pip install -e .
   ```

2. **Start vulnerable test app:**
   ```bash
   cd vulnerable-app
   npm install
   npm start
   # App runs on http://localhost:3001
   ```

3. **Configure Claude Desktop** (see CLAUDE_DESKTOP_CONFIG.md)

## Demo Flow

### 1. Initialize Session

In Claude Desktop:
```
Initialize a security assessment session for http://localhost:3001
```

Claude will call `init_session` and return a session ID.

### 2. Run Quick Scan

```
Run a quick scan on http://localhost:3001 with my consent
```

Claude will:
- Call `quick_scan` with consent=true
- Execute: WAF detection, tech fingerprinting, nuclei, nikto
- Return findings in real-time (5-10 minutes)

### 3. Individual Tool Testing

```
Check if http://localhost:3001 has a Web Application Firewall
```

Claude calls `wafw00f` tool.

```
Scan http://localhost:3001 for XSS vulnerabilities with consent
```

Claude calls `dalfox` tool.

```
Run a port scan on localhost with consent
```

Claude calls `nmap` tool.

### 4. Generate Report

```
Generate the final security report for session [session-id]
```

Claude will:
- Call `get_report` with the session ID
- Load all findings from the session database
- Generate a professional markdown report with:
  - Executive summary
  - Risk breakdown
  - Detailed findings with remediation
  - CVSS scores and CVE references

## Expected Results

**Quick Scan Findings:**
- Vulnerable Express.js version detected
- Missing security headers (X-Frame-Options, CSP)
- SQL injection in login form
- XSS in search parameter
- Exposed .git directory
- Weak session management

**Demo Highlights:**
1. Claude adapts strategy based on findings
2. Real-time tool execution visible in chat
3. Professional report generation
4. Natural language → security tools translation

## Testing Without Claude Desktop

Use MCP Inspector:

```bash
npx @modelcontextprotocol/inspector python3 -m pentest_mcp.mcp_server
```

This opens a web UI at http://localhost:5173 where you can:
- Browse available tools
- Test tool calls with JSON payloads
- See responses in real-time

### Example Test Calls

**Initialize Session:**
```json
{
  "target": "http://localhost:3001"
}
```

**WAF Detection:**
```json
{
  "url": "http://localhost:3001",
  "session_id": "test-session"
}
```

**Quick Scan:**
```json
{
  "target": "http://localhost:3001",
  "consent": true
}
```

## Troubleshooting

**Server won't start:**
- Check Python version: `python3 --version` (need 3.11+)
- Verify MCP installed: `pip show mcp`
- Check imports: `python3 -c "from pentest_mcp.mcp_server import server"`

**Tools not appearing in Claude:**
- Restart Claude Desktop after config changes
- Check config path is correct
- Verify `cwd` points to project directory

**Tool execution fails:**
- Ensure security tools are installed (see install_tools.sh)
- Check consent parameter for active scanning tools
- Verify target is reachable

**Vulnerable app won't start:**
- Check port 3001 is free: `lsof -i :3001`
- Install dependencies: `cd vulnerable-app && npm install`
- Check Node.js version: `node --version`

## Performance Notes

- **Quick scan:** 5-10 minutes (5 tools)
- **Medium scan:** 15-30 minutes (10+ tools)
- **Extensive scan:** 45+ minutes (15+ tools)
- **Individual tools:** 10 seconds - 5 minutes each

## Security Notes

⚠️ **IMPORTANT:**
- Only scan targets you own or have explicit permission to test
- The `consent` parameter is required for active scanning
- Vulnerable-app is for testing only - do not expose to internet
- Some tools (sqlmap, dalfox) perform active exploitation
