# Medium Mode Scan Summary

## Scan Details
- **Session ID**: 6268f800
- **Target**: https://0a45004b0484428981cb432b003b00b8.web-security-academy.net
- **Mode**: Medium
- **Duration**: ~20 seconds
- **Date**: March 24, 2026

## Scan Steps Completed
1. ✅ WAF Detection
2. ✅ Full Recon (DNS, WHOIS, subdomain enumeration)
3. ✅ Port Scan (Top 1000 ports)
4. ✅ Tech Fingerprinting
5. ✅ HTTP Headers + TLS Analysis
6. ✅ Directory Discovery
7. ✅ XSS Scan
8. ✅ SQL Injection Scan
9. ✅ CSRF Check
10. ✅ Sensitive Files Discovery

## Findings Summary
**Total Findings**: 6 (all Medium severity)

### Missing Security Headers
All findings relate to missing HTTP security headers:

1. **Missing Content-Security-Policy (CSP)** - Allows XSS attacks
2. **Missing Strict-Transport-Security (HSTS)** - Allows MITM attacks
3. **Missing X-Frame-Options** - Allows clickjacking attacks
4. **Missing X-Content-Type-Options** - Allows MIME-sniffing attacks
5. **Missing Referrer-Policy** - Leaks sensitive information
6. **Missing Permissions-Policy** - Allows unauthorized API access

## Risk Level
**Overall Risk**: MEDIUM

The target is a Web Security Academy lab environment, which explains why security headers are intentionally missing for educational purposes.

## Files Generated
- Full Report: `./reports/medium_scan_6268f800.md`
- Session Database: `~/.pentest-mcp/sessions/6268f800/session.db`
- Session Backup: `./reports/session_6268f800_backup/`

## Configuration Fix Applied
Updated `.env` file to use current Groq model:
- Old: `llama-3.1-70b-versatile` (decommissioned)
- New: `llama-3.3-70b-versatile` (active)

## Next Steps
To run another scan:
```bash
# Quick scan (~10 min)
pentest run --target <URL> --mode quick --consent

# Medium scan (~30 min)
pentest run --target <URL> --mode medium --consent

# Extensive scan (1-3 hrs)
pentest run --target <URL> --mode extensive --consent
```
