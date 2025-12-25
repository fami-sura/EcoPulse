#!/bin/bash

# Quick check script for EcoPulse development
# Runs fast validation checks

set -e

echo "⚡ Quick Check"
echo "=============="
echo ""

# Type check
echo "🔧 Type check..."
pnpm type-check

# Lint
echo "📋 Lint..."
pnpm lint

# Format check
echo "✨ Format..."
pnpm format:check

echo ""
echo "✅ Quick check passed!"
