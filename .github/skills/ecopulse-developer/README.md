# EcoPulse Developer Skill

GitHub Copilot Skill for EcoPulse - Context-rich assistance for development workflows.

## Overview

This skill provides Copilot with deep contextual knowledge of:

- **Next.js 16** async patterns and Server Actions
- **Supabase** SSR clients and RLS policies
- **Africa-first UI** with icon+text and icon-only modes
- **Domain rules** for reports, verifications, and workflows
- **i18n** with next-intl (English MVP, future African languages)
- **Testing** with Vitest and Playwright

## Structure

```
ecopulse-developer/
├── SKILL.md                  # Main skill file (read this first)
├── supabase-patterns.md      # Supabase SSR client usage
├── server-actions.md         # Server Actions best practices
├── africa-design.md          # Africa-first UI system
├── domain-rules.md           # Business logic and workflows
├── i18n-guide.md             # Internationalization patterns
├── testing-guide.md          # Vitest and Playwright testing
├── scripts/
│   ├── validate.sh           # Full validation (pre-PR)
│   ├── quick-check.sh        # Fast checks (pre-commit)
│   └── pre-commit.sh         # Git hook validation
└── README.md                 # This file
```

## Usage

### In VS Code Insiders

This skill is automatically activated when you:

1. Open the EcoPulse workspace
2. Use Copilot Chat (`Cmd+I` or `Ctrl+I`)
3. Ask questions about the project

**Example prompts:**

- "How do I create a new Server Action for updating report status?"
- "Show me the correct pattern for using Supabase client in a server component"
- "What's the proper way to add a new icon-only button with accessibility?"
- "How do I add a new translation key for Hausa locale?"

### Skill Activation

Copilot will automatically reference this skill when:

- Working in `app/actions/` (Server Actions)
- Using Supabase clients
- Creating UI components
- Writing tests
- Implementing i18n

You can explicitly invoke it:

- `@ecopulse-developer How do I...`
- `Using EcoPulse patterns, create...`

### Progressive Disclosure

The skill uses **progressive disclosure** - start with [SKILL.md](SKILL.md), then dive into:

- **Quick refs:** [africa-design.md](africa-design.md), [domain-rules.md](domain-rules.md)
- **Deep dives:** [supabase-patterns.md](supabase-patterns.md), [testing-guide.md](testing-guide.md)

## Validation Scripts

### Full Validation (`validate.sh`)

Run before opening PRs:

```bash
./.github/skills/ecopulse-developer/scripts/validate.sh
```

**Checks:**

- ✅ Next.js 16 async patterns (`await cookies()`, `await params`)
- ✅ Server Actions conventions (`'use server'`, return shape)
- ✅ Supabase client usage (no service role in client code)
- ✅ i18n patterns (no hardcoded strings, using `@/i18n/routing`)
- ✅ Accessibility (aria-labels, 44px touch targets)
- ✅ TypeScript strict mode
- ✅ ESLint rules
- ✅ Environment variables

**Exit codes:**

- `0` - Passed (no errors)
- `1` - Failed (fix errors before committing)

### Quick Check (`quick-check.sh`)

Fast pre-commit validation:

```bash
./.github/skills/ecopulse-developer/scripts/quick-check.sh
```

**Runs:**

- Type check (`pnpm type-check`)
- Lint (`pnpm lint`)
- Format check (`pnpm format:check`)

### Pre-commit Hook (`pre-commit.sh`)

Install as Git hook:

```bash
# Create .git/hooks/pre-commit
ln -s ../../.github/skills/ecopulse-developer/scripts/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Runs on `git commit`:**

- Lint-staged
- Type check
- Unit tests
- Format check

## Complementary Skills

**This skill works with:**

**[ecopulse-ux](../ecopulse-ux/)** - UI/UX Design Patterns

- User personas and pain points (8 real personas with validated use cases)
- African community design principles (low-literacy, offline-first, SMS)
- Accessibility standards (WCAG 2.1 AA compliance patterns)
- Icon-driven UI, voice notes, event timelines
- Responsive navigation (navbar + hamburger menu)
- Performance optimization (map pin limits, smart prioritization)

**Use ecopulse-ux skill when:**

- Building user-facing components
- Implementing screen layouts
- Designing interaction flows
- Ensuring accessibility compliance
- Supporting low-literacy users
- Optimizing for African networks (2G/3G)

**Use ecopulse-developer skill when:**

- Writing Server Actions and API logic
- Integrating Supabase (auth, database, storage)
- Implementing business rules and validations
- Setting up testing infrastructure
- Configuring i18n and translations

## Relationship to BMAD Agents

This skill **complements** the existing BMAD agent system:

| System             | Purpose                                        | Activation                |
| ------------------ | ---------------------------------------------- | ------------------------- |
| **BMAD Agents**    | Orchestrate SDLC workflows (PM, Dev, Arch, UX) | `@_bmad/...` commands     |
| **Copilot Skills** | Provide inline, contextual coding assistance   | Automatic in Copilot Chat |

**Use together:**

- **BMAD** for planning, sprint management, architecture decisions
- **Copilot Skills** for implementing features, debugging, code reviews
- **ecopulse-developer** for backend/infrastructure patterns
- **ecopulse-ux** for frontend/interaction patterns

**No conflicts:**

- BMAD agents use `@_bmad/` namespace
- Copilot Skills use GitHub Copilot's native mechanisms
- All reference the same source of truth (codebase, PRD, Sprint Backlog, Architecture, UX specs)

## Maintenance

### Updating the Skill

1. Edit reference files as codebase evolves
2. Keep `SKILL.md` in sync with core patterns
3. Update validation scripts for new rules
4. Test skill with sample prompts

### Adding New Guides

Create new `.md` files for:

- **Specific features** (e.g., `organization-onboarding.md` for Epic 2.3)
- **Advanced patterns** (e.g., `real-time-sync.md` for future features)
- **Troubleshooting** (e.g., `common-errors.md`)

Reference from `SKILL.md` with progressive disclosure.

## Links

- **Main Skill:** [SKILL.md](SKILL.md)
- **Project Context:** [../../copilot-instructions.md](../../copilot-instructions.md)
- **PRD:** [/\_bmad-output/project-planning-artifacts/prd.md](/_bmad-output/project-planning-artifacts/prd.md)
- **Sprint Backlog:** [/\_bmad-output/implementation-artifacts/sprint-backlog.md](/_bmad-output/implementation-artifacts/sprint-backlog.md)

## Feedback & Contributions

This skill is a **living document**. As patterns evolve:

1. Update the relevant `.md` files
2. Run validation scripts to ensure consistency
3. Test with Copilot to verify improved assistance

**Questions?** Reference the BMAD Dev Agent (`@_bmad/bmm/agents/dev.md`) or project maintainers.

---

**Last Updated:** 2024-12-22  
**Skill Version:** 1.0.0  
**Copilot Compatibility:** VS Code Insiders (GitHub Copilot Skills preview)
