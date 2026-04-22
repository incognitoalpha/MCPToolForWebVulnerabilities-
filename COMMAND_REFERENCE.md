# PenTest MCP - Command Reference

Complete guide to using the PenTest MCP security testing tool.

## Quick Start

```bash
# Install dependencies
pip install -e .

# Run a quick security scan
pentest run --target http://localhost:3001 --mode quick --consent

# Run with AI-powered tool selection
pentest ask --query "scan for XSS and SQL injection" --target http://localhost:3001 --consent

# View scan history
pentest history
```

## Core Commands

### `pentest run` - Preset Scan Modes

Execute predefined security scans with optimized tool combinations.

**Syntax:**
```bash
pentest run --target <URL> --mode <MODE> --consent [--output <PATH>]
```

**Scan Modes:**

**Quick Scan** (5-7 tools, ~2-3 minutes)
```bash
pentest run --target http://localhost:3001 --mode quick --consent
```
Tools: tech_fingerprint, waf_detect, tls_audit, nuclei_scan, nikto_scan

**Medium Scan** (7-9 tools, ~5-8 minutes)
```bash
pentest run --target http://localhost:3001 --mode medium --consent
```
Tools: Quick scan + xss_scan, sqli_scan

**Extensive Scan** (9-12 tools, ~10-15 minutes)
```bash
pentest run --target http://localhost:3001 --mode extensive --consent
```
Tools: Medium scan + ffuf_scan, subdomain_discovery, additional fuzzing

**Output:**
- All reports generated as **Markdown** with CVE enrichment
- Saved to `~/.pentest-mcp/sessions/<session_id>/report.md`
- Professional format with executive summary, findings, remediation roadmap

### `pentest ask` - AI-Powered Custom Scans

Use natural language to describe your security testing needs. The AI selects appropriate tools.

**Syntax:**
```bash
pentest ask --query "<DESCRIPTION>" --target <URL> --consent [--output <PATH>]
```

**Examples:**

```bash
# XSS and SQL injection testing
pentest ask --query "test for XSS and SQL injection vulnerabilities" --target http://localhost:3001 --consent

# Comprehensive web app assessment
pentest ask --query "full security assessment of web application" --target http://localhost:3001 --consent

# TLS/SSL security audit
pentest ask --query "check SSL/TLS configuration and certificates" --target http://localhost:3001 --consent

# Directory and file discovery
pentest ask --query "discover hidden directories and files" --target http://localhost:3001 --consent

# Technology fingerprinting
pentest ask --query "identify technologies and frameworks used" --target http://localhost:3001 --consent
```

**Performance Tip:** For common patterns like "quick scan" or "medium scan", the AI uses a query cache that's 1.6M times faster than full AI planning.

### `pentest history` - View Scan History

List all previous security scans with session IDs and timestamps.

```bash
pentest history
```

Output shows:
- Session ID
- Target URL/domain
- Scan mode
- Timestamp
- Number of findings

### `pentest report` - Generate Reports

Generate detailed security reports from previous scans.

```bash
# Generate report for specific session
pentest report --session <SESSION_ID> --format html

# Generate report for latest scan
pentest report --format html
```

## Individual Security Tools

Run specific security tools directly. All tools require `--consent` flag.

### Reconnaissance Tools

**DNS Enumeration**
```bash
pentest tool dns_enum --domain localhost --consent
```
Discovers DNS records (A, AAAA, MX, NS, TXT, SOA).

**Subdomain Discovery**
```bash
pentest tool subdomain_discovery --domain localhost --consent
```
Finds subdomains using multiple techniques.

**Port Scanning**
```bash
pentest tool port_scan --target localhost --consent
```
Scans common ports (1-1000) for open services.

**Technology Fingerprinting**
```bash
pentest tool tech_fingerprint --url http://localhost:3001 --consent
```
Identifies web technologies, frameworks, and server software.

**WAF Detection**
```bash
pentest tool waf_detect --url http://localhost:3001 --consent
```
Detects Web Application Firewalls and security products.

### Vulnerability Scanning

**Nuclei Scanner** (Template-based vulnerability scanner)
```bash
pentest tool nuclei_scan --url http://localhost:3001 --consent
```
Runs 1000+ vulnerability templates.

**Nikto Scanner** (Web server scanner)
```bash
pentest tool nikto_scan --url http://localhost:3001 --consent
```
Comprehensive web server vulnerability assessment.

**XSS Scanner**
```bash
pentest tool xss_scan --url http://localhost:3001 --consent
```
Tests for Cross-Site Scripting vulnerabilities.

**SQL Injection Scanner**
```bash
pentest tool sqli_scan --url http://localhost:3001 --consent
```
Tests for SQL injection vulnerabilities.

**CSRF Check**
```bash
pentest tool csrf_check --url http://localhost:3001 --consent
```
Checks for CSRF protection mechanisms.

### Web Fuzzing Tools

