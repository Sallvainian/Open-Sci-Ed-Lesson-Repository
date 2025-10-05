# Supabase Staging Environment Setup Guide

**Purpose**: Create isolated staging environment for safe database migration testing before production deployment

**Story**: 1.7 - Hosting and Production Environment Setup

**Risk Mitigation**: DATA-001 (Database Migration Failure - Score 9)

---

## Prerequisites

### Required Access

- [ ] Supabase account (same account as production)
- [ ] GitHub repository access
- [ ] Local development environment configured

### Required Tools

Verify installation:

```bash
# Node.js and pnpm
node --version  # v18+
pnpm --version  # v8+

# PostgreSQL client
psql --version  # v14+

# Prisma CLI
pnpm prisma --version
```

### Required Information

From production Supabase project:

- Production project name
- Production DATABASE_URL (for schema reference)
- Production region (for matching staging region)

---

## Step 1: Create Staging Supabase Project

### 1.1 Navigate to Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Click "New Project" button

### 1.2 Configure Staging Project

**Project Settings**:

- **Name**: `{production-name}-staging` (e.g., `lesson-repo-staging`)
- **Database Password**: Generate strong password (save securely)
- **Region**: **Same as production** (for parity)
- **Pricing Plan**: Free (sufficient for staging)

Click "Create new project" and wait 2-3 minutes for provisioning.

---

## Step 2: Configure Staging Database

### 2.1 Retrieve Staging Connection String

1. Navigate to **Project Settings → Database**
2. Scroll to **Connection string**
3. Select **Connection pooling** tab
4. Copy **Connection string** (pooler mode - port 6543)

**Format**:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### 2.2 Save Staging Credentials Locally

Create `.env.staging`:

```bash
# Staging database (DO NOT COMMIT)
DATABASE_URL="postgresql://postgres.[STAGING_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[STAGING_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[STAGING_ANON_KEY]"
```

Add to `.gitignore`:

```bash
echo ".env.staging" >> .gitignore
```

---

## Step 3: Clone Production Schema to Staging

### Option A: Using Prisma (Recommended)

**Advantages**: Simple, version-controlled, matches development flow

```bash
# 1. Set staging DATABASE_URL
export DATABASE_URL="postgresql://postgres.[STAGING_REF]:..."

# 2. Generate Prisma client
pnpm prisma generate

# 3. Push schema to staging (creates tables)
pnpm prisma db push

# 4. Verify schema created
pnpm prisma studio
# Opens browser - verify tables exist

# 5. Seed staging database
pnpm db:seed
# Verify: 3 disciplines, 1 unit, 1 lesson created
```

**Result**: Staging schema matches `prisma/schema.prisma`

---

### Option B: Using SQL Dump (For Production Data Clone)

**Advantages**: Includes production data, exact production state

**Use when**: Testing migrations on production-like data

```bash
# 1. Dump production schema + data (requires production DATABASE_URL)
export DATABASE_URL="<production-database-url>"
pg_dump --schema-only --no-owner --no-acl > schema_dump.sql

# Optional: Include data (WARNING: May contain sensitive data)
pg_dump --data-only --no-owner --no-acl > data_dump.sql

# 2. Apply to staging
export DATABASE_URL="<staging-database-url>"
psql < schema_dump.sql

# Optional: Load data
psql < data_dump.sql

# 3. Clean up dumps (contains sensitive data)
rm schema_dump.sql data_dump.sql
```

**Security Note**: If using data dumps, ensure no sensitive user data before committing.

---

## Step 4: Configure Local Environment for Staging

### 4.1 Create Helper Scripts

Create `scripts/use-staging.sh`:

```bash
#!/bin/bash
# Quick switch to staging environment

export $(grep -v '^#' .env.staging | xargs)
echo "✓ Switched to STAGING environment"
echo "  Database: $DATABASE_URL"
```

Create `scripts/use-production.sh`:

```bash
#!/bin/bash
# Quick switch to production environment

export $(grep -v '^#' .env.production | xargs)
echo "⚠️  Switched to PRODUCTION environment"
echo "  Database: $DATABASE_URL"
```

Make executable:

```bash
chmod +x scripts/use-staging.sh scripts/use-production.sh
```

### 4.2 Usage

```bash
# Switch to staging
source scripts/use-staging.sh

# Verify connection
pnpm prisma db pull

# Run migration test
pnpm db:migrate

# Switch back to development
unset DATABASE_URL
```

---

## Step 5: Migration Testing Workflow

### 5.1 Pre-Migration Testing Checklist

**Run these checks on staging BEFORE production migration**:

