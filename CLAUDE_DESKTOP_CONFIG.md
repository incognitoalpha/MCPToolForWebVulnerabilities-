# Claude Desktop Configuration

## Setup Instructions

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config
.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pentest": {
      "command": "python3",
      "args": [
        "-m",
        "pentest_mcp.mcp_server"
      ],
      "cwd": "/Users/mohitsahoo/Desktop/EC AND AC"
    }
  }
}
```

## Usage

After adding the configuration:

1. Restart Claude Desktop
2. The pentest tools will appear in the tool picker
3. Example prompts:
   - "Initialize a security assessment session for http://localhost:3001"
   - "Run a quick scan on http://localhost:3001 with consent"
   - "Scan http://localhost:3001 for XSS vulnerabilities"
   - "Check if http://localhost:3001 has a WAF"
   - "Generate the final security report"

## Available Tools

### Session Management (2)
- `init_session` - Initialize new security assessment
- `get_report` - Generate final markdown report

### Preset Scans (2)
- `quick_scan` - Fast triage (10-15 min): 9 steps including SSRF/CSRF
- `extensive_scan` - Comprehensive scan (20-45 min): 10 steps including XSS/SQLi

### Individual Tools (25)
- `subfinder` - Subdomain enumeration
- `wafw00f` - WAF detection
- `nmap` - Port scanning
- `nuclei` - Vulnerability scanner
- `sqlmap` - SQL injection testing
- `dalfox` - XSS scanner
- `ffuf` - Web fuzzer
- `sslyze` - TLS/SSL analyzer
- `whatweb` - Tech fingerprinting
- `testssl` - SSL/TLS testing
- `nikto` - Web server scanner
- `gobuster` - Directory brute force
- `wfuzz` - Application fuzzer
- `arjun` - Parameter discovery
- `masscan` - Fast port scanner
- `amass` - Subdomain enumeration
- `dnsrecon` - DNS reconnaissance
- `theharvester` - OSINT gathering
- `retire` - JS library scanner
- `trufflehog` - Secret scanner
- `git_dumper` - .git dumper
- `commix` - Command injection
- `corscanner` - CORS scanner
- `jwt_tool` - JWT testing
- `graphql_cop` - GraphQL scanner

## Testing Without Claude Desktop

Use MCP Inspector:

```bash
npx @modelcontextprotocol/inspector python3 -m pentest_mcp.mcp_server
```

This opens a web UI to test tool calls directly.