**Directory Fuzzing (ffuf)**
```bash
pentest tool ffuf_scan --url http://localhost:3001 --mode dirs --consent
```
Fast directory and file discovery.

**Gobuster**
```bash
pentest tool gobuster_scan --url http://localhost:3001 --consent
```
Directory and DNS brute-forcing.

**Wfuzz**
```bash
pentest tool wfuzz_scan --url http://localhost:3001 --consent
```
Web application fuzzer for parameters and paths.

**Arjun** (Parameter discovery)
```bash
pentest tool arjun_scan --url http://localhost:3001 --consent
```
Discovers hidden HTTP parameters.

### TLS/SSL Security

**TLS Audit**
```bash
pentest tool tls_audit --host localhost:3001 --consent
```
Analyzes TLS/SSL configuration and certificates.

**TestSSL**
```bash
pentest tool testssl_scan --host localhost:3001 --consent
```
Comprehensive SSL/TLS security testing.

### Advanced Tools

**Masscan** (Fast port scanner)
```bash
pentest tool masscan_scan --target localhost --consent
```
Ultra-fast port scanning for large networks.

**Amass** (Advanced subdomain enumeration)
```bash
pentest tool amass_enum --domain localhost --consent
```
OWASP Amass for in-depth subdomain discovery.

**DNSRecon**
```bash
pentest tool dnsrecon_scan --domain localhost --consent
```
Advanced DNS reconnaissance.

**Git Dumper**
```bash
pentest tool git_dumper --url http://localhost:3001/.git --consent
```
Extracts exposed .git repositories.

**JWT Tool**
```bash
pentest tool jwt_tool --url http://localhost:3001 --consent
```
Tests JWT token security.

## Session Management

**Initialize Session**
```bash
pentest tool session_init --target http://localhost:3001 --consent
```
Creates a new scan session for tracking findings.

**Check Session Status**
```bash
pentest tool session_status --session_id <SESSION_ID> --consent
```
View session details and findings count.

## AI Analysis Tools

**Analyze Findings**
```bash
pentest tool analyze_findings --session_id <SESSION_ID> --consent
```
AI-powered analysis of security findings.

**Suggest Next Steps**
```bash
pentest tool suggest_next_steps --session_id <SESSION_ID> --consent
```
Get AI recommendations for additional testing.

**Explain Vulnerability**
```bash
pentest tool explain_vulnerability --vulnerability_type "SQL Injection" --consent
```
Detailed explanation of vulnerability types.

**CVSS Score Calculator**
```bash
pentest tool cvss_score --vulnerability_data '{"type":"xss","severity":"high"}' --consent
```
Calculate CVSS scores for vulnerabilities.

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Required: Gemini API key for AI features
GEMINI_API_KEY=your_key_here

# Optional: Gemini model (default: gemini-2.0-flash-exp)
GEMINI_MODEL=gemini-2.0-flash-exp

# Optional: Agent settings
AGENT_MAX_TOOLS=10
AGENT_TIMEOUT=300
```

### Settings File

Edit `pentest_mcp/config.py` for advanced configuration:

```python
# Maximum tools per AI-planned scan
agent_max_tools: int = 10

# Tool execution timeout (seconds)
agent_timeout: int = 300

# Gemini model selection
gemini_model: str = "gemini-2.0-flash-exp"
```

## Report Format

All reports are generated as **professional markdown** with CVE enrichment.

### Report Structure

1. **Executive Summary** - Business impact and risk assessment for C-level executives
2. **Key Findings Table** - Severity breakdown with visual indicators (🔴🟠🟡🔵⚪)
3. **CVE Analysis** - Automatic CVE enrichment with CVSS scores and patch links
4. **Detailed Vulnerability Analysis** - Each finding with:
   - Description and root cause
   - Technical details and evidence
   - Business impact and attack scenarios
   - Specific remediation steps with effort estimates
   - CVE references with NVD links
5. **Risk Assessment Matrix** - Overall security posture rating
6. **Prioritized Remediation Roadmap** - Phased approach with timelines
7. **Technical Appendix** - Raw tool outputs and evidence

### CVE Enrichment

Findings are automatically enriched with CVE data from the NVD API:

- **CVE ID** with direct links to https://nvd.nist.gov/vuln/detail/[CVE-ID]
- **CVSS Score** highlighted if >= 7.0 (High/Critical)
- **Description** of the vulnerability
- **Patch Availability** with vendor advisory links
- **Published Date** for timeline context

Example CVE section in report:

```markdown
### 🔍 Related CVEs:

