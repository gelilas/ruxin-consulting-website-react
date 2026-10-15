# Connect Ruxin Marketing Website ↔ CMS API

Guide for wiring **`ruxin-consulting-website-react`** to the public content API, with a **hard fallback to default site copy** when the API is down, empty, invalid, or unchanged from “no useful CMS data.”

**Implement next** — this file is the plan. Do not skip the fallback rules.

---

## 1. Goal

| Mode | What visitors see |
|------|-------------------|
| CMS API healthy + valid `SiteContent` | Live content from MySQL (`SiteDocument`) |
| API down / CORS fail / timeout / 404 / bad JSON | **Default** content from `lib/content.ts` |
| Partial / invalid payload | **Default** (do not half-apply) |
| First paint (before fetch finishes) | **Default** (no blank page) |

The marketing site must **always render**. API is optional enhancement, not a hard dependency.

---

## 2. Architecture

```
Browser (:5173 Vite marketing site)
  │
  │  1. Render immediately with defaultContent (lib/content.ts)
  │  2. GET {VITE_CMS_URL}/api/content   (public, no JWT)
  │
  ├─ success + valid shape → replace UI with API content
  └─ fail / invalid        → keep defaultContent
                │
                ▼
         CMS API (:4001)
                │
                ▼
         MySQL SiteDocument (id = "main")
```

| App | Port | Role |
|-----|------|------|
| Marketing site | `5173` | Public website |
| CMS API | `4001` | `GET /api/content` |
| CMS admin UI | `3030` | Editors (not required for public site) |

**Auth:** public read only. Do **not** send JWT from the marketing site.

---

## 3. Current state (already started)

| Piece | Status |
|--------|--------|
| Default copy in `lib/content.ts` | Exists |
| `SiteContentProvider` + `useSiteContent()` | Exists in `lib/site-content.tsx` |
| Fetch `${VITE_CMS_URL}/api/content` | Exists |
| Silent catch → keep fallback | Exists |
| Default `VITE_CMS_URL` | **Wrong** — still `http://localhost:4000` (API is **4001**) |
| `.env` / `.env.example` | Missing |
| Full shape validation before apply | Weak (only checks `company`, `hero`, `services`) |
| Merge/partial update safety | Not done — must reject incomplete payloads |

**Baseline files**

- `lib/content.ts` — default values  
- `lib/site-content.tsx` — provider + fetch  
- `src/main.tsx` — wraps `<App />` with provider  
- CMS: `GET /api/content` + `CORS_ORIGIN=http://localhost:5173`

---

## 4. Fallback policy (required)

Treat **default content** as the source of truth until a **complete, valid** API document arrives.

### Use API content only when all are true

1. HTTP `200`
2. Body is a JSON object
3. Every required top-level key exists and is the right type:

```text
company, navLinks, hero, about, services, clients,
testimonials, team, careers, insightCategories, insights, assistant
```

4. Minimal nested checks (same spirit as CMS Zod):
   - `company.name`, `company.email` are non-empty strings  
   - `hero.headline` is a non-empty array  
   - `services` is a non-empty array  

### Otherwise keep defaults

| Situation | Behavior |
|-----------|----------|
| `VITE_CMS_URL` unset | Use default URL (after fix: `http://localhost:4001`) still try fetch; on fail → defaults |
| Network error / aborted | Keep defaults |
| Non-200 | Keep defaults |
| Missing section keys | Keep defaults (**no deep merge** of partial CMS data) |
| Empty `{}` or `null` | Keep defaults |
| CMS never edited (but seed exists) | API returns seeded JSON → **use API** (seed ≈ site defaults) |
| Admin clears / breaks content | API may 400 on save; if old bad row somehow served and fails validation → defaults |

**Important:** Prefer **full replace or full reject**. Do **not** merge API fields onto defaults section-by-section unless a later ticket explicitly asks for it. Partial merge can hide broken CMS data and make debugging hard.

### UX

- First paint: defaults (instant).  
- After successful fetch: swap to API content (acceptable brief content flash).  
- Optional later: `isLoading` / `source: 'default' | 'cms'` for a small “live” indicator in dev only.

---

## 5. Environment setup

### 5.1 Create `ruxin-consulting-website-react/.env`

```env
# CMS API origin (no trailing slash)
VITE_CMS_URL=http://localhost:4001
```

### 5.2 Create `.env.example` (commit this)

```env
VITE_CMS_URL=http://localhost:4001
```

### 5.3 Align CMS API CORS

In `cms/ruxin-consulting-cms/.env`:

```env
CORS_ORIGIN=http://localhost:5173
```

Public `GET /api/content` must allow the marketing origin. JWT is not required for this route.

### 5.4 Fix code default

In `lib/site-content.tsx`, change:

```ts
// before
const cmsUrl = import.meta.env.VITE_CMS_URL ?? 'http://localhost:4000'

// after
const cmsUrl = import.meta.env.VITE_CMS_URL ?? 'http://localhost:4001'
```

---

## 6. Implementation steps (do in order)

### Step 1 — Env + default URL

