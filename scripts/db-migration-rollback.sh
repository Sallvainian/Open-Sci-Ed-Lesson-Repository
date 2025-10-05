#!/bin/bash
# DATA-001 Mitigation: Database Migration Rollback Script
# Handles safe rollback of Prisma migrations in production

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🔄 DATA-001 Mitigation: Database Migration Rollback Tool"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL environment variable not set${NC}"
    echo "   Set it with: export DATABASE_URL='<your-database-url>'"
    exit 1
fi

# Parse database info
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo -e "${BLUE}📊 Database Information:${NC}"
echo "   Host: $DB_HOST"
echo "   Database: $DB_NAME"
echo ""

# Warning prompt
echo -e "${YELLOW}⚠️  WARNING: This will rollback database migrations${NC}"
echo -e "${YELLOW}   This operation modifies production data${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Rollback cancelled"
    exit 0
fi

# Function to list applied migrations
list_migrations() {
    echo ""
    echo -e "${BLUE}📋 Current Migration Status:${NC}"
    pnpm prisma migrate status
}

# Function to rollback to specific migration
rollback_to_migration() {
    local MIGRATION_NAME=$1

    echo ""
    echo -e "${YELLOW}🔄 Rolling back to migration: $MIGRATION_NAME${NC}"
    echo ""

    # Prisma doesn't have native rollback, so we use resolve + deploy
    # This requires manual intervention

    echo "Rollback steps:"
    echo "1. Mark failed migration as rolled back"
    echo "2. Manually revert schema changes"
    echo "3. Re-deploy previous migration state"
    echo ""

    read -p "Mark migration as rolled back? (yes/no): " MARK

    if [ "$MARK" = "yes" ]; then
        pnpm prisma migrate resolve --rolled-back "$MIGRATION_NAME"
        echo -e "${GREEN}✅ Migration marked as rolled back${NC}"
    fi
}

# Function to restore from backup
restore_from_backup() {
    echo ""
    echo -e "${BLUE}💾 Restore from Supabase Backup${NC}"
    echo ""
    echo "To restore from backup:"
    echo "1. Navigate to Supabase Dashboard → Database → Backups"
    echo "2. Select the backup before migration (check timestamp)"
    echo "3. Click 'Restore' and confirm"
    echo "4. Wait for restoration to complete"
    echo "5. Verify data integrity"
    echo ""
    echo -e "${YELLOW}⚠️  Restoration will overwrite current database${NC}"
    echo ""
    read -p "Have you restored from Supabase backup? (yes/no): " RESTORED

    if [ "$RESTORED" = "yes" ]; then
        echo -e "${GREEN}✅ Backup restoration confirmed${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Verify database schema: pnpm prisma db pull"
        echo "2. Check data integrity"
        echo "3. Run health check: curl <prod-url>/api/health"
    fi
}

# Main menu
echo ""
echo "Rollback Options:"
echo "1. List current migration status"
echo "2. Rollback specific migration"
echo "3. Restore from Supabase backup"
echo "4. Exit"
echo ""
read -p "Select option (1-4): " OPTION

case $OPTION in
    1)
        list_migrations
        ;;
    2)
        list_migrations
        echo ""
        read -p "Enter migration name to rollback: " MIGRATION_NAME
        rollback_to_migration "$MIGRATION_NAME"
        ;;
    3)
        restore_from_backup
        ;;
    4)
        echo "Exiting rollback tool"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Rollback operation complete${NC}"
echo ""
echo "Post-rollback verification:"
echo "1. Check migration status: pnpm prisma migrate status"
echo "2. Verify schema: pnpm prisma db pull"
echo "3. Test health endpoint: curl <prod-url>/api/health"
echo "4. Verify seed data: pnpm db:studio"
echo "5. Document incident in Story 1.7 Change Log"
