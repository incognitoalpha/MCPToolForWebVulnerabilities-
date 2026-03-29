<p align="center">
  <h1 align="center">🛡️ PenTest MCP Server</h1>
  <p align="center">
    <strong>AI-Powered Penetration Testing via Model Context Protocol</strong>
  </p>
  <p align="center">
    An MCP server that integrates 30+ security tools with Groq LLM analysis,<br/>
    designed to run natively inside <strong>Claude Desktop</strong>.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/python-3.11+-blue?logo=python&logoColor=white" alt="Python 3.11+"/>
    <img src="https://img.shields.io/badge/MCP-v1.26-green?logo=data:image/svg+xml;base64,..." alt="MCP"/>
    <img src="https://img.shields.io/badge/LLM-Groq%20Llama%203.1-orange?logo=meta" alt="Groq"/>
    <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License"/>
  </p>
</p>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLAUDE DESKTOP (UI)                    │
│  User asks: "Run a medium scan on example.com"           │
└──────────────────┬───────────────────────────────────────┘
                   │ MCP Protocol (JSON-RPC over stdio)
                   ▼
┌──────────────────────────────────────────────────────────┐
│               PENTEST MCP SERVER (Python)                │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   Session    │  │  Scan Mode   │  │   Tool         │  │
│  │   Manager    │  │  Orchestrator│  │   Registry     │  │
│  └─────────────┘  └──────┬───────┘  └────────────────┘  │
│                          │                               │
│         ┌────────────────┼────────────────┐              │
│         ▼                ▼                ▼              │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐     │
│  │   nmap     │  │   sqlmap   │  │   ffuf         │     │
│  │   nuclei   │  │   dalfox   │  │   nikto        │     │
│  │   sslyze   │  │   commix   │  │   gobuster     │     │
│  │   wafw00f  │  │   arjun    │  │   subfinder    │     │
│  │   ... 30+  │  │   ...      │  │   ...          │     │
│  └────────────┘  └────────────┘  └────────────────┘     │
│                          │                               │
│                          ▼                               │
│              ┌──────────────────────┐                    │
│              │    GROQ API          │                    │
│              │  (Llama 3.1 70B)    │                    │
│              │  Triage · Analysis  │                    │
│              │  CVSS · Reporting   │                    │
│              └──────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

## ✨ Features

