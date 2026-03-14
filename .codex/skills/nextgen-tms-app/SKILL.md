---
name: nextgen-tms-app
description: Use when working on the NextGen Transportation Management System codebase for app features, architecture, Supabase integration, route handlers, migrations, auth, or MVP workflow changes.
---

# NextGen TMS App

Use this skill for code changes in this repository.

## What this skill covers
- Next.js App Router pages and layouts
- Supabase repositories, auth, and route handlers
- SQL migrations and schema updates
- MVP logistics workflows: shipments, carriers, drivers, vehicles, routes, rates, tracking

## Workflow
1. Read `AGENTS.md` first.
2. Inspect the current implementation before proposing structure changes.
3. Prefer extending existing modules over introducing parallel patterns.
4. For data changes:
   - update `supabase/migrations/`
   - update `database/schema.sql`
   - keep types and repositories aligned
5. For auth changes:
   - confirm login/signup/logout path
   - confirm protected dashboard behavior
   - confirm API/security impact
6. Run a TypeScript verification pass before finishing.

## Non-negotiables
- Do not leave placeholder UI where the user expects a working flow.
- Do not add dead navigation or non-functional forms.
- Do not query Supabase ad hoc from unrelated components when a repository module is the right place.
- Do not change schema in only one file.

## Read as needed
- For project conventions and architecture: `references/project-standards.md`
- For UI and design expectations: `references/design-standards.md`
