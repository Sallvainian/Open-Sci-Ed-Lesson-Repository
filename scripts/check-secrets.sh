#!/bin/bash
# SEC-001 Mitigation: Git History Secret Scanning
# Scans git history for potential secrets and credentials

set -e

echo "🔍 SEC-001 Mitigation: Scanning git history for exposed secrets..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    exit 1
fi

# Patterns to search for (common secret indicators)
PATTERNS=(
    "password\s*=\s*['\"]"
    "api[_-]?key\s*=\s*['\"]"
    "secret\s*=\s*['\"]"
    "DATABASE_URL\s*=\s*['\"]postgres"
    "SUPABASE_SERVICE_KEY\s*=\s*"
    "-----BEGIN RSA PRIVATE KEY-----"
    "-----BEGIN PRIVATE KEY-----"
    "sk_live_"
    "pk_live_"
)

FOUND_ISSUES=0

echo "Scanning for common secret patterns in git history..."
echo ""

for pattern in "${PATTERNS[@]}"; do
    echo "Checking pattern: $pattern"

    # Search git history for pattern
    MATCHES=$(git log -p --all -S "$pattern" --pretty=format:"%H %s" | head -n 20 || true)

    if [ -n "$MATCHES" ]; then
        echo -e "${RED}⚠️  POTENTIAL SECRET FOUND${NC}"
        echo "$MATCHES"
        echo ""
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
    fi
done

# Check current .env.local status
echo ""
echo "Verifying .env.local in .gitignore..."

if grep -q "^.env.local" .gitignore && grep -q "^.env\*.local" .gitignore; then
    echo -e "${GREEN}✅ .env.local properly excluded in .gitignore${NC}"
else
    echo -e "${RED}❌ .env.local NOT found in .gitignore${NC}"
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
fi

# Check if .env.local exists and is tracked
if [ -f .env.local ]; then
    if git ls-files --error-unmatch .env.local >/dev/null 2>&1; then
        echo -e "${RED}❌ CRITICAL: .env.local is tracked by git!${NC}"
        echo "   Run: git rm --cached .env.local"
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
    else
        echo -e "${GREEN}✅ .env.local exists but not tracked${NC}"
    fi
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $FOUND_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No secrets detected in git history${NC}"
    echo -e "${GREEN}✅ Security check passed${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $FOUND_ISSUES potential security issues${NC}"
    echo ""
    echo "Recommended actions:"
    echo "1. Review matches above for actual secrets"
    echo "2. If secrets found, rotate them immediately"
    echo "3. Consider using git-filter-repo to remove from history"
    echo "4. Update Vercel secrets if production credentials exposed"
    exit 1
fi
