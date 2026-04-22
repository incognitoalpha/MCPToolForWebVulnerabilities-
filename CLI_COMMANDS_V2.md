# PenTest AI v2.0 - CLI Commands Reference

Complete reference for all CLI commands in PenTest AI v2.0.

---

## Version Information

```bash
pentest --version
# Output: pentest-ai version 2.0.0
```

---

## Core Commands

### `pentest run` - Run Security Scan

Run a complete scan with preset mode and generate reports.

**Syntax:**
```bash
pentest run --target <URL> --mode <MODE> --consent [OPTIONS]
```

**Required Flags:**
- `--target, -t` - Target URL or domain
- `--mode, -m` - Scan mode: `quick`, `medium`, or `extensive`
- `--consent` - Confirm authorization to test (required unless using `--dry-run`)

**Optional Flags:**
- `--dry-run` - Show what would run without executing
- `--output, -o` - Custom report output path
- `--format, -f` - Report format: `html`, `json`, `sarif`, or `all` (default: `html`)
- `--targets-file` - File with multiple targets (one per line)
- `--concurrency, -c` - Max concurrent scans for multi-target (default: 3)

**Scan Modes:**
- `quick` - Fast triage in ~10 minutes (critical/high findings only)
- `medium` - Balanced OWASP Top 10 coverage in ~30 minutes
- `extensive` - Full professional engagement in 1-3 hours

**Examples:**

Single target scan:
```bash
pentest run --target https://example.com --mode quick --consent
```

Generate all report formats:
```bash
pentest run --target https://example.com --mode medium --consent --format all
```

Multi-target parallel scanning:
```bash
pentest run --targets-file targets.txt --mode medium --consent --concurrency 5
```

Dry run to preview tools:
```bash
pentest run --target https://example.com --mode extensive --dry-run
```

**Features:**
- ✅ CVE enrichment via NVD API
- ✅ Webhook notifications (Slack/generic)
- ✅ Scan history tracking for diff
- ✅ Multi-format reports (HTML, JSON, SARIF)
- ✅ Multi-target parallel scanning

---

### `pentest ask` - Natural Language Security Query

Ask security questions in natural language. The LLM plans and executes tools automatically.

**Syntax:**
```bash
pentest ask --query "<QUESTION>" --target <URL> --consent [OPTIONS]
```

**Required Flags:**
- `--query, -q` - Natural language security query
- `--target, -t` - Target URL or domain
- `--consent` - Confirm authorization to test

**Optional Flags:**
- `--output, -o` - Custom report output path
- `--format, -f` - Report format: `html`, `json`, `sarif`, or `all` (default: `html`)

**Examples:**

Scan for specific vulnerabilities:
```bash
pentest ask --query "scan for SQL injection and XSS" --target http://localhost:3000 --consent
```

Full OWASP audit:
```bash
pentest ask --query "do a full OWASP Top 10 audit" --target https://example.com --consent
```

Custom reconnaissance:
```bash
pentest ask --query "enumerate subdomains and check for exposed files" --target example.com --consent
```

**Features:**
- ✅ AI-driven tool selection
- ✅ Automatic execution planning
- ✅ CVE enrichment
- ✅ Webhook notifications
- ✅ Multi-format reports

---

## New v2.0 Commands

### `pentest chat` - Interactive AI Chat

Interactive AI chat about scan findings. Discuss vulnerabilities, get remediation advice, and ask questions.

**Syntax:**
```bash
pentest chat --session <SESSION_ID>
```

**Required Flags:**
- `--session, -s` - Session ID to discuss

**Example:**
```bash
pentest chat --session abc123
```

**Features:**
- ✅ AI-powered findings discussion
- ✅ Remediation recommendations
- ✅ Context-aware responses
- ✅ Interactive Q&A

---

### `pentest diff` - Compare Scans Over Time

Compare scan results over time to track changes, new findings, and fixed issues.

**Syntax:**
```bash
pentest diff --target <URL> [OPTIONS]
```

**Required Flags:**
- `--target, -t` - Target URL or domain

**Optional Flags:**
- `--limit, -n` - Number of historical scans to compare (default: 10)

**Example:**
```bash
pentest diff --target https://example.com --limit 5
```

**Output Shows:**
- ✅ New findings since last scan
- ✅ Fixed findings
- ✅ Regressed findings (severity increased)
- ✅ Unchanged findings
- ✅ Scan timestamps

---

### `pentest watch` - Continuous Monitoring