- **CVE-2023-12345** (CVSS: 9.8)
  Critical remote code execution vulnerability in Apache 2.4.49
  [Patch Available](https://httpd.apache.org/security/vulnerabilities_24.html)
```

### Report Location

Reports are saved to: `~/.pentest-mcp/sessions/<session_id>/report.md`

## Best Practices

### 1. Always Use --consent Flag

All security testing requires explicit consent. The `--consent` flag confirms you have authorization to test the target.

```bash
# ✅ Correct
pentest run --target http://localhost:3001 --mode quick --consent

# ❌ Will fail without consent
pentest run --target http://localhost:3001 --mode quick
```

### 2. Start with Quick Scans

Begin with quick scans to identify obvious issues before running extensive tests.

```bash
# Step 1: Quick scan
pentest run --target http://localhost:3001 --mode quick --consent

# Step 2: If issues found, run medium scan
pentest run --target http://localhost:3001 --mode medium --consent

# Step 3: For comprehensive assessment, run extensive scan
pentest run --target http://localhost:3001 --mode extensive --consent
```

### 3. Use AI for Custom Testing

When preset modes don't match your needs, use `pentest ask`:

```bash
# Custom testing scenario
pentest ask --query "test authentication bypass and session management" --target http://localhost:3001 --consent
```

### 4. Generate Reports for Documentation

Always generate reports for compliance and documentation:

```bash
# HTML report for stakeholders
pentest run --target http://localhost:3001 --mode medium --consent --format html

# JSON report for automation
pentest run --target http://localhost:3001 --mode medium --consent --format json
```

### 5. Review Session History

Track your testing progress with session history:

```bash
pentest history
```

## Troubleshooting

### "Unknown tool" Error

If you encounter "Unknown tool: <tool_name>", the tool may not be installed:

```bash
# Install missing tools (example for ffuf)
brew install ffuf  # macOS
apt-get install ffuf  # Linux
```

### Timeout Errors

For slow targets, increase timeout in config:

```python
# pentest_mcp/config.py
agent_timeout: int = 600  # 10 minutes
```

### API Rate Limits

If you hit Gemini API rate limits, the tool automatically retries with exponential backoff. For persistent issues:

1. Check your API quota
2. Reduce `agent_max_tools` in config
3. Use preset modes instead of AI planning

### Permission Denied

Ensure you have authorization to test the target. The `--consent` flag is required but doesn't replace legal authorization.

## Performance Comparison

| Command Type | Speed | Use Case |
|-------------|-------|----------|
| `pentest run --mode quick` | ~2-3 min | Fast triage, initial assessment |
| `pentest run --mode medium` | ~5-8 min | Balanced coverage and speed |
| `pentest run --mode extensive` | ~10-15 min | Comprehensive assessment |
| `pentest ask` (cached query) | ~2-3 min | Common patterns (quick/medium/full scan) |
| `pentest ask` (custom query) | ~5-10 min | Custom tool selection with AI planning |
| Individual tools | ~30s-2min | Targeted testing |

**Tip:** The query cache makes `pentest ask` with common patterns (like "quick scan") as fast as `pentest run`.

## Examples by Use Case

### Web Application Security Assessment

```bash
# Full web app security test
pentest run --target http://localhost:3001 --mode extensive --consent --format html
```

### API Security Testing

```bash
# API-focused testing
pentest ask --query "test API endpoints for injection and authentication issues" --target http://localhost:3001/api --consent
```

### SSL/TLS Configuration Audit

```bash
# TLS security check
pentest ask --query "audit SSL/TLS configuration" --target http://localhost:3001 --consent
```

### Directory and File Discovery

```bash
# Find hidden resources
pentest tool ffuf_scan --url http://localhost:3001 --mode dirs --consent
```

### Technology Stack Identification

```bash
# Identify technologies
pentest tool tech_fingerprint --url http://localhost:3001 --consent
```

### Vulnerability Scanning Only

```bash
# Run vulnerability scanners
pentest ask --query "run nuclei and nikto vulnerability scans" --target http://localhost:3001 --consent
```

## Tool Categories Reference

**Reconnaissance (9 tools)**
- dns_enum, subdomain_discovery, port_scan, tech_fingerprint, waf_detect, amass_enum, dnsrecon_scan, masscan_scan, shodan_search

**Vulnerability Scanning (5 tools)**
- nuclei_scan, nikto_scan, xss_scan, sqli_scan, csrf_check

**Web Fuzzing (4 tools)**
- ffuf_scan, gobuster_scan, wfuzz_scan, arjun_scan

**TLS/SSL (2 tools)**
- tls_audit, testssl_scan

**Advanced (6 tools)**
- git_dumper, jwt_tool, cors_test, ssrf_check, lfi_scan, rce_check

**AI Analysis (5 tools)**
- analyze_findings, suggest_next_steps, explain_vulnerability, cvss_score, generate_report

**Session Management (2 tools)**
- session_init, session_status

**Total: 43 security tools**

## Support

For issues or questions:
- GitHub Issues: [Report bugs and feature requests]
- Documentation: This file
- Configuration: `pentest_mcp/config.py`

---

**Version:** 2.0
**Last Updated:** 2026-04-22
**License:** MIT
