# Create Component Command

Creates a new component following TDD and atomic design.

## Usage
`/create-component ButtonAtom`
`/create-component ProductCardMolecule`

## What it creates
1. Component file: `src/components/{level}/{Name}.tsx`
2. Test file: `src/components/{level}/{Name}.test.tsx`
3. Index file: `src/components/{level}/index.ts`

## Process
1. Create test file first (use test-agent)
2. Run test (should fail - RED)
3. Create component (use component-agent)
4. Run test (should pass - GREEN)
5. Refactor if needed
```

---

## 🚀 Your Updated Structure:
```
.claude/
├── CLAUDE.md                    ← Update with project details
├── agents/
│   ├── test-agent.md           ← Update for TDD
│   ├── component-agent.md      ← Update for atomic design
│   └── design-system-agent.md  ← Update for tenant theming
└── commands/
    ├── create-component.md     ← Update for your structure
    ├── create-tenant.md        ← Keep as-is (probably good)
    ├── add-test.md            ← Keep
    └── test-flow.md           ← Keep if useful