Continuous watch mode - re-scan at intervals and track changes over time.

**Syntax:**
```bash
pentest watch --target <URL> --mode <MODE> --consent [OPTIONS]
```

**Required Flags:**
- `--target, -t` - Target URL or domain
- `--mode, -m` - Scan mode: `quick`, `medium`, or `extensive`
- `--consent` - Confirm authorization to test

**Optional Flags:**
- `--interval, -i` - Scan interval: `30m`, `1h`, `6h`, `12h`, `24h`, `1d` (default: `30m`)
- `--fail-on-new-critical` - Exit with code 1 on new critical findings (useful for CI/CD)
- `--output, -o` - Custom report output directory

**Examples:**

Hourly monitoring:
```bash
pentest watch --target https://example.com --mode quick --interval 1h --consent
```

CI/CD integration with critical finding alerts:
```bash
pentest watch --target https://example.com --mode medium --interval 6h --consent --fail-on-new-critical
```

**Features:**
- ✅ Automatic re-scanning at intervals
- ✅ Diff tracking between scans
- ✅ Webhook notifications on new findings
- ✅ CI/CD integration support
- ✅ Minimum interval: 5 minutes

---

### `pentest doctor` - System Health Check

Check system health, tool availability, and configuration.

**Syntax:**
```bash
pentest doctor
```

**Example:**
```bash
pentest doctor
```

**Checks:**
- ✅ Python version
- ✅ API keys (GEMINI_API_KEY, NVD_API_KEY)
- ✅ Webhook configuration (Slack, generic)
- ✅ Tool binary availability (25+ tools)
- ✅ Session and history directories

---

## Environment Variables

Configure PenTest AI with these environment variables in `.env`:

### Required
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Optional - CVE Enrichment
```bash
NVD_API_KEY=your_nvd_api_key_here  # Increases rate limit from 5 to 50 req/30s
```

### Optional - Notifications
```bash
# Slack webhook
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Generic webhook
NOTIFY_WEBHOOK_URL=https://your-webhook-endpoint.com/notify

# Notification settings
NOTIFY_ON=critical,high  # Comma-separated severity levels
NOTIFY_SCAN_COMPLETE=true  # Send notification on scan completion
```

---

## Report Formats

### HTML Report
- Self-contained with inline CSS
- Interactive findings cards
- Severity distribution charts
- Print-friendly

### JSON Report
- Machine-readable format
- Complete metadata
- Structured findings array
- Easy to parse and integrate

### SARIF Report
- GitHub/GitLab code scanning compatible
- Standard format for security tools
- Integrates with CI/CD pipelines
- SARIF 2.1.0 schema

---

## Multi-Target Scanning

Create a targets file with one target per line:

**targets.txt:**
```
https://example.com
https://test.example.com
http://localhost:3000
https://staging.example.com
```

Comments and empty lines are ignored:
```
# Production targets
https://example.com

# Staging targets
https://staging.example.com

# Local development
http://localhost:3000
```

**Run multi-target scan:**
```bash
pentest run --targets-file targets.txt --mode medium --consent --concurrency 5
```

**Features:**
- ✅ Parallel execution with concurrency control
- ✅ Individual reports per target
- ✅ Aggregate summary report
- ✅ Failure isolation (one target failure doesn't stop others)

---

## Exit Codes

- `0` - Success
- `1` - Error or failure
- `1` - New critical findings detected (when using `--fail-on-new-critical` in watch mode)

---

## Tips & Best Practices

1. **Start with quick mode** for fast triage, then escalate to medium/extensive
2. **Use --dry-run** to preview tools before running
3. **Enable CVE enrichment** by setting NVD_API_KEY for better context
4. **Set up webhooks** for real-time notifications on critical findings
5. **Use watch mode** for continuous monitoring of production systems
6. **Generate all formats** with `--format all` for maximum compatibility
7. **Multi-target scanning** is ideal for scanning multiple environments in parallel
8. **Use diff command** regularly to track security posture over time

---

## Version History

### v2.0.0 (Current)
- ✅ CVE enrichment via NVD API
- ✅ Scan diff engine for tracking changes
- ✅ Multi-target parallel scanning
- ✅ Watch mode for continuous monitoring
- ✅ Interactive AI chat
- ✅ Multiple report formats (HTML, JSON, SARIF)
- ✅ Webhook notifications (Slack, generic)
- ✅ System health check (doctor command)

### v1.0.0
- Initial release with core scanning functionality
- Mode-based tool registry
- Session management
- Basic reporting
