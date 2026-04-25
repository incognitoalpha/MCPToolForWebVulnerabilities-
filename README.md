# 🛡️ PenTest MCP

**AI-Powered Security Scanning via Model Context Protocol**

MCP server exposing 25+ security tools to Claude Desktop. Claude orchestrates penetration testing through natural language - no CLI needed.

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0+-purple)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

## 🚀 Quick Start

```bash
# Install dependencies
pip install -e .

# Add to Claude Desktop config (see CLAUDE_DESKTOP_CONFIG.md)
# Then restart Claude Desktop

# Example prompts in Claude Desktop:
# "Initialize a security assessment for http://localhost:3001"
# "Run a quick scan on http://localhost:3001 with consent"
# "Check if the site has a WAF"
# "Scan for XSS vulnerabilities"
# "Generate the final security report"
```

## ✨ Key Features

- **Claude Desktop Integration** - Claude orchestrates security tools via MCP protocol
- **30 Security Tools** - nmap, sqlmap, nuclei, ffuf, nikto, testssl, and more
- **Natural Language** - Ask security questions, Claude picks the right tools
- **3 Preset Scan Modes** - Quick (5-10 min), Medium (15-30 min), Extensive (45+ min)
- **CVE Enrichment** - Automatic CVE lookup with CVSS scores
- **AI-Generated Reports** - Professional markdown reports with remediation guidance
- **Session Management** - Track findings across multiple tool executions
- **Real-Time Results** - See tool output as scans progress

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CLAUDE DESKTOP                            │
│                   (MCP Client)                              │
│                                                             │
│  User: "Scan http://localhost:3001 for XSS"                │
│  Claude: Calls nuclei, dalfox, nikto tools                 │
└────────────────────┬────────────────────────────────────────┘
                     │ MCP Protocol (stdio)
                     │ JSON-RPC tool calls
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   MCP SERVER                                │
│                   (pentest_mcp/mcp_server.py)               │
│                                                             │
│  Tool Registry:                                             │
│  • 25 individual tools (nmap, sqlmap, nuclei, etc.)        │
│  • 3 preset modes (quick_scan, medium_scan, extensive)     │
│  • 2 session tools (init_session, get_report)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              EXISTING TOOL LAYER (unchanged)                │
│                                                             │
│  tools/professional.py  - 25 tool wrappers                 │
│  scan_modes.py          - preset scan logic                │
│  enrichment.py          - CVE lookup                       │
│  report_engine.py       - markdown generation              │
│  session.py             - session management               │
└─────────────────────────────────────────────────────────────┘
```

### Report Generation: Gemini

Cloud-based LLM providing highest quality reports. Active by default.

**Pros:**
- Superior report quality and analysis depth
- No local setup required
- Always up-to-date model
- Fast inference

**Cons:**
- Requires API key and internet connection
- Data sent to Google servers

Report generation uses Gemini exclusively. `FineTuning.ipynb` remains as a historical training artifact, but it is not part of the active report-generation architecture.

## 📖 Commands

### `pentest run` - Preset Scan Modes

Execute predefined security scans with optimized tool combinations.

```bash
# Quick scan (5-10 minutes)
pentest run --target http://localhost:3001 --mode quick --consent

# Medium scan (15-30 minutes)
pentest run --target http://localhost:3001 --mode medium --consent

# Extensive scan (45+ minutes)
pentest run --target http://localhost:3001 --mode extensive --consent
```

**Scan Modes:**
- **Quick**: Fast triage - tech fingerprinting, WAF detection, TLS audit, nuclei, nikto
- **Medium**: OWASP Top 10 - Quick + XSS, SQLi, directory fuzzing
- **Extensive**: Comprehensive - Medium + subdomain discovery, advanced fuzzing, all tools

### `pentest ask` - AI-Powered Custom Scans

Use natural language to describe your security testing needs.

```bash
# XSS and SQL injection testing
pentest ask --query "test for XSS and SQL injection" --target http://localhost:3001 --consent

# Full security assessment
pentest ask --query "comprehensive security audit" --target http://localhost:3001 --consent

# TLS/SSL audit
pentest ask --query "check SSL/TLS configuration" --target http://localhost:3001 --consent
```

### `pentest session list` - View Scan History

```bash
pentest session list
```

### Individual Tools

Run specific security tools directly:

```bash
# Technology fingerprinting
pentest tool tech_fingerprint --url http://localhost:3001 --consent

# XSS scanner
pentest tool xss_scan --url http://localhost:3001 --consent

# SQL injection scanner
pentest tool sqli_scan --url http://localhost:3001 --consent
```

See [COMMAND_REFERENCE.md](COMMAND_REFERENCE.md) for complete command documentation.

## 🔧 Installation

### Prerequisites

- Python 3.11+
- Gemini API Key ([Get one free](https://aistudio.google.com/apikey))

### Install

```bash
git clone <repository-url>
cd pentest-mcp
pip install -e .
```

### Configure

Create `.env` file:

```bash
# Required: Gemini API key
GEMINI_API_KEY=your_api_key_here

