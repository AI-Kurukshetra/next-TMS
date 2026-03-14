# Project Standards

## App Structure
- `src/app`: routes, layouts, API handlers
- `src/components`: UI only
- `src/lib/repositories`: database access and domain queries
- `src/lib/validations`: request and form parsing
- `src/types`: domain typing

## Preferred Change Pattern
1. Add or update domain type
2. Add or update repository function
3. Add or update API handler or server action
4. Add or update page/component
5. Verify TypeScript

## Database Rules
- SQL is the source of truth for schema.
- Keep `supabase/migrations/` and `database/schema.sql` synchronized.
- Add indexes for new foreign keys and primary operational filters.
- Prefer explicit foreign keys and timestamps on core tables.

## Auth Rules
- Use Supabase Auth for identity.
- Keep `public.users` profile behavior aligned with auth flows.
- Dashboard pages must not be publicly accessible.

## MVP Delivery Rules
- End-to-end flow matters more than breadth.
- Finish core workflows before adding decorative modules.
- Empty states and error states are part of the feature, not optional extras.
