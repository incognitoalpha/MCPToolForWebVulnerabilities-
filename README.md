# 🛡️ PenTest MCP

**AI-Powered Penetration Testing with Natural Language**

Standalone CLI tool integrating 43+ security tools with dual LLM architecture. Ask security questions in plain English, get professional markdown reports with CVE enrichment.

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Gemini 2.0](https://img.shields.io/badge/LLM-Gemini%202.0%20Flash-orange?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

## 🚀 Quick Start

```bash
# Install dependencies
pip install -e .

# Configure API key
export GEMINI_API_KEY="your_key_here"

# Run a quick scan
pentest run --target http://localhost:3001 --mode quick --consent

# Or use natural language
pentest ask --query "scan for XSS and SQL injection" --target http://localhost:3001 --consent
```

## ✨ Key Features

- **Dual LLM Architecture** - Gemini API (cloud) + fine-tuned Qwen 1.5B (local)
- **Natural Language Interface** - Ask security questions in plain English
- **43+ Security Tools** - nmap, sqlmap, nuclei, ffuf, nikto, testssl, and more
- **CVE Enrichment** - Automatic CVE lookup with CVSS scores and patch information
- **AI-Powered Reports** - Senior consultant-level markdown reports with executive summaries
- **3 Scan Modes** - Quick (5-10 min), Medium (15-30 min), Extensive (45+ min)
- **Session Management** - Track and resume security assessments
- **OWASP Top 10 Coverage** - Systematic scanning mapped to OWASP 2021

## 🧠 Dual LLM Architecture

PenTest MCP supports two LLM backends for report generation:

```
┌─────────────────────────────────────────────────────────────┐
│                    PENTEST MCP AGENT                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TOOL ORCHESTRATION                                  │  │
│  │  nmap · sqlmap · nuclei · ffuf · nikto · testssl    │  │
│  │  43+ security tools                                  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CVE ENRICHMENT ENGINE                               │  │
│  │  NVD API · CVSS Scoring · Patch Information          │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           DUAL LLM REPORT GENERATOR                  │  │
│  │                                                       │  │
│  │  ┌─────────────────────┐   ┌──────────────────────┐ │  │
│  │  │  GEMINI 2.0 FLASH   │   │  QWEN 1.5B (LOCAL)   │ │  │
│  │  │  ✓ Cloud-based      │   │  • Fine-tuned model  │ │  │
│  │  │  ✓ Default/Active   │   │  • Privacy-focused   │ │  │
│  │  │  ✓ Best quality     │   │  • Offline capable   │ │  │
│  │  │  • Requires API key │   │  • Toggle via .env   │ │  │
│  │  └─────────────────────┘   └──────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PROFESSIONAL MARKDOWN REPORT                        │  │
│  │  Executive Summary · CVE Analysis · Remediation      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Default: Gemini 2.0 Flash (Recommended)

Cloud-based LLM providing highest quality reports. Active by default.

**Pros:**
- Superior report quality and analysis depth
- No local setup required
- Always up-to-date model
- Fast inference

**Cons:**
- Requires API key and internet connection
- Data sent to Google servers

### Alternative: Fine-Tuned Qwen 1.5B (Local)

Custom-trained model for security report generation. Trained using `FineTuning.ipynb` on professional pentest reports and OWASP documentation.

**Pros:**
- Complete privacy - all processing local
- No API costs
- Offline capable
- Fast on modern hardware

**Cons:**
- Requires Ollama installation
- Lower quality than Gemini
- Needs model setup

**To enable local model:**

1. Install Ollama: `curl -fsSL https://ollama.ai/install.sh | sh`
2. Set in `.env`:
   ```bash
   LOCAL_MODEL_ENABLED=true
   LOCAL_MODEL_NAME=pentest-ai-1.5b
   ```
3. Load model (if you have the .gguf file):
   ```bash
   ollama create pentest-ai-1.5b -f Modelfile
   ```

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

# Optional: Enable local model (default: false)
LOCAL_MODEL_ENABLED=false
LOCAL_MODEL_NAME=pentest-ai-1.5b
OLLAMA_BASE_URL=http://localhost:11434
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
| `LOCAL_MODEL_ENABLED` | Enable local model for reports | `false` |
| `LOCAL_MODEL_NAME` | Local model name | `pentest-ai-1.5b` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |

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
│   ├── llm_providers.py       # Gemini + Ollama integration
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

### Local Model Issues

- Ensure Ollama is running: `ollama list`
- Verify model loaded: `ollama list | grep pentest-ai`
- Check logs: `~/.pentest-mcp/sessions/<session_id>/session.log`

### Tools Not Detected

Install missing tools via package manager. Python fallbacks cover core functionality.

### Permission Errors

Ensure you have authorization to test the target. The `--consent` flag confirms this.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Built with** 🐍 Python · 🧠 Gemini AI · 🛡️ OWASP Standards
