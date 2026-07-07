# Project Structure — Next.js Frontend-Only (Standard)

> **สโคป:** Frontend-only — backend API (REST/GraphQL) แยก server อยู่แล้ว ฝั่งนี้ไม่มี database, ไม่มี ORM ทุก query/mutation ยิงไปหา backend ผ่าน HTTP client กลางจุดเดียว
>
> **Auth:** Credentials-based (email + password) คุยกับ backend เอง — **ไม่มี OAuth / social login** จึงไม่มี callback route และไม่มี `app/api/` เลยในเฟสนี้
>
> **Next.js 16.x:** `middleware.ts` เปลี่ยนชื่อเป็น `proxy.ts` และเนื่องจากโปรเจกต์ใช้โฟลเดอร์ `src/` ไฟล์นี้**ต้องอยู่ที่ `src/proxy.ts`** ไม่ใช่ root — วางผิดที่ Next.js จะไม่ detect เลย
>
> **หลักการออกแบบ:** colocation-first — logic ของแต่ละ feature อยู่ในโฟลเดอร์ route ของตัวเองใน `app/` เลย ไม่แยกออกไปเป็น `modules/` ถ้าอนาคต feature ไหนถูกใช้ข้ามหลาย route ค่อย "graduate" มันออกมาเป็น `features/<name>/` ทีหลังเป็นรายตัว

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
│   │   ├── (auth)/                       # ── auth pages (email + password) ──
│   │   │   ├── layout.tsx                # centered layout ไม่มี nav หลัก
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── actions.ts            # 'use server' — loginAction: validate → api.login() → set cookie
│   │   │   │   └── _components/          # login-form.tsx
│   │   │   ├── signup/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── actions.ts            # signupAction
│   │   │   │   └── _components/          # signup-form.tsx
│   │   │   ├── forgot-password/
│   │   │   │   ├── page.tsx
│   │   │   │   └── actions.ts            # requestResetAction (backend เป็นคนส่งอีเมล)
│   │   │   ├── reset-password/
│   │   │   │   ├── page.tsx              # อ่าน reset token จาก query param
│   │   │   │   └── actions.ts            # resetPasswordAction
│   │   │   └── verify-email/
│   │   │       └── page.tsx              # อ่าน verify token จาก query param → ยิง backend confirm
│   │   │
│   │   └── (app)/                        # ── protected area หลัง login ──
│   │       ├── layout.tsx                # app shell (sidebar/topbar) — เช็ค session เพื่อ UX เท่านั้น
│   │       │
│   │       ├── dashboard/
│   │       │   ├── page.tsx              # → "/dashboard"
│   │       │   ├── loading.tsx
│   │       │   └── _components/
│   │       │
│   │       ├── projects/                 # ── feature: Projects (ทุกอย่างอยู่ที่นี่) ──
│   │       │   ├── page.tsx              # list → "/projects"
│   │       │   ├── loading.tsx
│   │       │   ├── error.tsx
│   │       │   ├── [projectId]/
│   │       │   │   ├── page.tsx          # detail → "/projects/:id"
│   │       │   │   └── loading.tsx
│   │       │   ├── _components/          # project-card, project-form, project-list...
│   │       │   ├── actions.ts            # 'use server' — POST/PATCH/DELETE ผ่าน lib/api/client
│   │       │   ├── queries.ts            # import 'server-only' — GET ผ่าน lib/api/client
│   │       │   ├── schema.ts             # zod validation ก่อนส่ง backend
│   │       │   └── types.ts              # types ที่ map กับ backend contract
│   │       │
│   │       ├── tasks/                    # โครงเดียวกันทุก feature
│   │       │   ├── page.tsx
│   │       │   ├── _components/
│   │       │   ├── actions.ts
│   │       │   ├── queries.ts
│   │       │   ├── schema.ts
│   │       │   └── types.ts
│   │       │
│   │       ├── calendar/
│   │       │   └── ...
│   │       ├── team/
│   │       │   └── ...
│   │       └── settings/
│   │           ├── page.tsx
│   │           ├── billing/page.tsx
│   │           └── ...
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
│   │   │   ├── api.ts                    # เรียก backend: login(), signup(), logout(), getMe(),
│   │   │   │                             # refreshToken(), requestReset(), resetPassword(), verifyEmail()
│   │   │   ├── actions.ts                # 'use server' — logoutAction (ปุ่ม logout อยู่ใน app shell
│   │   │   │                             # ซึ่งใช้ข้าม group เลยไม่ colocate ไว้ใน route ใด route หนึ่ง)
│   │   │   ├── session.ts                # อ่าน/เขียน/ลบ httpOnly cookie ที่เก็บ token
│   │   │   ├── dal.ts                    # verifySession() ห่อด้วย React cache() — ด่าน auth จริง
│   │   │   └── definitions.ts            # zod schema + FormState types ของฟอร์ม auth (แชร์กันทุกหน้า auth)
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

