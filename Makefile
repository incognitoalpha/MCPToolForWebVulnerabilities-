.PHONY: help install test clean dev-install verify lint format

help:
	@echo "Pentest AI CLI - Available Commands"
	@echo "========================================"
	@echo "make install      - Install package"
	@echo "make dev-install  - Install with dev dependencies"
	@echo "make verify       - Run setup verification"
	@echo "make test         - Run test suite"
	@echo "make lint         - Run linting"
	@echo "make format       - Format code"
	@echo "make clean        - Clean build artifacts"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. make dev-install"
	@echo "  2. cp .env.example .env"
	@echo "  3. Edit .env and add GEMINI_API_KEY"
	@echo "  4. make verify"

install:
	pip install -e .

dev-install:
	pip install -e ".[dev]"

verify:
	python test_setup.py

test:
	pytest -v

test-cov:
	pytest --cov=pentest_mcp --cov-report=html --cov-report=term

lint:
	ruff check pentest_mcp/

format:
	ruff format pentest_mcp/

clean:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info
	rm -rf .pytest_cache/
	rm -rf .coverage
	rm -rf htmlcov/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Development helpers
run-cli:
	pentest --help

demo:
	@echo "Creating demo session..."
	@SESSION=$$(pentest session init --target https://example.com --consent | grep -oE '[a-f0-9]{8}' | head -1); \
	echo "Session ID: $$SESSION"; \
	echo "Run: pentest session status --session $$SESSION"

# Documentation
docs:
	@echo "Documentation files:"
	@echo "  README.md              - Main documentation"
	@echo "  SETUP.md               - Installation guide"
	@echo "  EXAMPLE_WORKFLOW.md    - Complete workflow"
	@echo "  QUICK_REFERENCE.md     - Command reference"
	@echo "  TROUBLESHOOTING.md     - Common issues"
	@echo "  PROJECT_SUMMARY.md     - Implementation overview"
