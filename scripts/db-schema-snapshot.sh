#!/bin/bash
# DATABASE SCHEMA SNAPSHOT TOOL
# DATA-001 Risk Mitigation: Automated schema backup and rollback

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SNAPSHOT_DIR=".ai/db-snapshots"
LOG_FILE="$SNAPSHOT_DIR/operations.log"
PRISMA_SCHEMA="prisma/schema.prisma"

# Ensure snapshot directory exists
mkdir -p "$SNAPSHOT_DIR"

# Logging function
log_operation() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Parse DATABASE_URL from .env
load_database_url() {
    if [ -f .env ]; then
        export $(grep -v '^#' .env | grep DATABASE_URL | xargs)
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ DATABASE_URL not found in .env or environment${NC}"
        echo "   Set it with: export DATABASE_URL='<your-database-url>'"
        exit 1
    fi
    
    # Parse connection details
    export PGHOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
    export PGPORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    export PGDATABASE=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
    export PGUSER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\).*/\1/p')
    export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\).*/\1/p')
}

# Validate prerequisites
validate_prerequisites() {
    # Check pg_dump
    if ! command -v pg_dump &> /dev/null; then
        echo -e "${RED}❌ pg_dump not found${NC}"
        echo "   Install with: sudo apt-get install postgresql-client"
        exit 1
    fi
    
    # Check psql
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}❌ psql not found${NC}"
        exit 1
    fi
    
    # Check Prisma
    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm not found${NC}"
        exit 1
    fi
}

# Test database connection
test_connection() {
    if ! psql -c "SELECT 1" > /dev/null 2>&1; then
        echo -e "${RED}❌ Database connection failed${NC}"
        echo "   Check DATABASE_URL and network connectivity"
        exit 1
    fi
}

# Create snapshot
create_snapshot() {
    local LABEL=$1
    local TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
    local SNAPSHOT_FILE="$SNAPSHOT_DIR/snapshot_${TIMESTAMP}.sql"
    local META_FILE="$SNAPSHOT_DIR/snapshot_${TIMESTAMP}.meta.json"
    local PRISMA_BACKUP="$SNAPSHOT_DIR/snapshot_${TIMESTAMP}.prisma"
    
    echo ""
    echo -e "${BLUE}📸 Creating database schema snapshot${NC}"
    echo "   Timestamp: $TIMESTAMP"
    [ -n "$LABEL" ] && echo "   Label: $LABEL"
    echo ""
    
    # Dump schema only (no data)
    echo -e "${YELLOW}⏳ Dumping schema...${NC}"
    pg_dump --schema-only --no-owner --no-acl > "$SNAPSHOT_FILE"
    
    if [ ! -s "$SNAPSHOT_FILE" ]; then
        echo -e "${RED}❌ Snapshot failed - file is empty${NC}"
        rm -f "$SNAPSHOT_FILE"
        exit 1
    fi
    
    # Calculate SHA256 hash
    local HASH=$(sha256sum "$SNAPSHOT_FILE" | awk '{print $1}')
    
    # Backup Prisma schema
    if [ -f "$PRISMA_SCHEMA" ]; then
        cp "$PRISMA_SCHEMA" "$PRISMA_BACKUP"
    fi
    
    # Create metadata
    cat > "$META_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "label": "$LABEL",
  "database_url": "$(echo $DATABASE_URL | sed 's/:[^:]*@/:***@/')",
  "sha256": "$HASH",
  "prisma_schema": "$([ -f "$PRISMA_SCHEMA" ] && echo "backed up" || echo "not found")",
  "created_at": "$(date -Iseconds)"
}
EOF
    
    # Create "latest" symlink
    ln -sf "snapshot_${TIMESTAMP}.sql" "$SNAPSHOT_DIR/latest.sql"
    ln -sf "snapshot_${TIMESTAMP}.meta.json" "$SNAPSHOT_DIR/latest.meta.json"
    
    echo -e "${GREEN}✅ Snapshot created successfully${NC}"
    echo "   File: $SNAPSHOT_FILE"
    echo "   Size: $(du -h "$SNAPSHOT_FILE" | cut -f1)"
    echo "   Hash: $HASH"
    
    log_operation "SNAPSHOT_CREATED: snapshot_${TIMESTAMP} (label: $LABEL)"
}