| Feature | Description |
|---|---|
| **3 Scan Modes** | Quick (5-10 min), Medium (15-30 min), Extensive (45+ min) — each with distinct depth and AI analysis |
| **30+ Security Tools** | nmap, sqlmap, nuclei, ffuf, dalfox, nikto, wafw00f, subfinder, sslyze, and more |
| **AI-Powered Analysis** | Groq LLM (Llama 3.1 70B) performs vulnerability triage, CVSS scoring, and generates executive reports |
| **Claude Desktop Native** | Runs as an MCP server — talk to it in natural language, reports render directly in chat |
| **Session Management** | Track, pause, and resume security assessments across multiple targets |
| **OWASP Top 10 Coverage** | Systematic scanning mapped to OWASP 2021 categories |
| **Smart Fallbacks** | If a professional tool isn't installed, Python-native implementations fill the gap |

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Scan Modes](#-scan-modes)
- [Supported Tools](#-supported-tools)
- [Usage Examples](#-usage-examples)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Security Notice](#-security-notice)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **[uv](https://docs.astral.sh/uv/)** (Python package manager)
- **[Groq API Key](https://console.groq.com/keys)** (free tier available)
- **Claude Desktop** (for the MCP integration)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/MCPToolForWebVulnerabilities
cd MCPToolForWebVulnerabilities

# Install dependencies
uv sync
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_your_key_here
```

### 3. Install Security Tools (Optional)

The server works with Python-native fallbacks, but for professional-grade scanning, install the external tools:

```bash
# macOS (Homebrew)
brew install nmap sqlmap

# Install ffuf (Go-based fuzzer)
go install github.com/ffuf/ffuf/v2@latest

# Install nuclei (vulnerability scanner)
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Install subfinder (subdomain discovery)
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
```

> **Tip:** Run `session_init` to see which tools are detected on your system.

### 4. Connect to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pentest-mcp": {
      "command": "/FULL/PATH/TO/pentest-mcp/.venv/bin/python",
      "args": ["/FULL/PATH/TO/pentest-mcp/run_mcp_server.py"],
      "env": {
        "GROQ_API_KEY": "gsk_your_key_here"
      }
    }
  }
}
```

> Replace `/FULL/PATH/TO/pentest-mcp` with your actual project path.

### 5. Restart Claude Desktop

Quit and reopen Claude Desktop. Look for the 🔌 icon showing `pentest-mcp` as connected.

### 6. Start Scanning!

```
Run a quick scan on https://example.com with consent confirmed
```

## 🎯 Scan Modes

### Quick Mode (5-10 minutes)
Fast triage for immediate risk assessment.

| Test | Tool |
|---|---|
| WAF Detection | wafw00f / custom |
| DNS Enumeration | dnsrecon / custom |
| Port Scan (top 20) | nmap / custom |
| Header Analysis | custom |
| TLS/SSL Audit | sslyze / custom |
| Tech Fingerprinting | whatweb / custom |
| Sensitive File Discovery | ffuf / custom |

### Medium Mode (15-30 minutes)
Standard penetration test covering OWASP Top 10.

| Test | Tool |
|---|---|
| Everything in Quick | — |
| Port Scan (top 100) | nmap |
| XSS Scanning | dalfox / custom |
| SQL Injection | sqlmap |
| Directory Discovery | ffuf / gobuster |
| CORS Misconfiguration | corscanner / custom |
| Path Traversal | custom |
| Open Redirect | custom |
| CSRF Checks | custom |

### Extensive Mode (45+ minutes)
Board-level comprehensive security assessment.

| Test | Tool |
|---|---|
| Everything in Medium | — |
| Port Scan (top 1000) | nmap / masscan |
| Subdomain Enumeration | subfinder / amass |
| Advanced Fuzzing | wfuzz / ffuf |
| SSRF Probing | custom |
| Secret Scanning | trufflehog |
| Git Exposure | git-dumper |
| JWT Analysis | jwt_tool |
| GraphQL Security | graphql-cop |
| Command Injection | commix |

## 🔧 Supported Tools

The server integrates **30+ security tools** with automatic detection. If a tool isn't installed, Python-native fallbacks ensure the scan still runs.

<details>
<summary><strong>Full Tool List (click to expand)</strong></summary>

| Tool | Category | Required |
|---|---|---|
| nmap | Port scanning | Optional (has fallback) |
| sqlmap | SQL injection | Optional |
| ffuf | Fuzzing / file discovery | Optional (has fallback) |
| nuclei | Vulnerability scanning | Optional |
| dalfox | XSS scanning | Optional |
| subfinder | Subdomain discovery | Optional |
| wafw00f | WAF detection | Optional (has fallback) |
| sslyze | TLS/SSL audit | Optional (has fallback) |
| nikto | Web server scanning | Optional |
| gobuster | Directory brute-forcing | Optional |
| whatweb | Tech fingerprinting | Optional (has fallback) |
| wfuzz | Advanced fuzzing | Optional |
| arjun | Hidden parameter discovery | Optional |
| testssl | SSL/TLS testing | Optional |
| masscan | Fast port scanning | Optional |
| amass | OSINT / subdomain enum | Optional |
| dnsrecon | DNS enumeration | Optional (has fallback) |
| theHarvester | Email/domain OSINT | Optional |
| retire.js | JS library CVE scanning | Optional |
| trufflehog | Secret detection | Optional |
| git-dumper | Git repo exposure | Optional |
| commix | Command injection | Optional |
| corscanner | CORS misconfiguration | Optional (has fallback) |
| jwt_tool | JWT analysis | Optional |
| graphql-cop | GraphQL security | Optional |
| xsstrike | Advanced XSS | Optional |
| hydra | Brute-forcing | Optional |
| shodan | Internet intelligence | Optional |
| enum4linux-ng | SMB enumeration | Optional |

</details>

## 💬 Usage Examples

See [`CLAUDE_PROMPTS.md`](CLAUDE_PROMPTS.md) for a full list of example prompts. Here are some highlights:

### Unified Scanning
```
Run a quick triage scan on example.com. Generate a report and tell me the findings.
Perform an extensive scan on example.com including deep recon and directory fuzzing.
```

### Individual Tools
```
What subdomains can you find for example.com? Run a discovery scan.
Run a port scan on example.com and fingerprint the web technologies.
Check for Cross-Site Scripting (XSS) on example.com/search.
```

### AI Analysis
```
Analyze our current session findings. Are there any critical risks?
Generate a final markdown report for the current session.
Give me a CVSS 3.1 score for the SQLi vulnerability we just found.
```

## 📁 Project Structure

```
pentest-mcp/
├── run_mcp_server.py          # Entry point — launches MCP server
├── pentest_mcp/
│   ├── server.py              # MCP tool definitions & request handling
│   ├── scan_modes.py          # Quick/Medium/Extensive scan orchestration
│   ├── prompts.py             # Severity-specific Groq system prompts
│   ├── groq_client.py         # Groq API integration
│   ├── session.py             # Session state management
│   ├── models.py              # Pydantic data models
│   ├── config.py              # Environment & settings
│   ├── cli.py                 # CLI interface (alternative to MCP)
│   ├── risk_scorer.py         # Risk scoring engine
│   ├── command_chain.py       # Tool execution chaining
│   ├── tools/
│   │   ├── __init__.py        # Python-native security tools
│   │   └── professional.py    # External tool wrappers (nmap, sqlmap, etc.)
│   └── utils/
│       └── sanitizer.py       # Input validation & sanitization
├── tests/
│   └── test_session.py        # Session management tests
├── wordlists/                 # Fuzzing wordlists for ffuf/gobuster
├── reports/                   # Generated scan reports (Markdown)
├── CLAUDE_PROMPTS.md          # Example prompts for Claude Desktop
├── pyproject.toml             # Project dependencies & metadata
├── Makefile                   # Development shortcuts
├── install_tools.sh           # Security tool installer script
└── .env.example               # Environment variable template
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Your Groq API key | Required |
| `GROQ_MODEL` | LLM model for analysis | `llama-3.1-70b-versatile` |
| `GROQ_MAX_TOKENS` | Max response tokens | `8192` |
| `GROQ_TEMPERATURE` | LLM temperature | `0.2` |
| `SESSION_DIR` | Session storage path | `~/.pentest-mcp/sessions` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |

### AI Analysis Pipeline

Each scan mode uses **distinct Groq system prompts** calibrated to the scan depth:

- **Quick**: Concise triage — focuses only on critical/high severity findings
- **Medium**: OWASP Top 10 analysis with balanced risk assessment and remediation
- **Extensive**: Board-level executive summary with exhaustive CVSS-scored findings, compliance mapping, and strategic recommendations

## 🔍 Troubleshooting

### Server Not Connecting
```bash
# Check Claude Desktop logs
tail -f ~/Library/Logs/Claude/mcp*.log

# Verify the server starts manually
/path/to/pentest-mcp/.venv/bin/python /path/to/pentest-mcp/run_mcp_server.py
```

### JSON Parse Errors in Logs
The MCP protocol uses stdout for JSON-RPC. If you see parse errors, ensure no libraries are logging to stdout. The server is pre-configured to redirect all logs to stderr.

### `Read-only file system` Error
Reports are saved to `<project_root>/reports/`. Ensure the project directory is writable.

### Groq API Errors
- Verify your API key: `echo $GROQ_API_KEY`
- Check rate limits at [console.groq.com](https://console.groq.com)
- The server continues scanning even if Groq is unavailable — raw tool output is still returned

### Tools Not Detected
Run `session_init` to see which tools are available. Install missing tools via Homebrew or your package manager. Python fallbacks cover core functionality even without external tools.

## ⚠️ Security Notice

> **This tool is for authorized security testing only.**
>
> - Always obtain **explicit written permission** before scanning any target
> - Unauthorized testing violates the **Computer Fraud and Abuse Act (CFAA)**, **IT Act 2000/2008**, and similar laws worldwide
> - The `consent_confirmed` parameter exists as an ethical safeguard — never bypass it
> - **Never commit API keys** to version control

## 📝 License

See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with</strong> 🐍 Python · 🤖 MCP Protocol · 🧠 Groq AI · 🛡️ OWASP Standards
</p>
