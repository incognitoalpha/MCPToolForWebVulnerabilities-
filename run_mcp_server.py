#!/usr/bin/env python3
"""Entry point for MCP server that handles imports correctly."""

import sys
from pathlib import Path

# Add the parent directory to Python path so imports work
sys.path.insert(0, str(Path(__file__).parent))

import logging
import structlog

# MCP Servers use stdout to send JSON-RPC messages to Claude Desktop.
# Any random text printed to stdout will corrupt the stream and crash Claude's parser!
# We must redirect EVERYTHING logging-related to stderr!
logging.basicConfig(level=logging.INFO, stream=sys.stderr)
structlog.configure(
    logger_factory=structlog.PrintLoggerFactory(file=sys.stderr),
)

# Now import and run the server
from pentest_mcp.server import main

if __name__ == "__main__":
    main()
