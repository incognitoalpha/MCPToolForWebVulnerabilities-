# 🚀 PenTest AI - CLI Usage Guide

**Complete guide to using the AI-powered CLI with natural language queries**

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Basic Syntax](#basic-syntax)
- [Scan Modes (Quick, Medium, Extensive)](#scan-modes-quick-medium-extensive)
- [Practical Examples](#practical-examples)
- [Understanding the Output](#understanding-the-output)
- [Report Structure](#report-structure)
- [Natural Language Query Examples](#natural-language-query-examples)
- [Tips & Best Practices](#tips--best-practices)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

---

## Quick Start

The CLI uses **natural language** to automatically select and run security tools. Just describe what you want to test!

### Basic Command Structure

```bash
cd "/Users/mohitsahoo/Desktop/EC AND AC"

python3 -m pentest_mcp.cli ask \
  --query "your security question in plain English" \
  --target "website.com" \
  --consent
```

### What Happens Behind the Scenes

1. **Gemini LLM** reads your natural language query
2. **Automatically selects** appropriate security tools from 46 available tools
3. **Runs tools** in the right order
4. **Generates** a professional markdown report

---

## Basic Syntax

### Required Parameters

```bash
--query "your question"    # What you want to test (natural language)
--target "website.com"     # Target URL or domain
--consent                  # Ethical consent flag (REQUIRED)
```

### Optional Parameters

```bash
--output "report.md"       # Custom report path (default: auto-generated)
```

### Full Example

```bash
python3 -m pentest_mcp.cli ask \
  --query "check security headers and TLS configuration" \
  --target https://example.com \
  --consent \
  --output my-security-audit.md
```

---

## Scan Modes (Quick, Medium, Extensive)

For convenience, the CLI provides three preset scan modes that balance speed and depth. You can trigger these using the `run` command or by mentioning the mode in your `ask` query.

### 1. ⚡ Quick Scan
**Best for:** Rapid triage, sanity checks, and identifying low-hanging fruit.
- **Duration:** 1-5 minutes
- **Scope:** WAF detection, DNS enumeration, top 20 ports, security headers, technology fingerprinting.

**Using the `run` command:**
```bash
python3 -m pentest_mcp.cli run --target example.com --mode quick --consent
```

**Using natural language:**
```bash
python3 -m pentest_mcp.cli ask --query "do a quick scan" --target example.com --consent
```

---

### 2. ⚖️ Medium Scan (Balanced)
**Best for:** Standard security audits and OWASP Top 10 coverage.
- **Duration:** 15-30 minutes
- **Scope:** Full recon, top 1000 ports, directory discovery, basic XSS/SQLi scanning, CSRF checks.

**Using the `run` command:**
```bash
python3 -m pentest_mcp.cli run --target example.com --mode medium --consent
```

**Using natural language:**
```bash
python3 -m pentest_mcp.cli ask --query "perform a medium security audit" --target example.com --consent
```

---

### 3. 🔍 Extensive Scan (Deep)
**Best for:** Professional-grade assessments and thorough vulnerability research.
- **Duration:** 1-3 hours
- **Scope:** Deep recon, full port scan, exhaustive TLS audit, extensive directory fuzzing, deep XSS/SQLi/SSRF testing, secret scanning.

**Using the `run` command:**
```bash
python3 -m pentest_mcp.cli run --target example.com --mode extensive --consent
```

**Using natural language:**
```bash
python3 -m pentest_mcp.cli ask --query "run an extensive security audit" --target example.com --consent
```

---

## Practical Examples

### Example 1: Basic Security Check

**Check security headers and TLS configuration:**

```bash
python3 -m pentest_mcp.cli ask \
  --query "check security headers and TLS configuration" \
  --target https://example.com \
  --consent
```

**What it does:**
- Analyzes HTTP security headers
- Checks TLS/SSL configuration
- Identifies web technologies
- Generates report in ~15-20 seconds

---

### Example 2: OWASP Top 10 Audit

**Comprehensive security audit covering OWASP Top 10:**

```bash
python3 -m pentest_mcp.cli ask \
  --query "perform comprehensive OWASP Top 10 security audit" \
  --target https://mywebsite.com \
  --consent
```

**What it does:**
- SQL injection testing
- XSS vulnerability scanning
- CSRF checks
- Authentication testing
- Security misconfiguration checks
- Takes 2-5 minutes depending on tools selected

---

### Example 3: Reconnaissance Only

**Gather information without active exploitation:**

```bash
python3 -m pentest_mcp.cli ask \
  --query "enumerate subdomains and check for exposed sensitive files" \
  --target example.com \
  --consent
```

**What it does:**
- Subdomain discovery
- DNS enumeration
- Exposed file detection (.git, .env, etc.)
- Port scanning
- Technology fingerprinting

---

### Example 4: Specific Vulnerability Testing

**Test for specific vulnerabilities:**

```bash
python3 -m pentest_mcp.cli ask \
  --query "scan for SQL injection and XSS vulnerabilities" \
  --target http://localhost:3000 \
  --consent
```

**What it does:**
- Runs SQLMap for SQL injection
- Runs Dalfox for XSS
- Tests common injection points
- Provides remediation advice

---

### Example 5: Custom Report Path

**Save report to specific location:**

```bash
python3 -m pentest_mcp.cli ask \
  --query "check security headers" \
  --target https://example.com \
  --consent \
  --output my-security-audit-2026.md
```

**What it does:**
- Same as other scans
- Saves report to specified path instead of auto-generated name

---

## Understanding the Output

When you run a scan, you'll see these phases:

### 1. Connection Phase

```
┌─ Security Tools ─────────────────────────────────────┐
│  ✓ Connected to pentest-ai                           │
│  ✓ 46 tools available                                │
│  ✓ Provider: gemini (gemini-flash-lite-latest)       │
└──────────────────────────────────────────────────────┘
```

### 2. Planning Phase

```
🔍 Query: "check security headers"

┌─ Tool Plan ──────────────────────────────────────────┐
│  The LLM selected 2 tools for this scan:             │
│   1. tech_fingerprint    Identify web technologies   │
│   2. tls_audit           Audit TLS/SSL configuration │
└──────────────────────────────────────────────────────┘
```

### 3. Execution Phase

```
⚡ Executing tools...

[1/2] tech_fingerprint     ✓ 0 findings
[2/2] tls_audit            ✓ 0 findings
```

### 4. Report Generation

```
📊 Generating report via LLM...

╭─ ✓ Scan Complete ─────────────────────────────────────╮
│  Target         example.com                           │
│  Duration       17.8s                                 │
│  Total Findings 0                                     │
│  Report         reports/6a6dbca9_example.com_...md   │
╰───────────────────────────────────────────────────────╯
```

### 5. Report Preview

Shows first 50 lines of the generated report in your terminal.

---

## Report Structure

Each generated report includes:

### 1. Executive Summary
- High-level overview for non-technical stakeholders
- Risk assessment
- Key recommendations

### 2. Scope and Methodology
- What was tested
- Tools used
- Testing approach

### 3. Key Findings
- Prioritized by severity (Critical → Info)
- CVSS scores where applicable
- OWASP category mapping

### 4. Detailed Vulnerability Analysis
- Technical details
- Proof of concept
- Evidence/screenshots

### 5. Risk Assessment
- Business impact
- Likelihood vs Impact matrix

### 6. Recommendations
- Remediation steps
- Priority order
- Implementation guidance

### 7. Technical Details
- Raw tool outputs
- Command logs
- Additional evidence

---

## Viewing Reports

Reports are saved in the `reports/` directory:

```bash
# List all reports
ls -lh reports/

# View latest report
cat reports/*.md | tail -1000

# Open in your editor
code reports/6a6dbca9_example.com_20260409_165057.md

# Or use less for terminal viewing
less reports/6a6dbca9_example.com_20260409_165057.md
```

---

## Tips & Best Practices

### ✅ DO:

- **Always use --consent flag** (required for ethical testing)
- **Be specific in your queries** for better tool selection
- **Test on your own systems** or with written permission
- **Review reports for false positives**
- **Use custom output paths** for organized reporting

### ❌ DON'T:

- **Scan systems without authorization**
- **Run extensive scans on production** during business hours
- **Ignore rate limiting or WAF blocks**
- **Share reports containing sensitive data**
- **Use for malicious purposes**

---

## Natural Language Query Examples

You can ask in plain English:

```
"check if the website has any XSS vulnerabilities"
"scan for common web vulnerabilities"
"test authentication and session management"
"look for exposed sensitive files and directories"
"check CORS configuration and security headers"
"enumerate subdomains and check for subdomain takeover"
"test for SQL injection in all forms"
"check if TLS is properly configured"
"scan for outdated JavaScript libraries"
"test for command injection vulnerabilities"
```

The AI understands natural language and selects appropriate tools automatically!

---

## Troubleshooting

### Issue: "GEMINI_API_KEY not set"
**Fix:** Check your `.env` file has `GEMINI_API_KEY` set

### Issue: "Tool registry connection failed"
**Fix:** Make sure you're in the project directory and dependencies are installed

### Issue: "No tools selected"
**Fix:** Make your query more specific about what to test

### Issue: "Permission denied"
**Fix:** Make sure `--consent` flag is included

### Issue: Scan takes too long
**Fix:** Use more specific queries to limit tool selection

---

## Advanced Usage

### Run Multiple Scans in Sequence

```bash
for target in site1.com site2.com site3.com; do
  python3 -m pentest_mcp.cli ask \
    --query "quick security check" \
    --target "$target" \
    --consent \
    --output "reports/${target}_scan.md"
done
```

### Scan with Timestamp

```bash
python3 -m pentest_mcp.cli ask \
  --query "OWASP Top 10 audit" \
  --target mysite.com \
  --consent \
  --output "reports/audit_$(date +%Y%m%d_%H%M%S).md"
```

### Scan Localhost Application

```bash
python3 -m pentest_mcp.cli ask \
  --query "test for common web vulnerabilities" \
  --target http://localhost:8080 \
  --consent
```

---

## Help Commands

```bash
# Show all CLI commands
python3 -m pentest_mcp.cli --help

# Show ask command help
python3 -m pentest_mcp.cli ask --help

# Show session commands
python3 -m pentest_mcp.cli session --help

# Show scan commands
python3 -m pentest_mcp.cli scan --help

# Show recon commands
python3 -m pentest_mcp.cli recon --help
```

---

## Try It Now!

Let's run a quick test scan:

```bash
cd "/Users/mohitsahoo/Desktop/EC AND AC"

python3 -m pentest_mcp.cli ask \
  --query "check security headers" \
  --target https://example.com \
  --consent
```

**This will:**
- ✓ Take ~15-20 seconds
- ✓ Generate a professional report
- ✓ Save to reports/ directory
- ✓ Show you how the system works

**After it completes, view the report:**
```bash
cat reports/*.md | tail -100
```

---

## Summary

The CLI is designed to be **simple and intuitive**:

1. **Write your security question** in plain English
2. **Specify the target** website or domain
3. **Add --consent flag** for ethical testing
4. **Run the command**
5. **Get a professional report**

### The AI (Gemini) Automatically:

- ✓ Understands your question
- ✓ Selects appropriate tools
- ✓ Runs them in the right order
- ✓ Generates a comprehensive report

**No need to know which tools to use - just ask what you want to test!**

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PENTEST AI CLI                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Query (Natural Language)                              │
│         ↓                                                    │
│  Gemini LLM (Tool Planning)                                 │
│         ↓                                                    │
│  Tool Registry (46 Security Tools)                          │
│         ↓                                                    │
│  Tool Execution                                             │
│         ↓                                                    │
│  Gemini LLM (Report Generation)                             │
│         ↓                                                    │
│  Professional Markdown Report                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Additional Resources

- **README.md** - Project overview and architecture
- **reports/** - Generated security reports directory

---

**Built with:** Python 3.12 • Gemini API • 46+ Security Tools

**Status:** ✅ Fully Operational and Ready to Use
