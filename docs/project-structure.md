# Project Structure — Next.js Frontend-Only (Standard)

> **สโคป:** Frontend-only — backend API (REST/GraphQL) แยก server อยู่แล้ว ฝั่งนี้ไม่มี database, ไม่มี ORM ทุก query/mutation ยิงไปหา backend ผ่าน HTTP client กลางจุดเดียว
>
> **Next.js 16.x:** `middleware.ts` เปลี่ยนชื่อเป็น `proxy.ts` และเนื่องจากโปรเจกต์ใช้โฟลเดอร์ `src/` ไฟล์นี้**ต้องอยู่ที่ `src/proxy.ts`** ไม่ใช่ root — วางผิดที่ Next.js จะไม่ detect เลย
>
> **หลักการออกแบบ:** colocation-first — logic ของแต่ละ feature อยู่ในโฟลเดอร์ route ของตัวเองใน `app/` เลย ไม่แยกออกไปเป็น `modules/` (indirection ที่ยังไม่จำเป็นสำหรับสเกลนี้) ถ้าอนาคต feature ไหนถูกใช้ข้ามหลาย route ค่อย "graduate" มันออกมาเป็น `features/<name>/` ทีหลังเป็นรายตัว

## Folder Tree

```
my-planora/
├── src/
│   ├── proxy.ts                          # ⚠️ ต้องอยู่ใน src/ (เดิมชื่อ middleware.ts)
│   │                                     # หน้าที่: optimistic redirect เท่านั้น (มี cookie → ผ่าน, ไม่มี → /login)
│   │                                     # + จุด refresh token (เพราะเขียน cookie ได้ที่นี่)
│   │
│   ├── app/
│   │   ├── layout.tsx                    # root layout: <html>/<body> + global providers เท่านั้น
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── error.tsx                     # global error boundary
│   │   │
│   │   ├── (marketing)/                  # ── public pages ──
│   │   │   ├── layout.tsx                # public header/footer/nav
│   │   │   ├── page.tsx                  # Home → "/"
│   │   │   ├── loading.tsx
│   │   │   └── _components/              # UI เฉพาะหน้า home เท่านั้น
│   │   │       ├── hero-section.tsx
│   │   │       ├── features-section.tsx
│   │   │       └── cta-section.tsx
│   │   │
│   │   ├── (auth)/                       # ── auth pages ──
│   │   │   ├── layout.tsx                # centered layout ไม่มี nav หลัก
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── _components/              # login-form, signup-form, social-buttons, auth-error
│   │   │
│   │   ├── (app)/                        # ── protected area หลัง login ──
│   │   │   ├── layout.tsx                # app shell (sidebar/topbar) — เช็ค session เพื่อ UX เท่านั้น
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx              # → "/dashboard"
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/
│   │   │   │
│   │   │   ├── projects/                 # ── feature: Projects (ทุกอย่างอยู่ที่นี่) ──
│   │   │   │   ├── page.tsx              # list → "/projects"
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── [projectId]/
│   │   │   │   │   ├── page.tsx          # detail → "/projects/:id"
│   │   │   │   │   └── loading.tsx
│   │   │   │   ├── _components/          # project-card, project-form, project-list...
│   │   │   │   ├── actions.ts            # 'use server' — POST/PATCH/DELETE ผ่าน lib/api/client
│   │   │   │   ├── queries.ts            # import 'server-only' — GET ผ่าน lib/api/client
│   │   │   │   ├── schema.ts             # zod validation ก่อนส่ง backend
│   │   │   │   └── types.ts              # types ที่ map กับ backend contract
│   │   │   │
│   │   │   ├── tasks/                    # โครงเดียวกันทุก feature
│   │   │   │   ├── page.tsx
│   │   │   │   ├── _components/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── queries.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── calendar/
│   │   │   │   └── ...
│   │   │   ├── team/
│   │   │   │   └── ...
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       └── ...
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── callback/route.ts     # OAuth callback: รับ token จาก backend → set httpOnly cookie
│   │
│   ├── components/                       # ⭐ เฉพาะของที่ใช้ร่วมกัน "ข้าม route group" เท่านั้น
│   │   ├── ui/                           # design-system primitives (button, input, card, dialog...)
│   │   └── layout/                       # header, footer, sidebar, topbar
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts                 # fetch wrapper กลางจุดเดียว: base URL, แนบ token,
│   │   │                                 # แปลง error เป็นรูปแบบเดียว, throw ApiError เมื่อ 401
│   │   ├── auth/
│   │   │   ├── api.ts                    # login(), signup(), logout(), getMe(), refreshToken()
│   │   │   ├── session.ts                # อ่าน/เขียน/ลบ httpOnly cookie ที่เก็บ token
│   │   │   ├── dal.ts                    # verifySession() ห่อด้วย React cache() — ด่าน auth จริง
│   │   │   └── definitions.ts            # zod schema + FormState types ของฟอร์ม auth
│   │   └── utils.ts                      # cn(), formatters, helpers
│   │
│   ├── hooks/                            # use-toast, use-media-query, use-debounce ฯลฯ
│   ├── types/                            # shared types ที่ไม่ผูก feature (ApiError, Pagination...)
│   └── config/
│       ├── site.ts                       # metadata
│       ├── nav.ts                        # sidebar menu ของ (app)
│       └── env.ts                        # validate env vars (zod)
│
├── public/
├── next.config.ts
├── tsconfig.json
└── package.json
```

