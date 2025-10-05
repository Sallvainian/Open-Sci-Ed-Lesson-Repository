# Database Migration Safety Checklist (DATA-001 Mitigation)

**Purpose**: Prevent production database migration failures and data corruption

**Story**: 1.7 - Hosting and Production Environment Setup

**Risk**: DATA-001 (Critical - Score 9)

---

## Pre-Migration Preparation

### ✅ Backup Creation

**Navigate to**: Supabase Dashboard → Database → Backups

- [ ] Pre-migration backup created manually (do not rely on automated daily backup)
- [ ] Backup timestamp recorded: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] Backup size verified: \_\_\_\_\_\_\_\_ MB
- [ ] Backup status: Complete (not in progress)
- [ ] Screenshot of backup confirmation saved

**Backup location**: Supabase manages backups automatically

**Recovery time objective (RTO)**: <5 minutes

---

### ✅ Staging Environment Testing

**Required**: Test migration on Supabase preview/staging environment first

- [ ] Staging database environment created (separate from production)
- [ ] Staging `DATABASE_URL` configured
- [ ] Migration executed on staging: `pnpm db:migrate`
- [ ] Migration completed successfully (no errors)
- [ ] All tables created: `disciplines`, `units`, `lessons`, `resources`
- [ ] Seed script executed on staging: `pnpm db:seed`
- [ ] Seed data verified in staging Prisma Studio

**Staging migration command**:

```bash
export DATABASE_URL="<staging-database-url>"
pnpm prisma generate
pnpm db:migrate
pnpm db:seed
```

**Verification**:

```bash
# Check tables exist
pnpm prisma studio

# Count seed records
# Expected: 3 disciplines, 1 unit, 1 lesson
```

---

### ✅ Migration Idempotency Verification

**Test on staging**: Can migration run multiple times safely?

- [ ] First migration run: Successful
- [ ] Second migration run: No errors (idempotent)
- [ ] Database state unchanged after second run
- [ ] No duplicate records created

**Idempotency test**:

```bash
# Run migration twice
pnpm db:migrate
pnpm db:migrate  # Should complete without errors

# Verify no duplicates
pnpm prisma studio
# Check: Still 3 disciplines, 1 unit, 1 lesson (not 6, 2, 2)
```

---

### ✅ Rollback Procedure Documented

- [ ] Rollback script available: `scripts/db-migration-rollback.sh`
- [ ] Rollback steps documented (see below)
- [ ] Team trained on rollback procedure
- [ ] Emergency contact identified: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Rollback Steps**:

1. **Immediate**: Stop application (prevent further writes)
2. **Restore**: Use `scripts/db-migration-rollback.sh`
3. **Verify**: Check data integrity
4. **Redeploy**: Redeploy application with previous schema
5. **Monitor**: Watch for errors

---

## Migration Execution Checklist

### ✅ Pre-Execution Verification

- [ ] Staging migration successful (verified above)
- [ ] Pre-migration backup created (verified above)
- [ ] Production `DATABASE_URL` confirmed (pooler port 6543)
- [ ] Current time recorded: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] Vercel deployment paused (no new deploys during migration)

---

### ✅ Connection String Validation

**Critical**: Verify production DATABASE_URL uses pooler port

```bash
echo $DATABASE_URL | grep ':6543'
```

- [ ] Connection string contains `:6543` (pooler port)
- [ ] **NOT** `:5432` (direct connection)
- [ ] Hostname: `*.pooler.supabase.com`
- [ ] Database name: `postgres`

**Correct format**:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

---

### ✅ Migration Execution

**Production migration commands**:

```bash
# Set production DATABASE_URL
export DATABASE_URL="<production-pooler-url>"

# Generate Prisma client
pnpm prisma generate

# Run migration (deploy mode)
pnpm db:migrate

# Expected output: "Migration applied successfully"
```

- [ ] Prisma client generation: Successful
- [ ] Migration deployment: Successful
- [ ] No errors in migration output
- [ ] Migration completion time: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Monitor Supabase Dashboard** during migration:

- [ ] Connection count stable (not spiking)
- [ ] No query errors
- [ ] CPU usage normal (<80%)
- [ ] Memory usage normal (<80%)

---

### ✅ Post-Migration Verification

**Verify schema created**:

```bash
# Option 1: Prisma Studio
pnpm prisma studio
# Check: All tables present

# Option 2: psql
psql $DATABASE_URL -c "\dt"
# Expected: disciplines, units, lessons, resources
```

- [ ] All tables created
- [ ] Table schemas match `prisma/schema.prisma`
- [ ] Indexes created (check with `\di` in psql)
- [ ] Foreign keys established

---

## Seed Data Execution

### ✅ Seed Script Execution

**Production seed command**:

```bash
export DATABASE_URL="<production-pooler-url>"
pnpm db:seed
```

