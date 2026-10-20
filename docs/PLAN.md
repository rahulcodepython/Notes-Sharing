# Notes Sharing App — Plan

Students sign in with Google, create or join communities, and share notes. Note files are stored in each uploader's own Google Drive.

## Principles

- Keep it simple. Weigh the cost of every bit of complexity against its impact. Don't over-engineer.
- Never use `any` or `unknown`. Parse every request and response with zod.
- Use generic, reusable components and one standard way of doing each thing.
- Keep network calls to a minimum. Each API request runs one SQL statement: a CTE that returns `json_build_object`.
- Use Next.js route handlers only. No server actions.

## Decisions

| Topic | Decision |
|---|---|
| Package manager | bun |
| Framework | Next.js (latest, App Router), TypeScript strict |
| Database | Postgres 17 via Docker for dev; later Neon or Supabase by changing `DATABASE_URL` |
| ORM | Drizzle for schema, migrations and the better-auth adapter only. App queries are raw SQL through Drizzle's `sql` tag. |
| Auth | better-auth with the Google social provider, scope `drive.file`, `accessType: "offline"`, `prompt: "select_account consent"`. Credentials added later. |
| File storage | Each uploader's own Drive, in an app folder, shared as "anyone with the link can view". Manually deleted Drive files are not handled. |
| Upload | Resumable upload straight from the browser to Drive. The API only creates the session and saves the result. |
| Community access | `open` (public, click to join), `request` (public, owner approves or rejects), `private` (invite only). Set at creation and changeable later. The owner can add members directly in every mode. |
| Adding members | The owner searches users by Gmail with a debounced search. If the user exists, they are added directly. No email, no notification. |
| Categories | A separate list per community. Any member can create one. |
| Deleting notes | The uploader or the community owner |
| Ownership | One owner per community at a time. Ownership can be transferred. |
| Downloads | Tracked. The notes list shows download counts and the community list shows member counts. |
| Forms and data | react-hook-form, TanStack Query, zod |
| UI | shadcn: `sidebar-07` (its team switcher becomes the community switcher), `breadcrumb`, `chart`, `field` (used with react-hook-form `Controller`; this shadcn style has no `form`), `command`, `dialog`, `table`, `sonner` |

## One-query pattern

Every endpoint is a single SQL statement. In one round trip it checks access, validates input, writes, and returns the structured result. Example for "owner adds a member":

```sql
WITH auth AS (
  SELECT id FROM community WHERE id = $cid AND owner_id = $me
), target AS (
  SELECT id FROM "user" WHERE email = $email
), ins AS (
  INSERT INTO community_member (community_id, user_id)
  SELECT a.id, t.id FROM auth a, target t
  ON CONFLICT DO NOTHING
  RETURNING user_id
)
SELECT json_build_object(
  'authorized', EXISTS (SELECT 1 FROM auth),
  'userFound',  EXISTS (SELECT 1 FROM target),
  'member',     (SELECT json_build_object('id', u.id, 'name', u.name, 'email', u.email, 'image', u.image)
                 FROM ins JOIN "user" u ON u.id = ins.user_id)
) AS result;
```

The route handler parses `result` with zod and maps the flags to 403, 404 or 200.

## Database schema

- **better-auth tables:** `user` (plus `drive_folder_id`), `session`, `account`, `verification`.
- **`community`:** `id`, `name`, `slug` (unique), `description`, `access` (`'open' | 'request' | 'private'`), `owner_id`, `created_at`.
- **`community_member`:** primary key `(community_id, user_id)`, `joined_at`. The owner also has a row here.
- **`join_request`:** primary key `(community_id, user_id)`, `created_at`. Approving inserts a member row and deletes the request; rejecting deletes the request.
- **`invitation`:** one row per community. `community_id` (primary key), `token` (unique), `created_by`, `expires_at`, `created_at`.
- **`category`:** `id`, `community_id`, `name`, `created_by`, unique `(community_id, name)`.
- **`note`:** `id`, `community_id`, `category_id`, `uploader_id`, `title`, `drive_file_id`, `drive_url`, `mime_type`, `size`, `created_at`.
- **`note_download`:** `id`, `note_id`, `user_id`, `created_at`.

## Upload flow (3 calls)

1. `POST /api/notes/upload-session`: the server gets the user's access token from better-auth, creates the Drive app folder if `drive_folder_id` is null, and starts a resumable session with an `Origin` header. It returns `uploadUrl`.
2. The browser sends a `PUT` with the file to `uploadUrl`, shows a progress bar, and gets back the `fileId`.
3. `POST /api/communities/[slug]/notes` with `{ fileId, title, categoryId }`: the server sets the Drive permission to "anyone with the link can read", then runs one CTE that checks membership and the category and inserts the note. It returns the note and the client shows a toast.

## Download flow (1 call)

`POST /api/notes/[id]/download` runs one CTE that checks membership, inserts a `note_download` row and returns `drive_url`. The client then opens that URL.

## API routes