# List snapshots
list_snapshots() {
    echo ""
    echo -e "${BLUE}📋 Available Snapshots${NC}"
    echo ""
    
    if [ ! -d "$SNAPSHOT_DIR" ] || [ -z "$(ls -A "$SNAPSHOT_DIR"/*.sql 2>/dev/null)" ]; then
        echo "   No snapshots found"
        return
    fi
    
    for snapshot in "$SNAPSHOT_DIR"/snapshot_*.sql; do
        local basename=$(basename "$snapshot" .sql)
        local meta_file="$SNAPSHOT_DIR/${basename}.meta.json"
        
        if [ -f "$meta_file" ]; then
            local label=$(jq -r '.label // "no label"' "$meta_file" 2>/dev/null || echo "no label")
            local created=$(jq -r '.created_at' "$meta_file" 2>/dev/null || echo "unknown")
            local size=$(du -h "$snapshot" | cut -f1)
            
            echo "   📸 $basename"
            echo "      Label: $label"
            echo "      Created: $created"
            echo "      Size: $size"
            echo ""
        fi
    done
}

# Verify snapshot integrity
verify_snapshot() {
    local SNAPSHOT_NAME=$1
    local SNAPSHOT_FILE="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.sql"
    local META_FILE="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.meta.json"
    
    echo ""
    echo -e "${BLUE}🔍 Verifying snapshot: $SNAPSHOT_NAME${NC}"
    echo ""
    
    if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo -e "${RED}❌ Snapshot file not found: $SNAPSHOT_FILE${NC}"
        exit 1
    fi
    
    if [ ! -f "$META_FILE" ]; then
        echo -e "${YELLOW}⚠️  Metadata file not found (old snapshot format)${NC}"
        echo -e "${GREEN}✅ Snapshot file exists${NC}"
        return 0
    fi
    
    # Verify hash
    local EXPECTED_HASH=$(jq -r '.sha256' "$META_FILE")
    local ACTUAL_HASH=$(sha256sum "$SNAPSHOT_FILE" | awk '{print $1}')
    
    if [ "$EXPECTED_HASH" = "$ACTUAL_HASH" ]; then
        echo -e "${GREEN}✅ Integrity check passed${NC}"
        echo "   Hash: $ACTUAL_HASH"
    else
        echo -e "${RED}❌ Integrity check FAILED${NC}"
        echo "   Expected: $EXPECTED_HASH"
        echo "   Actual: $ACTUAL_HASH"
        exit 1
    fi
}

# Restore from snapshot
restore_snapshot() {
    local SNAPSHOT_NAME=$1
    local SNAPSHOT_FILE="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.sql"
    local PRISMA_BACKUP="$SNAPSHOT_DIR/${SNAPSHOT_NAME}.prisma"
    
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: This will restore database schema from snapshot${NC}"
    echo -e "${YELLOW}   Current schema will be REPLACED${NC}"
    echo ""
    echo "   Snapshot: $SNAPSHOT_NAME"
    echo ""
    
    # Verify snapshot exists and is valid
    if [ ! -f "$SNAPSHOT_FILE" ]; then
        echo -e "${RED}❌ Snapshot not found: $SNAPSHOT_FILE${NC}"
        exit 1
    fi
    
    verify_snapshot "$SNAPSHOT_NAME"
    
    # Confirmation
    echo ""
    read -p "Type 'RESTORE' to confirm restoration: " CONFIRM
    
    if [ "$CONFIRM" != "RESTORE" ]; then
        echo "Restoration cancelled"
        exit 0
    fi
    
    # Create emergency backup before restoration
    echo ""
    echo -e "${BLUE}📸 Creating emergency backup before restore...${NC}"
    create_snapshot "emergency-backup-before-restore"
    
    echo ""
    echo -e "${YELLOW}🔄 Restoring schema from snapshot...${NC}"
    
    # Drop and recreate schema (transaction-safe where possible)
    psql << EOF
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
EOF
    
    # Restore schema
    psql < "$SNAPSHOT_FILE"
    
    # Restore Prisma schema if available
    if [ -f "$PRISMA_BACKUP" ]; then
        echo -e "${BLUE}📄 Restoring Prisma schema file...${NC}"
        cp "$PRISMA_BACKUP" "$PRISMA_SCHEMA"
    fi
    
    # Sync Prisma
    echo -e "${BLUE}🔄 Syncing Prisma client...${NC}"
    pnpm prisma generate
    
    echo ""
    echo -e "${GREEN}✅ Schema restored successfully${NC}"
    echo "   From: $SNAPSHOT_NAME"
    
    log_operation "SNAPSHOT_RESTORED: $SNAPSHOT_NAME"
}

