# Claude Desktop PenTest MCP - Example Prompts

Here are some example questions and commands you can use in Claude Desktop to interact with the PenTest MCP server. Simply copy and paste these into the chat field!

## 1. Initializing Sessions
* "Start a new penetration testing session against `https://example.com`."
* "Initialize a session for `example.com` and automatically consent to active scanning."

## 2. Using The Built-In Scan Modes (Quick, Medium, Extensive)
* "Run a quick triage scan on `example.com`. Generate a report immediately and tell me the findings."
* "Perform an extensive scan on `example.com` including deep recon and directory fuzzing. Ensure I have given my consent."
* "Start a medium-depth scan for `example.com`. Let me know the risk matrix when finished."

## 3. Running Individual Reconnaissance Tools
* "What subdomains can you find for `example.com`? Run a discovery scan."
* "Run a port scan on `example.com` and fingerprint the web technologies."
* "Are there any Web Application Firewalls (WAF) protecting `example.com`?"

## 4. Specific Vulnerability Scans
* "Run a thorough SQL Injection scan against `https://example.com/login`."
* "Check for Cross-Site Scripting (XSS) on `example.com/search`. I consent to active probing."
* "Fuzz `example.com` for sensitive files and exposed secrets."
* "Test out the CORS misconfiguration vulnerability checker on `example.com/api`."

## 5. AI-Assisted Analysis and Reporting
* "Analyze our current session findings. Are there any critical risks you want to prioritize?"
* "What should our next steps be based on the passive reconnaissance we've done?"
* "Generate a final markdown report for the current session. Show the content of the report output directly to me here."
* "Explain the finding 'Reflected XSS in search parameter' in plain English for a developer."
* "Give me a CVSS 3.1 score for the SQLi vulnerability we just found."
