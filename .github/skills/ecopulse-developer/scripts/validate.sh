#!/bin/bash

# EcoPulse Skill Validation Script
# Verifies all patterns and conventions are followed

set -e

echo "🔍 EcoPulse Skill Validation"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Next.js 16 async API patterns
echo "📋 Checking Next.js 16 async patterns..."

# Check for non-awaited cookies(), headers(), params, searchParams
if grep -rn "const.*cookies()" --include="*.tsx" --include="*.ts" app/ lib/ | grep -v "await" | grep -v "createServerClient"; then
  echo -e "${RED}❌ Found non-awaited cookies() calls${NC}"
  echo "   Fix: Use 'await cookies()' or 'const cookieStore = await cookies()'"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ cookies() properly awaited${NC}"
fi

if grep -rn "const.*headers()" --include="*.tsx" --include="*.ts" app/ | grep -v "await"; then
  echo -e "${RED}❌ Found non-awaited headers() calls${NC}"
  echo "   Fix: Use 'await headers()' or 'const headersList = await headers()'"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ headers() properly awaited${NC}"
fi

if grep -rn "params\." --include="*.tsx" --include="*.ts" app/ | grep -v "await params"; then
  echo -e "${YELLOW}⚠️  Found potentially non-awaited params usage${NC}"
  echo "   Verify: Ensure params are awaited in async functions"
  ((WARNINGS++))
else
  echo -e "${GREEN}✓ params properly handled${NC}"
fi

echo ""

# 2. Server Actions conventions
echo "📦 Checking Server Actions..."

# Check for 'use server' directive
if ! grep -rn "'use server'" app/actions/ --include="*.ts" > /dev/null; then
  echo -e "${RED}❌ No 'use server' directives found in app/actions/${NC}"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ 'use server' directives present${NC}"
fi

# Check for revalidatePath calls
if grep -rn "insert\|update\|delete" app/actions/ --include="*.ts" | grep -v "revalidatePath" > /dev/null; then
  echo -e "${YELLOW}⚠️  Found mutations without revalidatePath${NC}"
  echo "   Verify: All mutations should call revalidatePath()"
  ((WARNINGS++))
else
  echo -e "${GREEN}✓ revalidatePath used in mutations${NC}"
fi

# Check return type consistency
if grep -rn "export async function" app/actions/ --include="*.ts" | while read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    if ! grep -q "return { success:" "$file"; then
      echo "$file"
    fi
  done | grep -q .; then
  echo -e "${YELLOW}⚠️  Some actions may not return { success, data?, error? }${NC}"
  echo "   Verify: Actions should return consistent shape"
  ((WARNINGS++))
else
  echo -e "${GREEN}✓ Action return types consistent${NC}"
fi

echo ""

# 3. Supabase SSR client usage
echo "🗄️  Checking Supabase patterns..."

# Check for direct imports from @supabase/supabase-js
if grep -rn "from '@supabase/supabase-js'" --include="*.tsx" --include="*.ts" app/ components/ | grep -v "types"; then
  echo -e "${RED}❌ Direct imports from @supabase/supabase-js found${NC}"
  echo "   Fix: Use lib/supabase/{server,client,admin}.ts instead"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ Supabase clients imported correctly${NC}"
fi

# Check for service role key in client code
if grep -rn "SUPABASE_SERVICE_ROLE_KEY" --include="*.tsx" app/ components/ hooks/; then
  echo -e "${RED}❌ Service role key used in client code${NC}"
  echo "   Fix: Service role should only be in lib/supabase/admin.ts"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ Service role key not exposed to client${NC}"
fi

echo ""

# 4. i18n patterns
echo "🌍 Checking i18n patterns..."

# Check for hardcoded strings in JSX
if grep -rn "<button>" app/ components/ --include="*.tsx" | grep -v "children" | head -5; then
  echo -e "${YELLOW}⚠️  Potential hardcoded button text found${NC}"
  echo "   Verify: Use t() for all user-facing strings"
  ((WARNINGS++))
fi

# Check for missing useTranslations in client components
if grep -rn "'use client'" app/ components/ --include="*.tsx" -A 20 | grep -v "useTranslations" | grep "export function" | head -5; then
  echo -e "${YELLOW}⚠️  Client components may be missing useTranslations${NC}"
  echo "   Verify: Use useTranslations() or getTranslations() for i18n"
  ((WARNINGS++))
fi