ทุกอย่างของ feature หนึ่ง (`page`, `_components`, `actions`, `queries`, `schema`, `types`) อยู่ในโฟลเดอร์เดียวใน `app/` เปิดโฟลเดอร์เดียวเห็นครบ หลักนี้ใช้กับหน้า auth ด้วย: login form + login action อยู่ใน `(auth)/login/` ของมันเอง

**กติกาเส้นแบ่งเดียวที่ต้องจำ:** ของอยู่ในโฟลเดอร์กลาง (`components/`, `lib/`) ก็ต่อเมื่อถูกใช้**ข้าม route / ข้าม feature** เท่านั้น — ตัวอย่างจริงในโครงนี้คือ `logoutAction` ที่อยู่ `lib/auth/actions.ts` เพราะปุ่ม logout อยู่ใน app shell ไม่ได้ผูกกับหน้าไหนหน้าเดียว

### 2. Auth Flow (credentials: email + password)

Backend เป็นเจ้าของความจริงทั้งหมด (hash password, ออก token, rate limit, ส่งอีเมล reset/verify) ฝั่ง Next.js ทำแค่ ฟอร์ม → validate → ยิง backend → เก็บ token ใน cookie

```
Login:
  login-form (client) ──► login/actions.ts ('use server')
     1. validate ด้วย zod (lib/auth/definitions.ts)
     2. lib/auth/api.ts → login(email, password) ยิง backend
     3. backend ตอบ token → lib/auth/session.ts set httpOnly cookie
     4. redirect('/dashboard')
     (ผิดพลาด → return FormState กลับไปแสดงในฟอร์ม ห้าม leak ว่าผิดที่ email หรือ password)

Signup:      signup/actions.ts → api.signup() → backend ส่งอีเมล verify → แสดงหน้า "เช็คอีเมล"
Verify:      ผู้ใช้คลิกลิงก์ในอีเมล → /verify-email?token=... → page ยิง api.verifyEmail(token)
Forgot:      forgot-password/actions.ts → api.requestReset() (ตอบเหมือนกันเสมอ ไม่บอกว่า email มีในระบบมั้ย)
Reset:       /reset-password?token=... → resetPasswordAction → api.resetPassword(token, newPassword)
Logout:      ปุ่มใน app shell → lib/auth/actions.ts → api.logout() + session ลบ cookie → redirect('/login')
```

ข้อบังคับ:

- Password **ไม่ถูกเก็บที่ฝั่ง Next.js เลย** — ผ่าน action ไป backend แล้วจบ ไม่ log ไม่เก็บ state
- Cookie เก็บ token เท่านั้น: `httpOnly` + `secure` + `sameSite: 'lax'`
- ลิงก์ในอีเมล (reset/verify) เป็น **หน้าเว็บปกติใน (auth)** ที่อ่าน token จาก query param แล้วให้ action/page ยิง backend — ไม่ต้องมี route handler เพราะปลายทางคือ browser ของผู้ใช้เปิดหน้าเว็บ ไม่ใช่ machine-to-machine

### 3. Auth มี 2 ชั้น — อย่าสับสนหน้าที่

| ชั้น             | ที่อยู่           | หน้าที่                                                                      | เป็น security มั้ย |
| ---------------- | ----------------- | ---------------------------------------------------------------------------- | ------------------ |
| Optimistic check | `src/proxy.ts`    | มี cookie → ผ่าน, ไม่มี → redirect `/login` (ห้ามเรียก backend ที่นี่ — ช้า) | ❌ UX เท่านั้น     |
| ด่านจริง (DAL)   | `lib/auth/dal.ts` | `verifySession()` อ่าน cookie → เรียก `getMe()` ยืนยันกับ backend            | ✅                 |

- **ทุก `queries.ts` / `actions.ts` ต้องเรียก `verifySession()` เอง** ก่อนยิง backend — อย่าพึ่งการเช็คใน `layout.tsx` เพราะ layout ไม่ re-render ทุก navigation
- ห่อ `verifySession()` ด้วย `cache()` ของ React เพื่อไม่ให้ยิง `getMe()` ซ้ำหลายรอบใน request เดียว
- ยกเว้น action ของหน้า auth เอง (login/signup/forgot/reset) — พวกนี้เป็น public โดยธรรมชาติ ไม่ต้องเรียก verifySession

