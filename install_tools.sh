
#!/bin/bash
# PenTest AI - Tool Installer for macOS
# Run: bash install_tools.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_ok()   { echo -e "${GREEN}[+]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[~]${NC} $1"; }
log_err()  { echo -e "${RED}[-]${NC} $1"; }
log_info() { echo -e "${BLUE}[*]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  PenTest AI - Tool Installer (macOS)     ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ─── Prerequisites ────────────────────────────────────────────────────────────
log_info "Checking prerequisites..."

if ! command -v brew &>/dev/null; then
    log_err "Homebrew not found. Install it first: https://brew.sh"
    exit 1
fi
log_ok "Homebrew found"

if ! command -v go &>/dev/null; then
    log_warn "Go not found. Installing via Homebrew..."
    brew install go
fi
log_ok "Go found: $(go version)"

if ! command -v pip3 &>/dev/null; then
    log_err "pip3 not found. Install Python 3 first."
    exit 1
fi
log_ok "pip3 found"

if ! command -v npm &>/dev/null; then
    log_warn "npm not found. Installing Node via Homebrew..."
    brew install node
fi
log_ok "npm found"

echo ""

# ─── Homebrew Tools ───────────────────────────────────────────────────────────
log_info "Installing Homebrew-based tools..."

BREW_TOOLS=("nuclei" "dalfox" "subfinder" "gobuster" "amass" "masscan" "nikto" "whatweb" "testssl" "hydra" "trufflehog")

for tool in "${BREW_TOOLS[@]}"; do
    if command -v "$tool" &>/dev/null; then
        log_ok "$tool already installed"
    else
        log_warn "Installing $tool..."
        brew install "$tool" && log_ok "$tool installed" || log_err "Failed to install $tool"
    fi
done

echo ""

# ─── Python (pip) Tools ───────────────────────────────────────────────────────
log_info "Installing pip-based tools..."

PIP_TOOLS=("wafw00f" "sslyze" "wfuzz" "arjun" "corscanner" "dnsrecon" "shodan" "git-dumper" "graphql-cop" "enum4linux-ng")

for tool in "${PIP_TOOLS[@]}"; do
    log_warn "Installing $tool..."
    pip3 install "$tool" --quiet && log_ok "$tool installed" || log_err "Failed to install $tool"
done

# commix (pip install doesn't always work, try pipx)
if ! command -v commix &>/dev/null; then
    log_warn "Installing commix..."
    pip3 install commix --quiet && log_ok "commix installed" || log_err "commix install failed (may need manual setup)"
fi

# theHarvester
if ! command -v theHarvester &>/dev/null; then
    log_warn "Installing theHarvester..."
    pip3 install theHarvester --quiet && log_ok "theHarvester installed" || log_err "theHarvester install failed"
fi

echo ""

# ─── npm Tools ────────────────────────────────────────────────────────────────
log_info "Installing npm-based tools..."

if ! command -v retire &>/dev/null; then
    log_warn "Installing retire.js..."
    npm install -g retire && log_ok "retire installed" || log_err "retire install failed"
else
    log_ok "retire already installed"
fi

echo ""

# ─── Go-based tools (manual) ─────────────────────────────────────────────────
log_info "Installing Go-based tools..."

# trufflehog (if brew didn't get it)
if ! command -v trufflehog &>/dev/null; then
    log_warn "Installing trufflehog via Go..."
    go install github.com/trufflesecurity/trufflehog@latest
    log_ok "trufflehog installed"
fi

echo ""

# ─── Manual clone tools ───────────────────────────────────────────────────────
log_info "Installing tools that require git clone..."

TOOLS_DIR="$HOME/.pentest-tools"
mkdir -p "$TOOLS_DIR"

# jwt_tool
if [ ! -d "$TOOLS_DIR/jwt_tool" ]; then
    log_warn "Cloning jwt_tool..."
    git clone https://github.com/ticarpi/jwt_tool.git "$TOOLS_DIR/jwt_tool" --quiet
    pip3 install -r "$TOOLS_DIR/jwt_tool/requirements.txt" --quiet
    # Create a symlink so it's on PATH
    ln -sf "$TOOLS_DIR/jwt_tool/jwt_tool.py" /usr/local/bin/jwt_tool
    chmod +x /usr/local/bin/jwt_tool
    log_ok "jwt_tool installed"
else
    log_ok "jwt_tool already cloned"
fi

echo ""

# ─── OWASP ZAP ────────────────────────────────────────────────────────────────
log_warn "OWASP ZAP (zap-cli) requires manual install:"
echo "  → Download from: https://www.zaproxy.org/download/"
echo "  → Or: brew install --cask owasp-zap"

echo ""

# ─── Metasploit (optional, large) ────────────────────────────────────────────
log_warn "Metasploit (msfconsole) is optional and very large (~2GB)."
read -p "  Install Metasploit? (y/N): " -r install_msf
if [[ "$install_msf" =~ ^[Yy]$ ]]; then
    brew install --cask metasploit
    log_ok "Metasploit installed"
else
    log_warn "Skipping Metasploit"
fi

echo ""

# ─── Final check ──────────────────────────────────────────────────────────────
log_info "Final availability check..."
echo ""

TOOLS_TO_CHECK=("nuclei" "dalfox" "subfinder" "wafw00f" "gobuster" "nikto" "whatweb" "amass" "masscan" "dnsrecon" "theHarvester" "testssl" "retire" "trufflehog" "git-dumper" "jwt_tool" "graphql-cop" "commix" "hydra")

for tool in "${TOOLS_TO_CHECK[@]}"; do
    if command -v "$tool" &>/dev/null; then
        log_ok "$tool"
    else
        log_err "$tool NOT found"
    fi
done

echo ""
echo "─────────────────────────────────────────────"
log_info "Installation complete! Tools are ready to use."
echo "─────────────────────────────────────────────"
