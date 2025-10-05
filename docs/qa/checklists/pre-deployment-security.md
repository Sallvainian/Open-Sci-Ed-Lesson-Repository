# Pre-Deployment Security Checklist (SEC-001 Mitigation)

**Purpose**: Prevent environment secrets exposure before production deployment

**Story**: 1.7 - Hosting and Production Environment Setup

**Risk**: SEC-001 (Critical - Score 9)

---

## Pre-Configuration Checks

### ✅ Git Security

- [ ] `.env.local` is listed in `.gitignore`
- [ ] `.env*.local` pattern is listed in `.gitignore`
- [ ] Run `scripts/check-secrets.sh` - must pass with 0 issues
- [ ] Git history scan shows no exposed credentials
- [ ] No `.env.local` file tracked in git (verify with `git ls-files .env.local`)

**If secrets found in history:**

1. Rotate all exposed credentials immediately
2. Consider `git-filter-repo` to remove from history
3. Update Vercel secrets with new credentials
4. Document incident in Story 1.7 Change Log

---

## Vercel Environment Variable Configuration

### ✅ Naming Convention

All secrets must use `@` prefix in Vercel Dashboard:

- [ ] `@database_url` (not DATABASE_URL)
- [ ] `@supabase_url`
- [ ] `@supabase_anon_key`
- [ ] `@supabase_service_key`

### ✅ Secret Scoping

- [ ] `DATABASE_URL` → Production + Preview environments
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → All environments
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` → All environments
- [ ] `SUPABASE_SERVICE_KEY` → **Production ONLY** (critical)

### ✅ Secret Values

- [ ] Production `DATABASE_URL` uses **pooler port 6543** (not 5432)
- [ ] Production secrets differ from development secrets
- [ ] Supabase service key has correct permissions scope
- [ ] No hardcoded credentials in `vercel.json` (must use `@` references)

**Example `vercel.json` configuration:**

```json
{
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "SUPABASE_SERVICE_KEY": "@supabase_service_key"
  }
}
```

---

## Vercel Dashboard Audit

### ✅ Environment Variables Page

Navigate to: **Vercel Dashboard → Project Settings → Environment Variables**

- [ ] All 4 environment variables configured
- [ ] Secret values hidden (show as `•••••••`)
- [ ] Correct scopes assigned (Production, Preview, Development)
- [ ] No typos in variable names (exact match required)
- [ ] No trailing spaces in secret values

### ✅ Deployment Settings

Navigate to: **Vercel Dashboard → Project Settings → Deployment**

- [ ] Build command: `pnpm build`
- [ ] Install command: `pnpm install`
- [ ] Output directory: `.next`
- [ ] Root directory: `.` (project root)

---

## Local Development Safety

### ✅ Local Environment File

If `.env.local` exists locally:

- [ ] File contains development secrets (not production)
- [ ] File is in `.gitignore` (verified above)
- [ ] File is NOT tracked by git
- [ ] File is NOT committed

### ✅ Development Workflow

- [ ] Never copy production secrets to local `.env.local`
- [ ] Use separate Supabase project for local development
- [ ] Document local setup process without exposing secrets

---

## Secret Rotation Procedure

### ✅ Documentation

- [ ] Rotation procedure documented in team docs
- [ ] Access to Vercel dashboard documented
- [ ] Access to Supabase dashboard documented
- [ ] Emergency contact for secret exposure incidents

### ✅ Rotation Steps

1. Generate new secrets in Supabase dashboard
2. Update Vercel environment variables with new values
3. Redeploy application (automatic on main branch push)
4. Verify deployment succeeds with new secrets
5. Deactivate old secrets in Supabase
6. Document rotation in Change Log

**Rotation frequency**: Quarterly or immediately if exposure suspected

---

## CI/CD Integration (Future Enhancement)

### ⏳ Recommended (Not Required for Story 1.7)

- [ ] Install `gitleaks` or similar secret scanning tool
- [ ] Add pre-commit hook to scan for secrets
- [ ] Add CI step to scan all commits for secrets
- [ ] Configure GitHub secret scanning alerts

**Tools**:

- [gitleaks](https://github.com/gitleaks/gitleaks)
- [truffleHog](https://github.com/trufflesecurity/truffleHog)
- GitHub Advanced Security (if available)

---

## Verification Commands

### Run before deployment:

```bash
# 1. Verify .gitignore
grep -E "^\\.env.*local" .gitignore

# 2. Scan git history
./scripts/check-secrets.sh

# 3. Verify .env.local not tracked
git ls-files --error-unmatch .env.local 2>&1 | grep "did not match"

# 4. Check for hardcoded secrets in code
grep -r "DATABASE_URL.*postgres://" --include="*.ts" --include="*.tsx" --include="*.js"
```

**Expected results:**

- ✅ All commands complete without errors
- ✅ No secrets found in git history
- ✅ No hardcoded credentials in source code

---

## Deployment Approval Criteria

**MUST PASS before deploying to production:**

- ✅ All checklist items above completed
- ✅ `scripts/check-secrets.sh` passes (exit code 0)
- ✅ No secrets in git history
- ✅ Vercel environment variables configured correctly
- ✅ Secret scoping verified (production vs preview vs dev)
- ✅ CI pipeline passes (Story 1.6 requirement)

**If ANY item fails:**

❌ **HALT deployment immediately**

1. Address the security issue
2. Re-run this checklist
3. Only proceed when all items pass

---

## Post-Deployment Verification

### ✅ Within 1 hour of deployment:

- [ ] Production application loads successfully
- [ ] Health check endpoint returns 200 OK
- [ ] No secrets exposed in browser DevTools console
- [ ] No secrets exposed in Vercel deployment logs
- [ ] Database connection works (indicates correct DATABASE_URL)

---

## Incident Response

### 🚨 If secrets are exposed:

**Immediate Actions** (within 15 minutes):

1. Rotate all exposed credentials in Supabase
2. Update Vercel environment variables
3. Redeploy application
4. Verify new deployment succeeds

**Follow-up Actions** (within 24 hours):

1. Investigate how exposure occurred
2. Update security procedures to prevent recurrence
3. Document incident in Story 1.7 Change Log
4. Consider git history cleanup if secrets in commits

---

## Residual Risk Assessment

**With all mitigations applied:**

- **Residual Risk**: Low
- **Justification**: Proper procedures and automation reduce human error to minimal levels
- **Ongoing Monitoring**: Quarterly secret rotation, CI secret scanning (future)

---

## Checklist Completion

**Completed by**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Date**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
**Verified by**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ (Second reviewer)

**Deployment approved**: ☐ YES ☐ NO

**Notes**:

---

_This checklist must be completed and approved before Story 1.7 Task 3 (Configure production environment variables) can proceed._