- [ ] Seed script executed successfully
- [ ] No errors in seed output
- [ ] Seed completion time: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

### ✅ Seed Data Verification

**Expected seed data**:

- 3 Disciplines: Physical Science, Life Science, Earth and Space Science
- 1 Unit: "8.1 Forces and Motion"
- 1 Lesson: "Lesson 1: Investigating Contact Forces"

**Verification queries**:

```sql
-- Check disciplines
SELECT COUNT(*) FROM disciplines;
-- Expected: 3

-- Check units
SELECT COUNT(*) FROM units;
-- Expected: 1

-- Check lessons
SELECT COUNT(*) FROM lessons;
-- Expected: 1

-- Verify specific data
SELECT name FROM disciplines ORDER BY display_order;
-- Expected: Physical Science, Life Science, Earth and Space Science
```

- [ ] Discipline count: 3
- [ ] Unit count: 1
- [ ] Lesson count: 1
- [ ] Data integrity verified (foreign keys correct)

---

### ✅ Seed Idempotency Test

**Test on staging first**:

```bash
pnpm db:seed
pnpm db:seed  # Run twice
```

- [ ] Second seed run: No errors OR gracefully skips duplicates
- [ ] No duplicate disciplines created
- [ ] No duplicate units created
- [ ] No duplicate lessons created

**If duplicates occur**: Update seed script to check existence before insert

---

## Application Integration Testing

### ✅ Health Check Endpoint

**Test health endpoint with database query**:

```bash
curl https://<production-url>.vercel.app/api/health
```

**Expected response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "checks": {
    "database": "ok",
    "storage": "ok"
  }
}
```

- [ ] HTTP status: 200 OK
- [ ] Response contains `"database": "ok"`
- [ ] No connection errors
- [ ] Response time: <2 seconds

---

### ✅ Database Query Test

**Test actual database queries from application**:

```bash
# Test disciplines endpoint
curl https://<production-url>.vercel.app/api/disciplines

# Expected: Array of 3 disciplines
```

- [ ] API returns seed data
- [ ] No SQL errors in Vercel logs
- [ ] No timeout errors
- [ ] Query response time: <1 second

---

## Monitoring and Validation

### ✅ Supabase Dashboard Monitoring

**Monitor for 30 minutes post-migration**:

- [ ] Connection pool usage: Normal (<50% of max)
- [ ] Query performance: No slow queries (>5s)
- [ ] Error rate: 0 errors
- [ ] CPU usage: Normal (<60%)
- [ ] Memory usage: Normal (<70%)

**Dashboard location**: Supabase Dashboard → Database → Monitoring

---

### ✅ Vercel Logs Monitoring

**Check Vercel deployment logs**:

- [ ] No HTTP 500 errors
- [ ] No database connection errors
- [ ] No Prisma client errors
- [ ] Function execution time: <10s

**Dashboard location**: Vercel Dashboard → Project → Logs

---

## Rollback Trigger Conditions

**Trigger rollback immediately if**:

- ❌ Migration fails with error
- ❌ Seed script fails
- ❌ Health check returns 503
- ❌ Database query errors spike
- ❌ Connection pool exhausted
- ❌ Application returns 500 errors

**Rollback procedure**:

```bash
# 1. Execute rollback script
./scripts/db-migration-rollback.sh

# 2. Follow prompts to restore from backup

# 3. Verify restoration
curl https://<prod-url>/api/health

# 4. Document incident
```

---

## Post-Migration Documentation

### ✅ Documentation Updates

- [ ] Migration completion time recorded in Change Log
- [ ] Production DATABASE_URL documented (without password)
- [ ] Seed data documented
- [ ] Any issues encountered documented
- [ ] Rollback procedure tested: ☐ YES ☐ NO ☐ N/A

### ✅ Story 1.7 Updates

Update **Story 1.7** file with:

- [ ] Task 4 marked complete
- [ ] File List updated with migration files
- [ ] Completion Notes added
- [ ] Change Log entry added

---

## Success Criteria

**Migration considered successful when**:

- ✅ All tables created in production database
- ✅ Seed data inserted correctly (3 disciplines, 1 unit, 1 lesson)
- ✅ Health check endpoint returns 200 OK
- ✅ Database queries work from production application
- ✅ No errors in Supabase dashboard (30-minute observation)
- ✅ No errors in Vercel logs (30-minute observation)
- ✅ Rollback procedure documented and validated

---

## Residual Risk Assessment

**With all mitigations applied**:

- **Residual Risk**: Medium
- **Justification**: Database operations inherently risky, but comprehensive testing and backup minimize impact
- **Ongoing Monitoring**: Supabase backup schedule, query performance tracking

---

## Checklist Completion

**Completed by**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Date**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Verified by**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Second reviewer)

**Migration approved**: ☐ YES ☐ NO

**Notes**:

---

_This checklist must be completed before Story 1.7 Task 4 (Run database migrations in production) can proceed._