1. Add `.env` and `.env.example` with `VITE_CMS_URL=http://localhost:4001`
2. Update fallback default in `lib/site-content.tsx` to `:4001`
3. Restart Vite after env changes (`npm run dev`)

### Step 2 — Harden `isSiteContent()` validator

Add a local guard in `lib/site-content.tsx` (or `lib/content-guard.ts`):

```ts
function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  const keys = [
    'company', 'navLinks', 'hero', 'about', 'services', 'clients',
    'testimonials', 'team', 'careers', 'insightCategories', 'insights', 'assistant',
  ] as const
  for (const key of keys) {
    if (!(key in v)) return false
  }
  // light nested checks…
  return true
}
```

Only call `setContent(data)` when `isSiteContent(data)` is true; else keep `fallback`.

### Step 3 — Fetch helper clarity

Keep one place for loading:

```ts
async function loadCmsContent(signal: AbortSignal): Promise<SiteContent | null> {
  const response = await fetch(`${cmsUrl}/api/content`, { signal })
  if (!response.ok) return null
  const data: unknown = await response.json()
  return isSiteContent(data) ? data : null
}
```

Provider:

```ts
const [content, setContent] = useState(fallback) // always start with defaults

useEffect(() => {
  const controller = new AbortController()
  loadCmsContent(controller.signal)
    .then((data) => {
      if (data) setContent(data)
      // else: stay on defaults
    })
    .catch(() => {
      // aborted or network — stay on defaults
    })
  return () => controller.abort()
}, [])
```

### Step 4 — Confirm UI still uses the provider

All public sections should use `useSiteContent()`, not direct imports from `lib/content.ts` for runtime strings (types/`ServiceId` imports are fine).

Quick audit: navbar, hero/story, services, clients, testimonials, team, careers, insights, contact, footer, assistant.

### Step 5 — Dev workflow smoke test

```bash
# Terminal 1 — API
cd cms/ruxin-consulting-cms
npm run dev:api

# Terminal 2 — Marketing site
cd ruxin-consulting-website-react
npm run dev
```

1. Open http://localhost:5173 — site shows (defaults first).  
2. Network: `GET http://localhost:4001/api/content` → 200.  
3. Content matches CMS/DB (seeded or edited).  
4. Stop API → refresh site → **still works** with defaults.  
5. In CMS admin (`:3030`), edit hero → Save → refresh marketing site → new hero text.  
6. Wrong `VITE_CMS_URL` → site still loads defaults (check console/network only).

### Step 6 — (Optional) Vite proxy instead of cross-origin

If you want same-origin fetches in dev:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:4001',
  },
},
```

Then set `VITE_CMS_URL=` empty and fetch `/api/content`.  
Default plan: **keep direct `VITE_CMS_URL`** (simpler; CORS already configured).

---

## 7. Contract with CMS API

| Item | Value |
|------|--------|
| Method | `GET` |
| Path | `/api/content` |
| Auth | None |
| Success | `200` + full `SiteContent` JSON |
| Missing doc | `404` `{ error }` → website keeps defaults |
| CORS | Allow `http://localhost:5173` |

Shape must match CMS `src/types.ts` / website `SiteContent` (same keys as seed `data/content.json`).

Admin edits flow:

```text
CMS UI Save → PUT /api/content (JWT) → MySQL
Marketing site → GET /api/content → sees updates after refresh
```

---

## 8. Acceptance tests

1. API up + valid content → marketing shows API/seeded copy.  
2. API stopped → marketing still renders defaults (no crash).  
3. API returns `{}` → defaults (validator rejects).  
4. API returns 500 → defaults.  
5. Edit hero in CMS → Save → refresh website → hero updated.  
6. No JWT on marketing requests (DevTools → Request Headers).  
7. `VITE_CMS_URL` points to `4001` (not `4000`).  
8. First paint never blank / never blocked on CMS.

---

## 9. Suggested coding checklist (next session)

- [x] Add `.env` + `.env.example` with `VITE_CMS_URL=http://localhost:4001`
- [x] Fix default URL `4000` → `4001` in `lib/site-content.tsx`
- [x] Add `isSiteContent()` full-key validation; reject partial payloads
- [x] Keep initial state = `fallback` always
- [ ] Smoke test: API on / API off / CMS edit → website update
- [x] Confirm `CORS_ORIGIN` on API includes `:5173`

**Out of scope for this pass**

- Contact form backend  
- Real AI assistant API  
- Pages (`/api/pages`) on the marketing site  
- Auth on the public site  

---

## 10. Quick file map

| File | Change |
|------|--------|
| `.env` / `.env.example` | `VITE_CMS_URL` |
| `lib/site-content.tsx` | Default URL, validator, load helper |
| `lib/content.ts` | Defaults only (source of fallback) |
| `cms/.../.env` | `CORS_ORIGIN=http://localhost:5173` |
| `cms/.../server/routes/content.ts` | Already public `GET /` |

---

*When ready to implement:* start with env + URL fix, then harden validation, then run the smoke tests in §5 / §8.