# Cleanup old snapshots
cleanup_snapshots() {
    local KEEP=${1:-5}
    
    echo ""
    echo -e "${BLUE}🧹 Cleaning up old snapshots (keeping last $KEEP)${NC}"
    echo ""
    
    # Count snapshots
    local TOTAL=$(ls -1 "$SNAPSHOT_DIR"/snapshot_*.sql 2>/dev/null | wc -l)
    
    if [ "$TOTAL" -le "$KEEP" ]; then
        echo "   No cleanup needed ($TOTAL snapshots, keeping $KEEP)"
        return
    fi
    
    # Remove oldest snapshots
    local TO_REMOVE=$((TOTAL - KEEP))
    
    ls -1t "$SNAPSHOT_DIR"/snapshot_*.sql | tail -n "$TO_REMOVE" | while read snapshot; do
        local basename=$(basename "$snapshot" .sql)
        echo "   Removing: $basename"
        rm -f "$SNAPSHOT_DIR/${basename}".{sql,meta.json,prisma}
    done
    
    echo -e "${GREEN}✅ Cleanup complete${NC}"
    echo "   Removed: $TO_REMOVE snapshots"
    echo "   Remaining: $KEEP snapshots"
    
    log_operation "CLEANUP: Removed $TO_REMOVE old snapshots (kept $KEEP)"
}

# Safe migration with auto-rollback
safe_migrate() {
    local LABEL=$1
    
    echo ""
    echo -e "${BLUE}🔄 Safe Migration with Auto-Rollback${NC}"
    echo ""
    
    # Create pre-migration snapshot
    create_snapshot "${LABEL:-pre-migration}"
    
    local SNAPSHOT_NAME=$(ls -1t "$SNAPSHOT_DIR"/snapshot_*.sql | head -n 1 | xargs basename .sql)
    
    echo ""
    echo -e "${YELLOW}⏳ Running migration...${NC}"
    echo ""
    
    # Run migration
    if pnpm db:migrate; then
        echo ""
        echo -e "${GREEN}✅ Migration completed successfully${NC}"
        log_operation "MIGRATION_SUCCESS: $SNAPSHOT_NAME"
    else
        echo ""
        echo -e "${RED}❌ Migration FAILED${NC}"
        echo -e "${YELLOW}🔄 Auto-rolling back to snapshot...${NC}"
        
        # Auto-restore (bypass confirmation for automation)
        export CONFIRM="RESTORE"
        restore_snapshot "$SNAPSHOT_NAME"
        
        echo ""
        echo -e "${RED}❌ Migration failed and rolled back${NC}"
        log_operation "MIGRATION_FAILED: Rolled back to $SNAPSHOT_NAME"
        exit 1
    fi
}

# Main command handler
case "${1:-help}" in
    snapshot)
        validate_prerequisites
        load_database_url
        test_connection
        create_snapshot "${2}"
        ;;
    list)
        list_snapshots
        ;;
    verify)
        if [ -z "$2" ]; then
            echo "Usage: $0 verify <snapshot-name>"
            exit 1
        fi
        verify_snapshot "$2"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo "Usage: $0 restore <snapshot-name>"
            exit 1
        fi
        validate_prerequisites
        load_database_url
        test_connection
        restore_snapshot "$2"
        ;;
    migrate)
        validate_prerequisites
        load_database_url
        test_connection
        safe_migrate "${2}"
        ;;
    cleanup)
        KEEP_COUNT=${2:-5}
        cleanup_snapshots "$KEEP_COUNT"
        ;;
    help|*)
        echo "Database Schema Snapshot Tool (DATA-001 Mitigation)"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  snapshot [label]       Create schema snapshot with optional label"
        echo "  list                   List all available snapshots"
        echo "  verify <snapshot>      Verify snapshot integrity"
        echo "  restore <snapshot>     Restore from snapshot (requires confirmation)"
        echo "  migrate [label]        Run migration with auto-rollback on failure"
        echo "  cleanup [keep]         Remove old snapshots (default: keep 5)"
        echo "  help                   Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 snapshot --label 'before-auth-tables'"
        echo "  $0 list"
        echo "  $0 restore snapshot_20251004_143022"
        echo "  $0 migrate --label 'add-user-roles'"
        echo "  $0 cleanup --keep 5"
        ;;
esac
