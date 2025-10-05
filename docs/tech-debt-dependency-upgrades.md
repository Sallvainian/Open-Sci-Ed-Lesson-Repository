# Technical Debt: Major Dependency Upgrades

**Created**: 2025-10-04
**Priority**: Medium (security/features), High (if blocking bugs)

## Critical Major Version Upgrades Needed

### 1. React 18 → 19 (Breaking Changes)

**Current**: 18.3.1
**Latest**: 19.2.0
**Impact**: Core framework, affects all components
**Effort**: Medium (2-4 hours)
**Blockers**:

- Chakra UI may not support React 19 yet
- Testing Library needs React 19 compatibility check
- Next.js 14 officially supports React 18, not 19

**Action Required**:

- Wait for Next.js 15 stable OR
- Verify Chakra UI v3 + React 19 compatibility first
- Create dedicated upgrade story with full regression testing

---

### 2. Chakra UI 2 → 3 (Breaking Changes)

**Current**: 2.10.9
**Latest**: 3.27.0
**Impact**: ALL UI components
**Effort**: High (4-8 hours)
**Breaking Changes**:

- Import path changes
- Component API changes
- Theme structure changes

**Action Required**:

- Read migration guide: https://chakra-ui.com/docs/migrations/migrate-to-v3
- Create upgrade story with component-by-component testing
- Update all imports and component usage

---

### 3. Prisma 5 → 6 (Breaking Changes)

**Current**: 5.22.0
**Latest**: 6.16.3
**Impact**: Database layer, all queries
**Effort**: Medium (2-4 hours)
**Breaking Changes**:

- Query API changes
- Migration syntax changes
- Type generation differences

**Action Required**:

- Read changelog: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-6
- Test all database queries
- Verify migrations still work

---

### 4. Zod 3 → 4 (Breaking Changes)

**Current**: 3.25.76
**Latest**: 4.1.11
**Impact**: Validation schemas, form handling
**Effort**: Low-Medium (1-2 hours)
**Breaking Changes**:

- Schema definition syntax
- Error message format
- Type inference changes

**Action Required**:

- Update all validation schemas
- Test form validation flows
- Update error handling

---

### 5. ESLint 8 → 9 (Flat Config)

**Current**: 8.57.1
**Latest**: 9.37.0
**Impact**: Linting configuration
**Effort**: Low (1-2 hours)
**Breaking Changes**:

- New flat config format (no .eslintrc.json)
- Plugin loading changes
- Next.js eslint-config-next compatibility

**Action Required**:

- Migrate to flat config OR wait for Next.js default config update
- Test all linting rules still work

---

### 6. Testing Library 14 → 16 (Breaking Changes)

**Current**: 14.3.1
**Latest**: 16.3.0
**Impact**: All component tests
**Effort**: Medium (2-3 hours)
**Breaking Changes**:

- Query API changes
- Async utilities changes
- React 19 support

**Action Required**:

- Update test patterns
- Verify all 68 tests still pass
- May require React 19 upgrade first

---

## Upgrade Strategy

### Phase 1: Safe Minor/Patch Updates (DONE)

- ✅ Next.js 14.0.0 → 14.2.20
- ✅ react-hook-form 7.63.0 → 7.64.0
- ✅ framer-motion 10.18.0 → latest compatible

### Phase 2: Next.js 15 + React 19 (Coordinate)

**Order**: Next.js 15 → React 19 → Testing Library 16
**Rationale**: Next.js 15 will officially support React 19

### Phase 3: UI Framework (Requires Next.js 15)

**Order**: Chakra UI 3 (after React 19 stable)

### Phase 4: Backend/Validation (Independent)

**Order**: Prisma 6 → Zod 4 (can be done anytime)

### Phase 5: Tooling (Last)

**Order**: ESLint 9 (after Next.js provides flat config migration)

---

## Prevention Going Forward

**RULE**: All new stories start with:

```bash
pnpm outdated
# Review, update to latest stable in package.json before pnpm install
```

**RULE**: Never implement a story >1 month old without checking dependency versions.

**RULE**: Prefer `^` for patch updates, explicit version for breaking changes.

---

## Next Action

Create Story: "Upgrade Next.js 15 + React 19 + Chakra UI 3"
**When**: After Next.js 15 stable release
**Estimate**: 8-12 hours (full regression testing required)
