# Development Checklist - ALWAYS USE LATEST STABLE

## MANDATORY: Before implementing ANY story with dependencies

### 1. Check Current Versions

```bash
# For each major dependency in story, verify latest stable
npm view <package> version
npm view <package> versions --json | jq '.[-5:]'
```

### 2. Update Package Specs

If story specifies outdated version (>3 months old):

- Update to latest **stable** (not canary/beta)
- Document version change in commit message
- Note: "Story specified X, using Y (latest stable)"

### 3. Common Dependencies to Check

- next (monthly releases, bug fixes critical)
- react/react-dom (tied to Next.js version)
- @tanstack/react-query (frequent improvements)
- prisma (database bugs fixed regularly)
- typescript (type system improvements)

### 4. When to Use Specified Version

ONLY when:

- Specific bug requires exact version
- Breaking changes in newer version documented
- Story explicitly says "pin to version X for reason Y"

### 5. Default Behavior

**ALWAYS use latest stable unless there's a documented reason not to.**

## Why This Matters

- Outdated packages = known bugs (like Next.js 14.0.0 cookie middleware)
- Security vulnerabilities patched in newer versions
- Performance improvements lost
- Wasted time debugging fixed issues

## Implementation Rule

Before `pnpm install`, run:

```bash
pnpm outdated
# Review output, update package.json to latest stable for all critical deps
```

**CRITICAL**: If story is >1 month old, assume all versions are outdated.
