<p align="center">
  <h1 align="center">🛡️ PenTest AI CLI</h1>
  <p align="center">
    <strong>AI-Powered Penetration Testing with Natural Language</strong>
  </p>
  <p align="center">
    A standalone CLI tool that integrates 30+ security tools with Gemini AI analysis.<br/>
    Ask security questions in plain English and get professional reports.
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/python-3.11+-blue?logo=python&logoColor=white" alt="Python 3.11+"/>
    <img src="https://img.shields.io/badge/LLM-Gemini%20Flash%20Lite-orange?logo=google" alt="Gemini"/>
    <img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License"/>
  </p>
</p>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│  $ pentest ask --query "scan for SQLi and XSS" \         │
│                --target http://localhost:3000 --consent  │
└──────────────────┬───────────────────────────────────────┘
                   │ Direct Python execution
                   ▼
┌──────────────────────────────────────────────────────────┐
│            GEMINI-POWERED AGENT (Python)                 │
│                                                          │
│  Phase 1: PLAN    → LLM selects tools from query        │
│  Phase 2: EXECUTE → Runs tools, collects findings       │
│  Phase 3: REPORT  → LLM generates professional report   │
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
│              │    GEMINI API        │                    │
│              │  (Flash Lite)       │                    │
│              │  Triage · Analysis  │                    │
│              │  CVSS · Reporting   │                    │
│              └──────────────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

## ✨ Features

| Feature | Description |
|---|---|
| **Natural Language Interface** | Ask security questions in plain English — AI selects and runs appropriate tools |
| **3 Scan Modes** | Quick (5-10 min), Medium (15-30 min), Extensive (45+ min) — each with distinct depth and AI analysis |
| **30+ Security Tools** | nmap, sqlmap, nuclei, ffuf, dalfox, nikto, wafw00f, subfinder, sslyze, and more |
| **AI-Powered Analysis** | Gemini AI (Flash Lite) performs vulnerability triage, CVSS scoring, and generates executive reports |
| **Automated Tool Selection** | `pentest ask` command for LLM-driven tool planning and execution |
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
- **[Gemini API Key](https://aistudio.google.com/apikey)** (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/pentest-ai-cli
cd pentest-ai-cli

# Install dependencies
uv sync
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
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

### 4. Start Scanning!

```bash
pentest ask \
  --query "run a quick security scan" \
  --target https://example.com \
  --consent
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

The `pentest ask` command uses Gemini AI to automatically plan and execute security scans based on natural language queries.

**Quick vulnerability scan**
```bash
pentest ask \
  --query "scan for SQL injection and XSS vulnerabilities" \
  --target http://localhost:3000 \
  --consent
```

**Full OWASP Top 10 audit**
```bash
pentest ask \
  --query "perform a comprehensive OWASP Top 10 security audit" \
  --target https://example.com \
  --consent
```

**Reconnaissance only**
```bash
pentest ask \
  --query "enumerate subdomains and check for exposed sensitive files" \
  --target example.com \
  --consent
```

**Custom report path**
```bash
pentest ask \
  --query "check security headers and TLS configuration" \
  --target https://example.com \
  --consent \
  --output security-audit-2024.md
```

> 📖 Full Documentation: See [CLI_USAGE_GUIDE.md](CLI_USAGE_GUIDE.md) for detailed usage guide, examples, and troubleshooting.

## 📁 Project Structure

```
pentest-ai/
├── pentest_mcp/
│   ├── scan_modes.py          # Quick/Medium/Extensive scan orchestration
│   ├── agent.py               # Standalone CLI orchestrator
│   ├── session.py             # Session state management
│   ├── models.py              # Pydantic data models
│   ├── config.py              # Environment & settings
│   ├── cli.py                 # CLI interface (includes "ask" command)
│   ├── cli_ui.py              # Beautiful CLI UI components
│   ├── tools/
│   │   ├── __init__.py        # Python-native security tools
│   │   ├── professional.py    # External tool wrappers (nmap, sqlmap, etc.)
│   │   └── tool_registry.py   # Tool execution and result processing
│   └── utils/
│       └── sanitizer.py       # Input validation & sanitization
├── tests/
│   └── test_system.py         # System tests
├── wordlists/                 # Fuzzing wordlists for ffuf/gobuster
├── reports/                   # Generated scan reports (Markdown)
├── CLI_USAGE_GUIDE.md         # Example prompts and detailed usage guide
├── pyproject.toml             # Project dependencies & metadata
├── Makefile                   # Development shortcuts
├── install_tools.sh           # Security tool installer script
└── .env.example               # Environment variable template
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Your Gemini API key | Required |
| `GEMINI_MODEL` | LLM model for analysis | `gemini-flash-lite-latest` |
| `GEMINI_MAX_TOKENS` | Max response tokens | `8192` |
| `GEMINI_TEMPERATURE` | LLM temperature | `0.2` |
| `SESSION_DIR` | Session storage path | `~/.pentest-ai/sessions` |
| `LOG_LEVEL` | Logging verbosity | `INFO` |
| `AGENT_MAX_TOOLS` | Max tools per `pentest ask` run | `10` |

### AI Analysis Pipeline

Each scan mode uses **distinct Gemini AI prompts** calibrated to the scan depth:

- **Quick**: Concise triage — focuses only on critical/high severity findings
- **Medium**: OWASP Top 10 analysis with balanced risk assessment and remediation
- **Extensive**: Board-level executive summary with exhaustive CVSS-scored findings, compliance mapping, and strategic recommendations

## 🔍 Troubleshooting

### `Read-only file system` Error
Reports are saved to `<project_root>/reports/`. Ensure the project directory is writable.

### Gemini API Errors
- Verify your API key: `echo $GEMINI_API_KEY`
- Check rate limits at [aistudio.google.com](https://aistudio.google.com)
- The server continues scanning even if Gemini is unavailable — raw tool output is still returned

### Tools Not Detected
Install missing tools via Homebrew or your package manager. Python fallbacks cover core functionality even without external tools.

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
  <strong>Built with</strong> 🐍 Python · 🧠 Gemini AI · 🛡️ OWASP Standards
</p>