## หลักการสำคัญ

### 1. Colocation — feature อยู่กับ route ของมัน

ทุกอย่างของ feature หนึ่ง (`page`, `_components`, `actions`, `queries`, `schema`, `types`) อยู่ในโฟลเดอร์เดียวใน `app/(app)/<feature>/` เปิดโฟลเดอร์เดียวเห็นครบ ไม่ต้องกระโดดไปมาระหว่างสองที่ และไม่เกิดคำถามว่า "component นี้ควรอยู่ไหน"

**กติกาเส้นแบ่งเดียวที่ต้องจำ:** ของอยู่ใน `components/` ส่วนกลางก็ต่อเมื่อถูกใช้**ข้าม route group / ข้าม feature** เท่านั้น นอกนั้นอยู่ `_components/` ของ route ตัวเอง

**ทางหนีไฟ:** ถ้าวันหนึ่ง feature ถูกใช้จากหลาย route (เช่น tasks โผล่ทั้งใน `/tasks`, `/projects/[id]`, `/calendar`) ค่อยย้าย logic ของมันออกไป `src/features/<name>/` เป็นรายตัว — ย้ายทีหลังถูกกว่าตั้งโครง 2 ชั้นตั้งแต่วันแรก

### 2. Auth มี 2 ชั้น — อย่าสับสนหน้าที่

| ชั้น             | ที่อยู่           | หน้าที่                                                                      | เป็น security มั้ย |
| ---------------- | ----------------- | ---------------------------------------------------------------------------- | ------------------ |
| Optimistic check | `src/proxy.ts`    | มี cookie → ผ่าน, ไม่มี → redirect `/login` (ห้ามเรียก backend ที่นี่ — ช้า) | ❌ UX เท่านั้น     |
| ด่านจริง (DAL)   | `lib/auth/dal.ts` | `verifySession()` อ่าน cookie → เรียก `getMe()` ยืนยันกับ backend            | ✅                 |

- **ทุก `queries.ts` / `actions.ts` ต้องเรียก `verifySession()` เอง** ก่อนยิง backend — อย่าพึ่งการเช็คใน `layout.tsx` เพราะ layout ไม่ re-render ทุก navigation
- ห่อ `verifySession()` ด้วย `cache()` ของ React เพื่อไม่ให้ยิง `getMe()` ซ้ำหลายรอบใน request เดียว
- เช็คใน `(app)/layout.tsx` ด้วยก็ได้ แต่ถือเป็น UX layer เสริม ไม่ใช่ด่านหลัก

### 3. Token: เก็บและ refresh ให้ถูกที่

- Token เก็บใน **httpOnly cookie** เท่านั้น (JS ฝั่ง client อ่านไม่ได้ → กัน XSS) — ห้ามเก็บ localStorage
- **Server Component เขียน cookie ไม่ได้** → refresh token ทำได้เฉพาะใน `proxy.ts`, Server Action, หรือ Route Handler
- แนวทาง: refresh logic อยู่ใน `proxy.ts` (เช็ค token ใกล้หมดอายุ → refresh → set cookie ใหม่) ส่วน `lib/api/client.ts` ถ้าเจอ 401 ให้ throw แล้ว redirect ไป `/login` — ไม่พยายาม refresh กลางการ render

### 4. `lib/api/client.ts` = จุดเดียวที่คุยกับ backend

รวม base URL, การแนบ token, การแปลง error response ให้เป็น `ApiError` รูปแบบเดียวทั้งแอป ทุก `queries.ts` / `actions.ts` / `lib/auth/api.ts` เรียกผ่านจุดนี้ — **ห้ามยิง `fetch()` ตรงจากที่อื่น**

### 5. กัน server code หลุดไป client

- ไฟล์ `queries.ts`, `lib/auth/dal.ts`, `lib/auth/session.ts` ใส่ `import 'server-only'` บรรทัดแรกเสมอ — ใครเผลอ import เข้า client component จะ build fail ทันที แทนที่จะ token หลุดไป bundle เงียบๆ
- `actions.ts` ขึ้นต้นด้วย `'use server'`

## Data Flow สรุป

```
Server Component (page.tsx)
   └─ queries.ts ── verifySession() ── lib/api/client ──► Backend API

Client Component (form ใน _components/)
   └─ actions.ts ('use server') ── verifySession() + zod schema ── lib/api/client ──► Backend API

Browser navigation
   └─ src/proxy.ts ── มี cookie? ──► ผ่าน / redirect /login (+ refresh token ถ้าใกล้หมดอายุ)
```

## เพิ่ม feature ใหม่ = 1 โฟลเดอร์

สร้าง `app/(app)/<feature>/` แล้วใส่ `page.tsx` + `_components/` + `actions.ts` + `queries.ts` + `schema.ts` + `types.ts` + เพิ่ม menu ใน `config/nav.ts` — จบ ไม่กระทบของเดิม

## หมายเหตุเรื่อง CORS (ถ้าเจอปัญหา)

ถ้า backend อยู่คนละ origin และไม่เปิด CORS ให้ browser เรียกตรงจาก client component ได้ ให้เพิ่ม Route Handler ที่ `app/api/[...path]/route.ts` เป็นชั้น proxy บางๆ (BFF pattern): client เรียก `/api/...` (same-origin) → route handler อ่าน token จาก cookie แนบให้ แล้ว forward ไป backend จริง — กันทั้ง CORS และกัน token หลุดไปอยู่ใน JS ฝั่ง client
