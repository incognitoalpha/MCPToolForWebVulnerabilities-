# Changelog

All notable changes to PenTest AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-04-22

### Added

#### F1 - Rich Terminal Dashboard
- Beautiful live terminal UI using Rich library
- Real-time progress bars and status updates
- Color-coded severity indicators
- Live findings panel during scans
- Professional ASCII banner and layouts

#### F2 - CVE Auto-Enrichment
- Automatic CVE lookup via NVD API
- Extract product versions from scan results
- Attach CVSS scores and CVE IDs to findings
- Optional NVD API key support for higher rate limits
- Smart rate limiting (5 req/30s without key, 50 req/30s with key)

#### F3 - Scan Diff (Track Changes Over Time)
- Automatic scan history storage
- Compare current scan with previous scans
- Identify new, fixed, and regressed findings
- Visual diff output with color coding
- History stored in `~/.pentest-ai/history/`

#### F4 - Multi-Target Parallel Scanning
- Scan multiple targets from command line or file
- Configurable concurrency control
- Aggregate reporting across all targets
- Progress tracking per target
- Targets file format with comments support

#### F5 - Watch Mode (Continuous Re-scan)
- Scheduled re-scanning at configurable intervals
- Automatic diff against previous scan
- Alert on new critical findings
- `--fail-on-new-critical` flag for CI/CD integration
- Graceful keyboard interrupt handling

#### F7 - AI Chat Mode
- Interactive chat about scan findings
- Ask questions in natural language
- Get remediation advice and explanations
- Draft tickets and reports
- Full conversation context with all findings

#### F8a - Multiple Report Formats
- **HTML**: Self-contained single-file reports with inline CSS
  - Executive summary with severity charts
  - Collapsible finding cards
  - Print-friendly styling
- **JSON**: Machine-readable format for SIEM/ticketing integrations
- **SARIF**: GitHub/GitLab code scanning compatible format
- `--format all` to generate all formats simultaneously

#### F8b - Notification Webhooks
- Slack webhook integration
- Generic webhook for custom integrations
- Configurable severity filters
- Scan completion notifications
- Beautiful formatted messages with severity emojis

#### PyPI Packaging
- Package name: `pentest-ai`
- Version management in `__init__.py`
- Dual entry points: `pentest` and `pentest-ai`
- Proper project metadata and classifiers
- Ready for `pip install pentest-ai`

### Changed
- Updated version to 2.0.0
- Enhanced pyproject.toml with better metadata
- Improved .env.example with v2 configuration options
- All scan modes now support multiple output formats

### Fixed
- Lazy API key validation (from v1.0 stability fixes)
- Config no longer crashes on missing env vars at import
- Tool registry with mode-based filtering
- Session directory auto-creation
- Atomic file writes for session data

## [1.0.0] - 2026-04-21

### Added
- Initial stable release
- Core scanning functionality (quick/medium/extensive modes)
- 25+ security tools integration
- Gemini AI-powered analysis
- Session management
- Basic CLI interface
- Tool registry system
- Python fallback implementations

### Fixed
- Entry-point configuration
- Configuration stability
- Data models extension
- Error handling in tool wrappers
- Async/sync consistency

---

## Upgrade Guide

### From 1.x to 2.0

1. **Update dependencies**: Run `uv sync` or `pip install -r requirements.txt`
2. **Update .env**: Add new optional variables (see `.env.example`)
3. **New commands available**:
   - `pentest chat` - Interactive AI chat
   - `pentest diff` - Compare scans
   - `pentest watch` - Continuous scanning
   - `pentest --version` - Show version

4. **New flags**:
   - `--format html|json|sarif|all` - Choose report format
   - `--targets-file FILE` - Scan multiple targets
   - `--concurrency N` - Control parallel scans
   - `--interval 30m|1h|6h` - Watch mode interval

5. **Breaking changes**: None - fully backward compatible

---

[2.0.0]: https://github.com/MohitSahoo/MCPToolForWebVulnerabilities-/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/MohitSahoo/MCPToolForWebVulnerabilities-/releases/tag/v1.0.0