```
/api/auth/[...all]
/api/dashboard                              GET   all stats in one CTE
/api/users/search?q=&community=             GET   debounced, owner only, excludes members
/api/communities                            GET   mine (with member + note counts) | POST create
/api/communities/explore?q=                 GET   public ones I'm not in
/api/communities/[slug]                     GET | PATCH (owner)
/api/communities/[slug]/join                POST  open → member, request → join_request
/api/communities/[slug]/leave               POST
/api/communities/[slug]/transfer            POST  owner → another member
/api/communities/[slug]/settings            GET   owner: details + members + requests + invite in one query
/api/communities/[slug]/members             POST  owner adds by email
/api/communities/[slug]/members/[userId]    DELETE (owner)
/api/communities/[slug]/requests/[userId]   POST {action: approve|reject}
/api/communities/[slug]/invite              POST new link (replaces old) | DELETE revoke
/api/invites/[token]                        GET preview | POST accept
/api/communities/[slug]/categories          GET | POST
/api/communities/[slug]/notes               GET (with download count) | POST
/api/notes/[id]                             DELETE (uploader or owner)
/api/notes/[id]/download                    POST
/api/notes/upload-session                   POST
```

## Pages

- `/login`
- `/invite/[token]`
- `/dashboard`: charts and stats
- `/explore`: public communities I'm not in
- `/c/[slug]`: notes list, upload, download
- `/c/[slug]/settings`: owner only. Details, access mode, members, join requests, invite link, transfer ownership.

Every page inside the app shell has a breadcrumb.

## Folder structure

```
.
├── docker-compose.yml
├── drizzle.config.ts
├── .env.example
├── components.json
├── package.json
├── tsconfig.json
├── docs/
│   └── PLAN.md
└── src/
    ├── app/
    │   ├── layout.tsx                      providers (QueryClient, Toaster, theme)
    │   ├── page.tsx                        redirect → /dashboard or /login
    │   ├── login/page.tsx
    │   ├── invite/[token]/page.tsx
    │   ├── (app)/                          protected, sidebar-07 shell
    │   │   ├── layout.tsx                  session guard + SidebarProvider + breadcrumb
    │   │   ├── dashboard/page.tsx
    │   │   ├── explore/page.tsx
    │   │   └── c/[slug]/
    │   │       ├── page.tsx                notes list + upload
    │   │       └── settings/page.tsx       owner: details, members, requests, invites, transfer
    │   └── api/                            route handlers (see API routes)
    ├── components/
    │   ├── ui/                             shadcn generated, untouched
    │   ├── layout/                         app-sidebar, community-switcher, nav-user, page-breadcrumb
    │   ├── form/                           generic FormInput, FormSelect, FormTextarea, FormDialog
    │   ├── common/                         DataTable, EmptyState, StatCard, UserSearch (debounced)
    │   ├── community/                      CommunityForm, CommunityCard, MemberList, RequestList
    │   ├── note/                           NoteTable, UploadNoteDialog, CategorySelect
    │   └── dashboard/                      chart components
    ├── db/
    │   ├── index.ts                        pg pool + drizzle instance
    │   ├── schema.ts                       all tables
    │   ├── migrations/
    │   └── queries/                        one file per resource, raw CTE SQL functions
    │       ├── community.ts
    │       ├── member.ts
    │       ├── note.ts
    │       ├── category.ts
    │       └── dashboard.ts
    ├── schemas/                            zod, shared by client + server
    │   ├── common.ts
    │   ├── community.ts
    │   ├── member.ts
    │   ├── note.ts
    │   ├── category.ts
    │   └── dashboard.ts
    ├── lib/
    │   ├── auth.ts                         better-auth server config
    │   ├── auth-client.ts
    │   ├── drive.ts                        folder, resumable session, permission
    │   ├── api/handler.ts                  route wrapper: session + zod in/out + error map
    │   ├── api/client.ts                   typed fetch with zod response parse
    │   ├── api/errors.ts
    │   ├── env.ts                          zod-validated env
    │   └── utils.ts
    └── hooks/
        ├── use-debounce.ts
        └── queries/                        TanStack hooks per resource
```

## Phases

Each phase stops for review before the next one starts.

1. Remove everything except `.git` and `docs/`. Scaffold Next.js with bun, Docker Postgres, the Drizzle schema and migration, the shadcn base and the env file.
2. better-auth Google login, and the protected layout with sidebar-07, the community switcher and the breadcrumb.
3. Communities: create, switch, explore, join or request, leave.
4. Owner settings: edit, add members with debounced search, remove, handle requests, invite link, transfer ownership.
5. Categories and notes: Drive upload, list with download counts, download, delete.
6. Dashboard charts.

## Resolved decisions

- The community switcher navigates to `/c/[slug]`. The URL is the only "selected community" state.
- The dashboard shows stats across all of my communities.
- "Members" in the community list is the total member count.
- Every download click is counted.
- Private communities are hidden from Explore.
- Members can leave. The owner must transfer ownership first.
- Non-members visiting `/c/[slug]` of a public community see a preview with Join or Request. Private communities return "not found".
- Slugs are generated from the name (`physics-101`, then `physics-101-2`, …) and never change. API routes use the slug as the community identifier.
- Invite link: one per community, usable by anyone, expires after 7 days. Regenerating replaces it; the owner can revoke it.
- Removing a member keeps their notes in the community.
- The owner can rename the community and change its description and access. The slug never changes. Switching to `open` drops pending join requests.
- Settings is one page of stacked cards: details, members, join requests, invite link. Ownership transfer is a member action.

## Open questions

1. **Dashboard charts:** notes uploaded over time (30 days), downloads over time, notes per category, top uploaders, and stat cards (communities, members, notes, downloads). Is this list OK?
