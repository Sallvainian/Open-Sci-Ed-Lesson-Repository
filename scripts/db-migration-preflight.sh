#!/bin/bash
# DATABASE MIGRATION PRE-FLIGHT VALIDATION
# DATA-001 Risk Mitigation: Comprehensive safety checks before migrations

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

VALIDATION_FAILED=0

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  DATABASE MIGRATION PRE-FLIGHT VALIDATION${NC}"
echo -e "${BLUE}  DATA-001 Risk Mitigation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Helper function for pass/fail output
pass() {
    echo -e "${GREEN}✓${NC} $1"
}

fail() {
    echo -e "${RED}✗${NC} $1"
    VALIDATION_FAILED=1
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 1: DATABASE_URL Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[1/9] DATABASE_URL Configuration${NC}"

if [ -z "$DATABASE_URL" ]; then
    # Try loading from .env
    if [ -f .env ]; then
        export $(grep -v '^#' .env | grep DATABASE_URL | xargs)
    fi
fi

if [ -z "$DATABASE_URL" ]; then
    fail "DATABASE_URL not set"
    info "Set with: export DATABASE_URL='<your-database-url>'"
    info "Or add to .env file"
else
    # Validate format
    if [[ "$DATABASE_URL" =~ ^postgresql:// ]]; then
        pass "DATABASE_URL is set with valid PostgreSQL format"
    else
        fail "DATABASE_URL has invalid format (must start with postgresql://)"
    fi
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 2: Pooler Port Check (Supabase)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[2/9] Database Connection Type${NC}"

if [[ "$DATABASE_URL" =~ :6543 ]]; then
    pass "Using pooler port 6543 (serverless compatible)"
elif [[ "$DATABASE_URL" =~ :5432 ]]; then
    fail "Using direct port 5432 (not recommended for serverless)"
    info "Supabase pooler port: 6543"
    info "Get from: Supabase Dashboard → Database → Connection pooling"
else
    warn "Could not detect port (manual verification required)"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 3: Database Connectivity
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[3/9] Database Connectivity${NC}"

# Parse connection details for psql
export PGHOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
export PGPORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
export PGDATABASE=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
export PGUSER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\).*/\1/p')
export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')

if command -v psql &> /dev/null; then
    if psql -c "SELECT 1" > /dev/null 2>&1; then
        pass "Database connection successful"
        info "Host: $PGHOST"
        info "Database: $PGDATABASE"
    else
        fail "Database connection failed"
        info "Check network connectivity and credentials"
        info "Verify database is not paused (Supabase free tier)"
    fi
else
    warn "psql not found - skipping connection test"
    info "Install with: sudo apt-get install postgresql-client"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 4: Database Permissions
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[4/9] Database Permissions${NC}"

if command -v psql &> /dev/null; then
    # Check CREATE permission
    if psql -c "CREATE TABLE _preflight_test (id INTEGER)" > /dev/null 2>&1; then
        psql -c "DROP TABLE _preflight_test" > /dev/null 2>&1
        pass "User has CREATE permission"
    else
        fail "User lacks CREATE permission (required for migrations)"
    fi
    
    # Check INSERT permission
    if psql -c "SELECT 1 FROM information_schema.tables LIMIT 1" > /dev/null 2>&1; then
        pass "User has SELECT permission"
    else
        warn "User may lack SELECT permission"
    fi
else
    warn "Skipping permission checks (psql not found)"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 5: Schema State
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[5/9] Schema State${NC}"

if command -v psql &> /dev/null; then
    # Check if _prisma_migrations table exists
    MIGRATION_TABLE=$(psql -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = '_prisma_migrations'" 2>/dev/null || echo "0")
    
    if [ "$MIGRATION_TABLE" -gt 0 ]; then
        pass "Migration tracking table exists"
        
        # Check for dirty migrations
        DIRTY_COUNT=$(psql -tAc "SELECT COUNT(*) FROM _prisma_migrations WHERE finished_at IS NULL" 2>/dev/null || echo "0")
        
        if [ "$DIRTY_COUNT" -eq 0 ]; then
            pass "No dirty migrations detected"
        else
            fail "Found $DIRTY_COUNT dirty migration(s)"
            info "Resolve with: pnpm prisma migrate resolve --rolled-back <migration-name>"
        fi
    else
        warn "Migration tracking table not found (first migration?)"
        info "This is normal for new databases"
    fi
else
    warn "Skipping schema state checks (psql not found)"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 6: Pending Migrations
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[6/9] Pending Migrations${NC}"

if command -v pnpm &> /dev/null; then
    MIGRATION_STATUS=$(pnpm prisma migrate status 2>&1 || true)
    
    if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
        pass "No pending migrations"
    elif echo "$MIGRATION_STATUS" | grep -q "Your local migration history"; then
        warn "Pending migrations detected"
        info "This is expected - migrations will be applied"
    elif echo "$MIGRATION_STATUS" | grep -q "ERROR"; then
        fail "Migration status check failed"
        info "$MIGRATION_STATUS"
    else
        warn "Could not determine migration status"
    fi
else
    warn "Skipping migration check (pnpm not found)"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 7: Backup Verification
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[7/9] Backup Verification${NC}"

warn "Manual backup verification required"
echo ""
echo "   Verify in Supabase Dashboard:"
echo "   1. Navigate to Database → Backups"
echo "   2. Confirm recent backup exists (<24 hours old)"
echo "   3. Note backup timestamp for rollback"
echo ""

read -p "   Has a recent backup been verified? (yes/no): " BACKUP_CONFIRMED

if [ "$BACKUP_CONFIRMED" = "yes" ]; then
    pass "Backup verified by user"
else
    fail "Backup not verified"
    info "Create manual backup before proceeding"
    info "Supabase Dashboard → Database → Backups → Create backup"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 8: Environment Context
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[8/9] Environment Context${NC}"

# Detect environment from DATABASE_URL
if [[ "$DATABASE_URL" =~ staging ]]; then
    info "Environment: STAGING (detected from DATABASE_URL)"
    pass "Safe to proceed with staging migration"
elif [[ "$DATABASE_URL" =~ production|prod ]]; then
    warn "Environment: PRODUCTION (detected from DATABASE_URL)"
    echo ""
    echo "   ${YELLOW}⚠️  PRODUCTION MIGRATION SAFETY CHECKLIST:${NC}"
    echo "   □ Staging migration tested successfully"
    echo "   □ Migration rollback procedure documented"
    echo "   □ Backup verified (see above)"
    echo "   □ Off-peak hours (low traffic window)"
    echo "   □ Team notified of maintenance"
    echo ""
    
    read -p "   Has staging migration been tested? (yes/no): " STAGING_TESTED
    
    if [ "$STAGING_TESTED" = "yes" ]; then
        pass "Staging migration confirmed"
    else
        fail "Production migration without staging test"
        info "Follow: docs/qa/guides/supabase-staging-setup.md"
        info "Test on staging first!"
    fi
else
    info "Environment: DEVELOPMENT (assumed from DATABASE_URL)"
    pass "Safe to proceed with development migration"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VALIDATION 9: Required Tools
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo -e "${BLUE}[9/9] Required Tools${NC}"

TOOLS=("node" "pnpm" "psql")
TOOLS_OK=true

for tool in "${TOOLS[@]}"; do
    if command -v "$tool" &> /dev/null; then
        VERSION=$("$tool" --version 2>&1 | head -n 1)
        pass "$tool found ($VERSION)"
    else
        fail "$tool not found"
        TOOLS_OK=false
    fi
done

if [ "$TOOLS_OK" = false ]; then
    info "Install missing tools before proceeding"
fi

echo ""

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FINAL RESULT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $VALIDATION_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ PRE-FLIGHT VALIDATION PASSED${NC}"
    echo ""
    echo "   Safe to proceed with migration:"
    echo "   $ pnpm db:migrate"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}❌ PRE-FLIGHT VALIDATION FAILED${NC}"
    echo ""
    echo "   Fix the issues above before proceeding"
    echo "   Migration is BLOCKED for safety"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
