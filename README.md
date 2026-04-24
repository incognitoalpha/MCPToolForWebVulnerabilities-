# 🛡️ PenTest MCP

**AI-Powered Penetration Testing with Natural Language**

A standalone CLI tool that integrates 43+ security tools with Gemini AI analysis. Ask security questions in plain English and get professional markdown reports with CVE enrichment.

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

- **Natural Language Interface** - Ask security questions in plain English
- **43+ Security Tools** - nmap, sqlmap, nuclei, ffuf, nikto, testssl, and more
- **CVE Enrichment** - Automatic CVE lookup with CVSS scores and patch information
- **AI-Powered Reports** - Senior consultant-level markdown reports with executive summaries
- **3 Scan Modes** - Quick (5-10 min), Medium (15-30 min), Extensive (45+ min)
- **Session Management** - Track and resume security assessments
- **OWASP Top 10 Coverage** - Systematic scanning mapped to OWASP 2021

## 📋 Architecture

```
┌─────────────────────────────────────────────────────┐
│  $ pentest ask --query "scan for SQLi" \           │
│    --target http://localhost:3001 --consent        │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│         GEMINI-POWERED AGENT                        │
│                                                     │
│  1. PLAN    → AI selects tools from query          │
│  2. EXECUTE → Runs tools, collects findings        │
│  3. ENRICH  → CVE data from NVD API                │
│  4. REPORT  → AI generates professional markdown   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  nmap    │  │ sqlmap   │  │  ffuf    │         │
│  │  nuclei  │  │ dalfox   │  │  nikto   │         │
│  │  sslyze  │  │ testssl  │  │  ...43+  │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                      │                              │
│                      ▼                              │
│         ┌────────────────────────┐                 │
│         │   GEMINI 2.0 FLASH     │                 │
│         │  Senior Consultant AI  │                 │
│         │  CVE Analysis          │                 │
│         │  CVSS Scoring          │                 │
│         │  Executive Reports     │                 │
│         └────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
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
```

### Install Security Tools (Optional)

The tool works with Python fallbacks, but for professional-grade scanning:

```bash
# macOS
brew install nmap sqlmap ffuf nuclei nikto gobuster testssl

# Linux (Debian/Ubuntu)
apt-get install nmap sqlmap nikto
```

### Local Model Setup (Optional - Enhanced Report Quality)

PenTest AI v3.0 uses a dual-LLM architecture: Gemini handles tool orchestration and analysis, while a fine-tuned local model generates consistently formatted reports. This improves report quality and reduces API costs.

#### 1. Install Ollama

```bash
# macOS
brew install ollama

# Or download from https://ollama.com
```

#### 2. Load Your Fine-Tuned Model

```bash
# Create a Modelfile pointing to your downloaded GGUF
cat > ~/Modelfile << 'EOF'
FROM /path/to/your/pentest-ai-gemma2-q4_k_m.gguf

SYSTEM """You are PenTest AI Report Writer. You receive structured security scan findings and render them into professional, well-formatted Markdown security reports with proper severity ratings, CVSS scores, OWASP categories, and remediation code examples."""

PARAMETER temperature 0.3
PARAMETER num_ctx 8192
PARAMETER num_predict 4096
EOF

ollama create pentest-ai -f ~/Modelfile
```

#### 3. Verify It Works

```bash
ollama run pentest-ai "Generate a one-line test response"
# Should respond immediately
```

#### 4. Configure PenTest AI

Add to your `.env` file:

```bash
# Local fine-tuned model (Ollama)
LOCAL_MODEL_ENABLED=true
LOCAL_MODEL_NAME=pentest-ai
OLLAMA_BASE_URL=http://localhost:11434
```

#### 5. Run Ollama in the Background

```bash
# Start Ollama server (runs on port 11434)
ollama serve &

# Or set it to start automatically on macOS
# It starts automatically after 'ollama create'
```

**Fallback Behavior**: If Ollama is not running or the model is not loaded, PenTest AI automatically falls back to Gemini for report generation. Scans will never fail due to the local model being unavailable.

**To disable local model**: Set `LOCAL_MODEL_ENABLED=false` in your `.env` file to always use Gemini for reports (useful in CI/CD environments).

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
| `NVD_API_KEY` | NVD API key for CVE enrichment (optional) | - |
| `AGENT_MAX_TOOLS` | Max tools per scan | `10` |
| `LOCAL_MODEL_ENABLED` | Use local model for reports | `true` |
| `LOCAL_MODEL_NAME` | Ollama model name | `pentest-ai` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |

### AI Prompting

The tool uses **enhanced Gemini prompts** designed for professional penetration testing:

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
│   ├── tools/
│   │   ├── professional.py    # External tool wrappers
│   │   ├── tool_registry.py   # Tool execution
│   │   └── analysis.py        # AI analysis tools
│   └── models.py              # Data models
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

### Tools Not Detected

Install missing tools via package manager. Python fallbacks cover core functionality.

### Permission Errors

Ensure you have authorization to test the target. The `--consent` flag confirms this.

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Built with** 🐍 Python · 🧠 Gemini AI · 🛡️ OWASP Standards