```bash
# 1. Switch to staging
source scripts/use-staging.sh

# 2. Verify connection
pnpm prisma db pull

# 3. Create pre-migration snapshot (if using snapshot tool)
./scripts/db-schema-snapshot.sh snapshot --label "pre-migration-test"

# 4. Run migration
pnpm db:migrate

# 5. Verify migration succeeded
pnpm prisma studio
# Check: All expected tables/columns present

# 6. Test seed script (if applicable)
pnpm db:seed

# 7. Verify seed idempotency
pnpm db:seed  # Run twice
pnpm prisma studio
# Check: No duplicate records

# 8. Test application with staging database
pnpm dev
# Navigate to http://localhost:3000
# Verify: Application works with staging data

# 9. Document results
echo "Migration test completed successfully" >> .ai/staging-test-log.txt
```

---

### 5.2 Rollback Testing

**Test rollback procedure on staging**:

```bash
# 1. Create snapshot before migration
./scripts/db-schema-snapshot.sh snapshot --label "rollback-test"

# 2. Run migration
pnpm db:migrate

# 3. Simulate failure - restore from snapshot
./scripts/db-schema-snapshot.sh restore snapshot_[timestamp]

# 4. Verify restoration
pnpm prisma studio
# Check: Schema reverted to pre-migration state
```

---

## Step 6: Integration with QA Checklists

### Reference in Database Migration Safety Checklist

**From `docs/qa/checklists/database-migration-safety.md`**:

**Section: Staging Environment Testing** → Use this guide

```bash
# Follow staging setup guide
cat docs/qa/guides/supabase-staging-setup.md

# Then run staging migration test
source scripts/use-staging.sh
pnpm db:migrate
```

### Reference in Story 1.7 Tasks

**Task 4: Run database migrations in production**

```
- [ ] Follow staging setup guide (docs/qa/guides/supabase-staging-setup.md)
- [ ] Test migration on staging (verify success)
- [ ] Document staging test results
- [ ] Only then proceed to production migration
```

---

## Maintenance

### Regular Staging Refresh

**Frequency**: Before each major migration or monthly

```bash
# 1. Drop staging schema
source scripts/use-staging.sh
pnpm prisma migrate reset --force

# 2. Re-clone from production (Option A or B above)
pnpm prisma db push
pnpm db:seed

# 3. Verify clean state
pnpm prisma studio
```

---

## Troubleshooting

### Issue: "Database connection failed"

**Cause**: Staging project paused (Supabase free tier auto-pauses after inactivity)

**Solution**:

1. Navigate to Supabase Dashboard → Project
2. Click "Resume project"
3. Wait 30 seconds for activation
4. Retry connection

---

### Issue: "Schema not visible in Prisma Studio"

**Cause**: Wrong DATABASE_URL or schema not pushed

**Solution**:

```bash
# Verify correct DATABASE_URL
echo $DATABASE_URL | grep "staging"

# Re-push schema
pnpm prisma db push
```

---

### Issue: "Migration failed - schema already exists"

**Cause**: Previous migration partially applied

**Solution**:

```bash
# Check migration status
pnpm prisma migrate status

# Resolve dirty migrations
pnpm prisma migrate resolve --rolled-back [migration-name]

# Re-run migration
pnpm db:migrate
```

---

### Issue: "Staging schema diverged from development"

**Cause**: Manual schema changes in staging

**Solution**:

```bash
# Reset staging to match schema
pnpm prisma migrate reset --force
pnpm prisma db push
pnpm db:seed
```

---

## Best Practices

### Security

- ✅ Never commit `.env.staging` to git
- ✅ Use separate credentials for staging vs production
- ✅ Limit staging access to development team only
- ✅ Clean up sensitive data if cloning from production

### Efficiency

- ✅ Keep staging schema synchronized with development
- ✅ Test all migrations on staging first
- ✅ Document staging test results for audit trail
- ✅ Use staging for destructive operation testing

### Team Coordination

- ✅ Communicate when using staging environment
- ✅ Document staging environment changes
- ✅ Reset staging to clean state after testing
- ✅ Share staging test results with team

---

## Quick Reference

**Create staging project**: Supabase Dashboard → New Project

**Get connection string**: Project Settings → Database → Connection pooling

**Switch to staging**: `source scripts/use-staging.sh`

**Test migration**: `pnpm db:migrate`

**Reset staging**: `pnpm prisma migrate reset --force`

**Verify schema**: `pnpm prisma studio`

---

## Summary

**Staging environment provides**:

✅ Safe migration testing before production
✅ Rollback procedure validation
✅ Data integrity verification
✅ Seed script idempotency testing
✅ Application compatibility testing
✅ Risk-free experimentation environment

**DATA-001 Risk Reduction**: High → Low (with staging testing)

---

_This guide is referenced by Story 1.7 and the Database Migration Safety Checklist._