# Check for direct next/link instead of i18n Link
if grep -rn "from 'next/link'" app/ components/ --include="*.tsx"; then
  echo -e "${RED}❌ Found direct next/link imports${NC}"
  echo "   Fix: Use import { Link } from '@/i18n/routing'"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ Using i18n Link component${NC}"
fi

echo ""

# 5. UI/Accessibility patterns
echo "♿ Checking accessibility..."

# Check for icon-only buttons without aria-label
if grep -rn "<button" app/ components/ --include="*.tsx" -A 3 | grep "Icon" | grep -v "aria-label" | grep -v "aria-labelledby" | head -5; then
  echo -e "${YELLOW}⚠️  Icon-only buttons may be missing aria-label${NC}"
  echo "   Fix: Add aria-label to all icon-only buttons"
  ((WARNINGS++))
fi

# Check for touch target violations (buttons smaller than 44px)
if grep -rn 'className=".*h-\(8\|9\|10\)' app/ components/ --include="*.tsx" | grep "button"; then
  echo -e "${RED}❌ Found buttons with height < 44px (h-11)${NC}"
  echo "   Fix: Use h-11 (44px) minimum for touch targets"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ Touch targets meet 44px minimum${NC}"
fi

echo ""

# 6. Import conventions
echo "📥 Checking imports..."

# Check for @/ alias usage
if grep -rn "from '\.\./\.\./\.\." app/ components/ --include="*.tsx" --include="*.ts" | head -3; then
  echo -e "${YELLOW}⚠️  Found relative imports (../../)${NC}"
  echo "   Prefer: Use @/ alias for cleaner imports"
  ((WARNINGS++))
fi

# Check Hugeicons imports
if grep -rn "from '@hugeicons/react'" app/ components/ --include="*.tsx" | grep -v "Icon" | head -3; then
  echo -e "${YELLOW}⚠️  Verify Hugeicons imports use Icon suffix${NC}"
  ((WARNINGS++))
fi

echo ""

# 7. TypeScript strict mode
echo "🔧 Checking TypeScript..."

# Verify tsconfig.json has strict mode
if ! grep -q '"strict": true' tsconfig.json; then
  echo -e "${RED}❌ TypeScript strict mode not enabled${NC}"
  echo "   Fix: Set 'strict': true in tsconfig.json"
  ((ERRORS++))
else
  echo -e "${GREEN}✓ TypeScript strict mode enabled${NC}"
fi

# Run type check
if pnpm type-check > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Type check passed${NC}"
else
  echo -e "${RED}❌ Type check failed${NC}"
  echo "   Run: pnpm type-check for details"
  ((ERRORS++))
fi

echo ""

# 8. Linting
echo "🔍 Running ESLint..."

if pnpm lint > /dev/null 2>&1; then
  echo -e "${GREEN}✓ ESLint passed${NC}"
else
  echo -e "${RED}❌ ESLint failed${NC}"
  echo "   Run: pnpm lint for details"
  ((ERRORS++))
fi

echo ""

# 9. Tests
echo "🧪 Checking tests..."

# Verify test files exist
if [ ! -d "app/__tests__" ] && [ ! -f "app/actions/*.test.ts" ]; then
  echo -e "${YELLOW}⚠️  No test files found in app/${NC}"
  echo "   Consider: Adding tests for Server Actions"
  ((WARNINGS++))
fi

# Run tests (optional - can be slow)
# if pnpm test > /dev/null 2>&1; then
#   echo -e "${GREEN}✓ Unit tests passed${NC}"
# else
#   echo -e "${RED}❌ Unit tests failed${NC}"
#   ((ERRORS++))
# fi

echo ""

# 10. Environment variables
echo "🔐 Checking environment..."

if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}⚠️  .env.local not found${NC}"
  echo "   Verify: Environment variables configured"
  ((WARNINGS++))
else
  # Check for required vars
  if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL not set${NC}"
    ((ERRORS++))
  fi
  
  if ! grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set${NC}"
    ((ERRORS++))
  fi
  
  if ! grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY not set${NC}"
    echo "   Note: Required for admin operations"
    ((WARNINGS++))
  fi
  
  if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Required environment variables present${NC}"
  fi
fi

echo ""
echo "=============================="
echo "📊 Validation Summary"
echo "=============================="
echo -e "Errors:   ${RED}${ERRORS}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ Validation passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Validation failed with ${ERRORS} error(s)${NC}"
  echo ""
  echo "Fix the errors above and run again."
  exit 1
fi