### 4. Token: เก็บและ refresh ให้ถูกที่

- Token เก็บใน **httpOnly cookie** เท่านั้น (JS ฝั่ง client อ่านไม่ได้ → กัน XSS) — ห้ามเก็บ localStorage
- **Server Component เขียน cookie ไม่ได้** → refresh token ทำได้เฉพาะใน `proxy.ts` หรือ Server Action
- แนวทาง: refresh logic อยู่ใน `proxy.ts` (เช็ค token ใกล้หมดอายุ → refresh → set cookie ใหม่) ส่วน `lib/api/client.ts` ถ้าเจอ 401 ให้ throw แล้ว redirect ไป `/login` — ไม่พยายาม refresh กลางการ render

### 5. `lib/api/client.ts` = จุดเดียวที่คุยกับ backend

รวม base URL, การแนบ token, การแปลง error response ให้เป็น `ApiError` รูปแบบเดียวทั้งแอป ทุก `queries.ts` / `actions.ts` / `lib/auth/api.ts` เรียกผ่านจุดนี้ — **ห้ามยิง `fetch()` ตรงจากที่อื่น**

### 6. กัน server code หลุดไป client

- ไฟล์ `queries.ts`, `lib/auth/dal.ts`, `lib/auth/session.ts`, `lib/auth/api.ts` ใส่ `import 'server-only'` บรรทัดแรกเสมอ — ใครเผลอ import เข้า client component จะ build fail ทันที แทนที่จะ token หลุดไป bundle เงียบๆ
- `actions.ts` ทุกไฟล์ขึ้นต้นด้วย `'use server'`

### 7. ทำไมไม่มี `app/api/` เลย

Route Handler (`route.ts`) มีไว้สำหรับ traffic ที่**คนนอกยิงเข้ามา**เท่านั้น เมื่อตัด OAuth ออก โปรเจกต์นี้ไม่เหลือใครที่ต้องยิงหาเราจากข้างนอกเลย — การอ่านใช้ `queries.ts` การเขียนใช้ `actions.ts` ครบแล้ว

จะกลับมาสร้าง `app/api/` ก็ต่อเมื่อเจอเคสพวกนี้เท่านั้น:

- **Webhook** — เช่น payment gateway แจ้งผลจ่ายเงิน → `api/webhooks/<provider>/route.ts`
- **BFF proxy กัน CORS** — ดูหมายเหตุท้ายเอกสาร
- **ไฟล์ดาวน์โหลด / streaming** — response ดิบที่ `<a href>` ต้องชี้ถึงได้

**Anti-pattern ที่ห้ามทำ:** สร้าง `/api/projects` ให้ `page.tsx` ของตัวเอง fetch — เป็นการยิง HTTP อ้อมหนึ่งรอบทั้งที่เรียกฟังก์ชันใน `queries.ts` ตรงๆ ได้

## Data Flow สรุป

```
Server Component (page.tsx)
   └─ queries.ts ── verifySession() ── lib/api/client ──► Backend API

Client Component (form ใน _components/)
   └─ actions.ts ('use server') ── verifySession() + zod ── lib/api/client ──► Backend API

Login form
   └─ (auth)/login/actions.ts ── zod ── lib/auth/api.ts ──► Backend API
                                          └─ token → lib/auth/session.ts → httpOnly cookie

Browser navigation
   └─ src/proxy.ts ── มี cookie? ──► ผ่าน / redirect /login (+ refresh token ถ้าใกล้หมดอายุ)
```

## เพิ่ม feature ใหม่ = 1 โฟลเดอร์

สร้าง `app/(app)/<feature>/` แล้วใส่ `page.tsx` + `_components/` + `actions.ts` + `queries.ts` + `schema.ts` + `types.ts` + เพิ่ม menu ใน `config/nav.ts` — จบ ไม่กระทบของเดิม

## หมายเหตุเรื่อง CORS (ถ้าเจอปัญหา)

ถ้า backend อยู่คนละ origin และไม่เปิด CORS ให้ browser เรียกตรงจาก client component ได้ ให้เพิ่ม Route Handler ที่ `app/api/[...path]/route.ts` เป็นชั้น proxy บางๆ (BFF pattern): client เรียก `/api/...` (same-origin) → route handler อ่าน token จาก cookie แนบให้ แล้ว forward ไป backend จริง — กันทั้ง CORS และกัน token หลุดไปอยู่ใน JS ฝั่ง client