# Optional: Model selection (default: gemini-2.0-flash-exp)
GEMINI_MODEL=gemini-2.0-flash-exp

```

### Install Security Tools (Optional)

The tool works with Python fallbacks, but for professional-grade scanning:

```bash
# macOS
brew install nmap sqlmap ffuf nuclei nikto gobuster testssl

# Linux (Debian/Ubuntu)
apt-get install nmap sqlmap nikto
```

## 📊 Report Format

All reports are generated as **professional markdown** with:

- **Executive Summary** - Business impact and risk assessment for C-level
- **Key Findings Table** - Severity breakdown with visual indicators (🔴🟠🟡🔵⚪)
- **CVE Analysis** - Automatic CVE enrichment with CVSS scores and patch links
- **Detailed Findings** - Each vulnerability with description, impact, and remediation
- **Risk Assessment Matrix** - Overall security posture rating
- **Remediation Roadmap** - Prioritized phases with effort estimates
- **Technical Appendix** - Raw tool outputs and evidence

Reports are saved to `~/.pentest-mcp/sessions/<session_id>/report.md`

## 🔍 CVE Enrichment

Findings are automatically enriched with CVE data from the NVD API:

- CVE ID with direct links to NVD database
- CVSS v3.1 scores and severity ratings
- Vulnerability descriptions
- Patch availability and vendor advisories
- Published dates

CVE data is prominently highlighted in reports with dedicated sections.

## 🛠️ Supported Tools (43+)

**Reconnaissance**: dns_enum, subdomain_discovery, port_scan, tech_fingerprint, waf_detect, amass_enum, dnsrecon_scan, masscan_scan

**Vulnerability Scanning**: nuclei_scan, nikto_scan, xss_scan, sqli_scan, csrf_check

**Web Fuzzing**: ffuf_scan, gobuster_scan, wfuzz_scan, arjun_scan

**TLS/SSL**: tls_audit, testssl_scan

**Advanced**: git_dumper, jwt_tool, cors_test, ssrf_check, lfi_scan, rce_check

**AI Analysis**: analyze_findings, suggest_next_steps, explain_vulnerability, cvss_score, generate_report

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Gemini API key (required) | - |
| `GEMINI_MODEL` | Model to use | `gemini-2.0-flash-exp` |
| `AGENT_MAX_TOOLS` | Max tools per scan | `10` |
| `AGENT_TIMEOUT` | Tool execution timeout (seconds) | `300` |

### AI Prompting

The tool uses **enhanced prompts** designed for professional penetration testing:

- Senior consultant persona with 15+ years experience
- Detailed report structure requirements
- CVE/CVSS handling with prominent highlighting
- Risk assessment and attack scenario analysis
- Prioritized remediation with effort estimates
- Temperature 0.2 for consistency
- 16K token output for comprehensive reports

## 🔒 Security Notice

**This tool is for authorized security testing only.**

- Always obtain explicit written permission before scanning
- Unauthorized testing violates CFAA, IT Act 2000/2008, and similar laws
- The `--consent` flag is an ethical safeguard - never bypass it
- Never commit API keys to version control

## 📁 Project Structure

```
pentest-mcp/
├── pentest_mcp/
│   ├── cli.py                 # CLI interface
│   ├── agent.py               # AI orchestrator
│   ├── scan_modes.py          # Preset scan modes
│   ├── session.py             # Session management
│   ├── enrichment.py          # CVE enrichment
│   ├── llm_providers.py       # Gemini integration
│   ├── report_engine.py       # Report generation
│   ├── tools/
│   │   ├── professional.py    # External tool wrappers
│   │   ├── tool_registry.py   # Tool execution
│   │   └── analysis.py        # AI analysis tools
│   └── models.py              # Data models
├── FineTuning.ipynb           # Model training notebook
├── reports/                   # Generated reports (gitignored)
├── .agents/                   # Agent skills (gitignored)
├── COMMAND_REFERENCE.md       # Complete command guide
└── README.md                  # This file
```

## 🐛 Troubleshooting

### Gemini API Errors

- Verify API key: `echo $GEMINI_API_KEY`
- Check rate limits at [Google AI Studio](https://aistudio.google.com)
- Tool continues scanning even if Gemini fails

### Report Generation Issues

- Verify API key: `echo $GEMINI_API_KEY`
- Check rate limits at [Google AI Studio](https://aistudio.google.com)
- Check logs: `~/.pentest-mcp/sessions/<session_id>/session.log`

### Tools Not Detected

Install missing tools via package manager. Python fallbacks cover core functionality.

### Permission Errors

Ensure you have authorization to test the target. The `--consent` flag confirms this.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Built with** 🐍 Python · 🧠 Gemini AI · 🛡️ OWASP Standards
