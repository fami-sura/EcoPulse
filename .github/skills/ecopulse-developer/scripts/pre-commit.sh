#!/bin/bash

# Pre-commit hook for EcoPulse
# Runs validation checks before allowing commit

set -e

echo "🔍 Running pre-commit checks..."
echo ""

# 1. Lint staged files
echo "📋 Linting..."
pnpm lint-staged

# 2. Type check
echo "🔧 Type checking..."
pnpm type-check

# 3. Run unit tests
echo "🧪 Running tests..."
pnpm test --run

# 4. Format check
echo "✨ Checking formatting..."
pnpm format:check

echo ""
echo "✅ All checks passed!"
