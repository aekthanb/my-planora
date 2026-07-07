# my-planora

โปรเจกต์ Next.js + Tailwind CSS ที่ตั้งค่าแบบ production-grade (พร้อม TypeScript, ESLint, Prettier, Git hooks)

เอกสารนี้เขียนไว้ 2 แบบในไฟล์เดียว: **สรุปสั้น** (ไว้เปิดดูเร็วๆ) และ **อธิบายละเอียด** (ไว้ศึกษาว่าแต่ละอย่างคืออะไร ทำงานยังไง ทำไมต้องมี) — เลื่อนอ่านไปตามหัวข้อที่สนใจได้เลย

---

## สารบัญ

1. [Stack ที่ใช้ (คืออะไรบ้าง)](#stack-ที่ใช้-คืออะไรบ้าง)
2. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
3. [สรุปสิ่งที่ตั้งค่าไปแล้ว แบบละเอียด](#สรุปสิ่งที่ตั้งค่าไปแล้ว-แบบละเอียด)
4. [วิธีใช้งาน](#วิธีใช้งาน)
5. [Server Component vs Client Component](#server-component-vs-client-component)
6. [Environment Variables](#environment-variables)
7. [ไฟล์ตั้งค่าที่ควรรู้จัก](#ไฟล์ตั้งค่าที่ควรรู้จัก)
8. [คำศัพท์ที่ควรรู้](#คำศัพท์ที่ควรรู้)
9. [หมายเหตุเรื่อง Git](#หมายเหตุเรื่อง-git)
10. [ยังไม่ได้เปิดใช้ (ทางเลือกในอนาคต)](#ยังไม่ได้เปิดใช้-ทางเลือกในอนาคต)
11. [แหล่งเรียนรู้เพิ่มเติม](#แหล่งเรียนรู้เพิ่มเติม)

---

## Stack ที่ใช้ (คืออะไรบ้าง)

| อะไร             | เวอร์ชัน        | คืออะไร                                                                                                  | หมายเหตุ                                                                         |
| ---------------- | --------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Next.js**      | 16.2.10         | React framework ที่จัดการ routing, rendering (server/client), build ให้ครบ ไม่ต้องต่อ Webpack/Router เอง | ใช้ App Router (ไม่ใช่ Pages Router แบบเก่า), ใช้ Turbopack เป็น bundler default |
| **React**        | 19.2            | Library สำหรับสร้าง UI แบบ component                                                                     | เวอร์ชันนี้รวม feature ใหม่อย่าง `useEffectEvent`, View Transitions              |
| **TypeScript**   | 5               | JavaScript ที่เพิ่ม static type ทำให้ editor เตือนบั๊กได้ก่อนรัน                                         | ตั้ง `strict` + strict flags เพิ่มเติม (ดูหัวข้อ tsconfig)                       |
| **Tailwind CSS** | v4              | CSS framework แบบ utility-class (เขียน class ตรงใน HTML/JSX แทนเขียน CSS แยกไฟล์)                        | ตั้งค่าแบบ CSS-first ไม่มี `tailwind.config.js` (ต่างจาก v3)                     |
| **Node.js**      | ≥ 20 (แนะนำ 22) | JavaScript runtime ที่ใช้รัน dev server / build                                                          | กำหนดไว้ใน `.nvmrc` และ `engines` ใน `package.json`                              |

### ทำไมต้องเป็น stack นี้

- **Next.js** ให้ทั้ง SSR (render หน้าเว็บที่ server ก่อนส่งมาให้ browser ทำให้โหลดเร็ว/SEO ดี) และ static export ในตัว ไม่ต้องตั้ง server เอง
- **TypeScript** จับ error ประเภท "พิมพ์ผิด/ส่ง argument ผิด type" ได้ตั้งแต่ตอนเขียนโค้ด ไม่ต้องรอไปพังตอน runtime
- **Tailwind** ทำให้ไม่ต้องสร้างไฟล์ `.css` แยกทุก component แล้วคิดชื่อ class เอง — เขียน `className="flex items-center gap-2"` จบในไฟล์เดียว

---

## โครงสร้างโปรเจกต์

```
my-planora/
├── src/
│   └── app/                  ← App Router: ทุกไฟล์ในนี้ map เป็น route
│       ├── layout.tsx         ← โครง <html>/<body> หลัก ครอบทุกหน้า
│       ├── page.tsx           ← หน้า "/" (หน้าแรก)
│       ├── globals.css        ← import Tailwind + ธีมสี (CSS variables)
│       └── favicon.ico
├── public/                    ← ไฟล์ static (เข้าถึงตรงด้วย path เช่น /next.svg)
│   ├── next.svg, vercel.svg, ...
├── .husky/
│   └── pre-commit              ← สคริปต์ที่รันก่อน commit ทุกครั้ง
├── package.json                ← scripts, dependencies, lint-staged config
├── tsconfig.json                ← ตั้งค่า TypeScript
├── eslint.config.mjs            ← ตั้งค่า ESLint
├── .prettierrc.json             ← ตั้งค่า Prettier
├── postcss.config.mjs           ← เชื่อม Tailwind เข้ากับ PostCSS
├── next.config.ts               ← ตั้งค่า Next.js
├── .editorconfig, .nvmrc        ← ความสม่ำเสมอของ environment
└── AGENTS.md / CLAUDE.md        ← คำเตือนสำหรับ AI agent (ดูหัวข้อด้านล่าง)
```

### App Router: ชื่อไฟล์มีความหมาย (ไม่ใช่ตั้งชื่อเอง)

ใน `src/app/` ชื่อไฟล์พิเศษพวกนี้ Next.js จะไปหาเจอเองแล้วทำหน้าที่ตามชื่อ — ต่างจาก React ทั่วไปที่ตั้งชื่อ component เองได้หมด:

| ไฟล์            | ทำหน้าที่                                                                           | จำเป็นไหม                                  |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| `page.tsx`      | ทำให้ folder นั้นกลายเป็น route จริง (เข้าเว็บได้)                                  | ต้องมีถ้าต้องการให้ path นั้นเข้าถึงได้    |
| `layout.tsx`    | โครง UI ที่ครอบทุกหน้าใน folder นั้น (ไม่ re-render ตอนเปลี่ยนหน้าย่อย)             | มีที่ root เสมอ, ใส่เพิ่มใน sub-folder ได้ |
| `loading.tsx`   | UI ที่โชว์ระหว่างรอโหลดหน้า (Next.js ใส่ Suspense ให้อัตโนมัติ)                     | ไม่บังคับ                                  |
| `error.tsx`     | UI ที่โชว์เมื่อ error เกิดขึ้นใน route นั้น (ต้องเป็น Client Component)             | ไม่บังคับ                                  |
| `not-found.tsx` | UI ที่โชว์เมื่อเรียก `notFound()` หรือเข้า path ที่ไม่มี                            | ไม่บังคับ                                  |
| `route.ts`      | สร้าง API endpoint (แทน page — ห้ามมี `page.tsx` กับ `route.ts` ใน folder เดียวกัน) | ใช้เมื่อต้องการทำ API                      |

ตัวอย่าง: อยากได้หน้า `/about` → สร้างไฟล์ `src/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return <h1>เกี่ยวกับเรา</h1>;
}
```

แค่นี้เข้า `http://localhost:3000/about` ได้เลย ไม่ต้องไปประกาศ route ที่ไหนเพิ่ม

---

## สรุปสิ่งที่ตั้งค่าไปแล้ว แบบละเอียด

### 1. แก้ช่องโหว่ความปลอดภัย (postcss)

ตอนสร้างโปรเจกต์ `create-next-app` ดึง `next@16.2.10` มา ซึ่งข้างในมันแอบ bundle `postcss@8.4.31` (nested dependency) ที่มีช่องโหว่ XSS ที่รู้จักกันคือ [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93)

ปัญหาคือ `npm audit fix --force` ที่ npm แนะนำ จะไป **downgrade Next.js เป็นเวอร์ชัน canary ปี 2020** ซึ่งพังยิ่งกว่าเดิม เราเลยแก้ด้วยการเพิ่ม field `overrides` ใน `package.json` แทน:

```json
"overrides": {
  "postcss": "^8.5.10"
}
```

field นี้บอก npm ว่า "ไม่ว่า package ไหนใน dependency tree จะขอ postcss เวอร์ชันอะไรก็ตาม ให้บังคับใช้ `^8.5.10` แทนทั้งหมด" — โดยไม่ต้องแก้เวอร์ชัน `next` เลย ผลคือรัน `npm audit` แล้วได้ `0 vulnerabilities`

### 2. Prettier + จัดเรียง Tailwind class อัตโนมัติ

**Prettier** คือตัวจัด format โค้ด (เว้นบรรทัด, ใส่ semicolon, ความยาวบรรทัด ฯลฯ) ให้เหมือนกันทุกคนในทีมโดยไม่ต้องเถียงกันเรื่อง style

ปัญหาที่มักเจอกับ Tailwind คือพอ class เยอะๆ คนเขียนจะเรียงลำดับไม่เหมือนกัน (บางคนเอา `flex` ไว้หน้า บางคนเอาไว้หลัง) — เราเลยลง `prettier-plugin-tailwindcss` ที่จะจัดเรียง class ให้ตามลำดับมาตรฐานเดียวกันทุกครั้งที่ format เช่น

```tsx
// ก่อน format (เรียงมั่วๆ)
<div className="text-white p-4 flex bg-blue-500 items-center">

// หลัง format (plugin จัดลำดับให้เอง: layout → box model → color)
<div className="flex items-center bg-blue-500 p-4 text-white">
```

และลง `eslint-config-prettier` เพิ่ม เพราะ ESLint บางกฎ (เช่นเว้นวรรค, ใส่ quote) ซ้ำกับที่ Prettier ทำอยู่แล้ว ถ้าเปิดทั้งคู่จะตีกัน (ESLint บอกผิดแบบหนึ่ง Prettier แก้ให้อีกแบบ) — config นี้จะปิดกฎ ESLint ที่ทับกับ Prettier ทั้งหมด เหลือให้ ESLint ทำหน้าที่จับ "บั๊ก" (เช่น unused variable) ส่วน Prettier ทำหน้าที่ "format" อย่างเดียว

### 3. Husky + lint-staged (Git hooks)

**Git hook** คือสคริปต์ที่ git รันอัตโนมัติตอนเกิด event บางอย่าง (เช่นก่อน commit, ก่อน push) — **Husky** คือตัวช่วยติดตั้ง hook พวกนี้ให้ง่ายขึ้น (ปกติต้องเขียนสคริปต์ลงในโฟลเดอร์ `.git/hooks` เอง ซึ่งไม่ถูก commit ไปกับ repo)

**lint-staged** คือตัวที่รัน lint/format เฉพาะไฟล์ที่ `git add` ไว้ (staged) เท่านั้น ไม่ใช่ทั้งโปรเจกต์ — เร็วกว่ามาก โดยเฉพาะโปรเจกต์ใหญ่

Flow ตอน commit:

```
git add src/app/about/page.tsx
git commit -m "add about page"
        │
        ▼
.husky/pre-commit ทำงาน → รัน `npx lint-staged`
        │
        ▼
lint-staged เช็คว่าไฟล์ staged ตรงกับ pattern ไหนใน package.json
        │
        ├─ *.{js,jsx,ts,tsx}        → รัน `eslint --fix`
        └─ *.{js,jsx,ts,tsx,json,css,md} → รัน `prettier --write`
        │
        ▼
ถ้าทุกอย่าง fix ได้/ผ่าน → commit สำเร็จ (ไฟล์ที่ถูกแก้จะถูก add กลับให้อัตโนมัติ)
ถ้ามี error ที่ fix เองไม่ได้ (เช่น unused variable แบบจริงจัง) → commit ถูก block, ต้องแก้เองแล้ว add ใหม่
```

ตั้งค่าไว้ใน `package.json`:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"]
}
```

### 4. tsconfig เข้มขึ้น (strict flags)

`strict: true` ใน tsconfig เป็น baseline ที่ดีอยู่แล้ว (บังคับเช็ค null/undefined, ไม่ให้ implicit `any` ฯลฯ) แต่เราเพิ่ม flag เสริมอีก 4 ตัวที่ `strict` เพียวๆ ไม่ครอบคลุม — แต่ละตัวจับบั๊กคนละแบบ:

**`noUncheckedIndexedAccess`** — ปกติ TypeScript เชื่อว่า index array/object ยังไงก็ได้ค่ากลับมาแน่ๆ ทั้งที่จริงอาจได้ `undefined` ถ้า index เกินขนาด:

```ts
const users: string[] = ["Alice", "Bob"];
const third = users[2]; // ไม่มี element ตัวนี้จริง
console.log(third.toUpperCase());
// ไม่เปิด flag: TS มองว่า third เป็น string เฉยๆ → ไม่เตือน → พังตอน runtime (Cannot read properties of undefined)
// เปิด flag: TS มองว่า third เป็น string | undefined → บังคับเช็คก่อนใช้
```

**`noImplicitReturns`** — จับฟังก์ชันที่บางเงื่อนไข "ลืม return":

```ts
function getLabel(status: number): string {
  if (status === 1) {
    return "active";
  }
  // ลืม return ตอน status !== 1
}
// เปิด flag: TS error ทันทีว่า "Not all code paths return a value"
```

**`noFallthroughCasesInSwitch`** — จับ `switch-case` ที่ลืมใส่ `break` แล้วโค้ด "ไหล" ไปทำ case ถัดไปโดยไม่ตั้งใจ:

```ts
switch (role) {
  case "admin":
    grantFullAccess();
  // ลืม break ตรงนี้
  case "user":
    grantLimitedAccess(); // จะรันทั้งคู่ทั้งที่ role === "admin" อย่างเดียว
    break;
}
// เปิด flag: TS error ที่ case "admin" ว่า fallthrough case ในนี้ห้ามมี
```

**`forceConsistentCasingInFileNames`** — Windows/macOS มองชื่อไฟล์แบบ case-insensitive (`Button.tsx` เข้าถึงด้วย `button.tsx` ก็เจอ) แต่ Linux (รวมถึง server ที่ deploy จริงและ CI ส่วนใหญ่) เป็น case-sensitive — flag นี้บังคับให้ import ตรงตัวพิมพ์เล็ก/ใหญ่กับชื่อไฟล์จริงเสมอ ป้องกัน "รันได้ที่เครื่องตัวเองแต่ deploy แล้วพัง"

### 5. ความสม่ำเสมอของ environment

- **`.editorconfig`** — บังคับ indent size, charset, trailing whitespace ให้เหมือนกันไม่ว่าใครใช้ editor ไหน (VS Code, WebStorm, Vim ฯลฯ ต่างก็อ่านไฟล์นี้)
- **`.nvmrc`** (เก็บเลข `22`) — ถ้าใช้ [nvm](https://github.com/nvm-sh/nvm) พิมพ์ `nvm use` ในโฟลเดอร์นี้จะสลับไป Node 22 ให้อัตโนมัติ
- **`engines.node`** ใน `package.json` — ถ้ามีคน/CI รัน `npm install` ด้วย Node เวอร์ชันต่ำกว่า 20 จะเตือน (บาง CI ตั้งให้ error ไปเลย)

### 6. ตรวจสอบแล้วว่าใช้งานได้จริง

รันแล้วผ่านทั้งหมด: `npm run lint` (0 error), `npm run typecheck` (0 error), `npm run build` (build สำเร็จ, generate static page), `npm run dev` (server ตอบ HTTP 200)

---

## วิธีใช้งาน

### เริ่ม dev server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) แก้ไฟล์ที่ `src/app/page.tsx` แล้วหน้าจะ auto-reload ให้เอง (Fast Refresh — แก้โค้ดแล้วเห็นผลทันทีโดยไม่รีเฟรชทั้งหน้า ไม่เสีย state ของ component ที่เปิดอยู่)

### คำสั่งที่มีให้ใช้

| คำสั่ง                 | ใช้ทำอะไร                                     | ใช้ตอนไหน                                                                         |
| ---------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run dev`          | รัน dev server (Turbopack)                    | เขียนโค้ดระหว่างวัน                                                               |
| `npm run build`        | build โปรเจกต์สำหรับ production               | ก่อน deploy / เช็คว่า build ผ่านไหมก่อน push                                      |
| `npm run start`        | รันโปรเจกต์ที่ build แล้ว                     | ทดสอบ production build ที่เครื่องตัวเอง (ต้อง `build` ก่อน)                       |
| `npm run lint`         | ตรวจโค้ดด้วย ESLint                           | เช็คก่อน commit/PR                                                                |
| `npm run lint:fix`     | ตรวจแล้วแก้ให้อัตโนมัติเท่าที่ทำได้           | เวลามี lint error เยอะและอยากแก้เร็วๆ                                             |
| `npm run format`       | จัด format ทุกไฟล์ด้วย Prettier               | หลัง paste โค้ดจากที่อื่น/format ทั้งโปรเจกต์รอบใหญ่                              |
| `npm run format:check` | เช็คว่าไฟล์ format ถูกต้องไหม (ไม่แก้ไฟล์)    | ใช้ใน CI เพื่อ block PR ที่ format ไม่ผ่าน                                        |
| `npm run typecheck`    | ตรวจ type ด้วย TypeScript (ไม่ generate ไฟล์) | เช็คก่อน commit/PR, editor ปกติเช็ค real-time อยู่แล้วแต่บาง error editor พลาดได้ |

หมายเหตุ: ปกติไม่ต้องรันคำสั่งเหล่านี้เองบ่อยๆ เพราะ `lint` + `format` ส่วนไฟล์ staged จะรันอัตโนมัติผ่าน Husky ตอน commit อยู่แล้ว (ดูหัวข้อ Husky ด้านบน) — เอาไว้รันตอนอยากเช็คทั้งโปรเจกต์ หรือรันก่อน push/เปิด PR

### แก้ไข/เพิ่มหน้าเว็บ (App Router)

- หน้าแรกอยู่ที่ [src/app/page.tsx](src/app/page.tsx)
- layout หลัก (เช่น `<html>`, font, metadata) อยู่ที่ [src/app/layout.tsx](src/app/layout.tsx)
- จะเพิ่มหน้าใหม่ เช่น `/about` → สร้างไฟล์ `src/app/about/page.tsx` (ดูตัวอย่างในหัวข้อโครงสร้างโปรเจกต์ด้านบน)
- จะเพิ่ม dynamic route เช่น `/blog/[slug]` → สร้างไฟล์ `src/app/blog/[slug]/page.tsx`:

```tsx
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // Next.js 15+ ต้อง await params เสมอ (เป็น Promise)
  return <h1>โพสต์: {slug}</h1>;
}
```

### แก้ธีม/สี Tailwind (v4)

Tailwind v4 ไม่ใช้ `tailwind.config.js` แบบเดิมแล้ว แต่กำหนด custom theme ผ่าน CSS ที่ [src/app/globals.css](src/app/globals.css) โดยตรง ด้วย `@theme`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

จะเพิ่มสีหรือ token ใหม่ก็เพิ่ม CSS variable ในไฟล์นี้ได้เลย ไม่ต้องไปสร้าง config ไฟล์แยก เช่นเพิ่มสี brand:

```css
@theme inline {
  --color-brand: #6d28d9;
}
```

แล้วใช้ได้ทันทีเป็น `className="bg-brand text-brand"` ทั่วโปรเจกต์

**เทียบ v3 vs v4 แบบย่อ:**

|                             | Tailwind v3                              | Tailwind v4                      |
| --------------------------- | ---------------------------------------- | -------------------------------- |
| ที่ตั้งค่า theme            | `tailwind.config.js` (JavaScript object) | ตรงใน CSS ด้วย `@theme`          |
| บอกให้ scan ไฟล์ไหนหา class | ต้องระบุ `content: [...]` เอง            | หาให้อัตโนมัติ ไม่ต้องตั้ง       |
| ความเร็ว build              | ช้ากว่า                                  | เร็วกว่ามาก (compiler เขียนใหม่) |

---

## Server Component vs Client Component

คอนเซปต์นี้สำคัญที่สุดที่ต้องเข้าใจก่อนเขียน component ใน App Router — ต่างจาก React ทั่วไปที่ทุก component รันที่ browser เหมือนกันหมด

|                                             | Server Component (default)                            | Client Component                                           |
| ------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| รันที่ไหน                                   | Server เท่านั้น (ไม่มี JS ส่งไป browser)              | Server (ครั้งแรก) แล้ว hydrate ที่ browser                 |
| ใช้ `useState`/`useEffect`/`onClick` ได้ไหม | ❌ ไม่ได้                                             | ✅ ได้                                                     |
| `async/await` ตรงใน component ได้ไหม        | ✅ ได้ (fetch ข้อมูลตรงใน component เลย)              | ❌ ไม่ได้                                                  |
| ต้องเขียนอะไรเพิ่ม                          | ไม่ต้อง (default อยู่แล้ว)                            | ต้องมี `"use client"` บรรทัดแรกของไฟล์                     |
| ใช้ตอนไหน                                   | ดึงข้อมูล, render เนื้อหา static, ไม่มี interactivity | มี state, event handler, browser API (เช่น `localStorage`) |

ตัวอย่าง Server Component (ดึงข้อมูลตรงในนี้ได้เลย):

```tsx
// src/app/posts/page.tsx (ไม่มี "use client" = Server Component)
async function getPosts() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <ul>
      {posts.map((p: { id: string; title: string }) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

ตัวอย่าง Client Component (มี state/event):

```tsx
// src/app/components/Counter.tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>กด {count} ครั้ง</button>;
}
```

กฎง่ายๆ: **เริ่มเขียนแบบ Server Component ไว้ก่อนเสมอ** แล้วใส่ `"use client"` เฉพาะไฟล์ที่ต้องมี interactivity จริงๆ (ยิ่งมี Client Component น้อย ยิ่งส่ง JS ไป browser น้อย เว็บโหลดเร็วขึ้น)

---

## Environment Variables

ตัวแปรลับ (API key, database URL) ไม่ควร hardcode ในโค้ด — ใส่ในไฟล์ `.env.local` ที่ root โปรเจกต์ (ไฟล์นี้ถูก git ignore ไว้ให้แล้วผ่าน `.gitignore` pattern `.env*`):

```bash
# .env.local
DATABASE_URL="postgres://..."
NEXT_PUBLIC_SITE_NAME="Planora"
```

- ตัวแปรที่ **ไม่มี** prefix `NEXT_PUBLIC_` → อ่านได้แค่ฝั่ง server เท่านั้น (Server Component, Server Action, route handler) ปลอดภัย ไม่หลุดไป browser
- ตัวแปรที่ **มี** prefix `NEXT_PUBLIC_` → ถูก bundle ไปกับโค้ดฝั่ง client เลย เห็นได้จาก browser devtools ทุกคน — ใช้กับข้อมูลที่ไม่ลับเท่านั้น (เช่นชื่อเว็บ, public API endpoint)

```tsx
// ใช้ได้เฉพาะ Server Component
async function getData() {
  const dbUrl = process.env.DATABASE_URL; // undefined ถ้าไม่ตั้งใน .env.local
}
```

```tsx
"use client";
// ใช้ได้เพราะมี prefix NEXT_PUBLIC_
export function SiteName() {
  return <span>{process.env.NEXT_PUBLIC_SITE_NAME}</span>;
}
```

---

## ไฟล์ตั้งค่าที่ควรรู้จัก

| ไฟล์                                     | หน้าที่                                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [package.json](package.json)             | scripts, dependencies, `overrides` (postcss fix), `lint-staged` config                                                                                              |
| [tsconfig.json](tsconfig.json)           | TypeScript strict config                                                                                                                                            |
| [eslint.config.mjs](eslint.config.mjs)   | ESLint flat config (Next.js + Prettier)                                                                                                                             |
| [.prettierrc.json](.prettierrc.json)     | Prettier config                                                                                                                                                     |
| [postcss.config.mjs](postcss.config.mjs) | PostCSS + Tailwind plugin                                                                                                                                           |
| [.husky/pre-commit](.husky/pre-commit)   | Git hook ที่รัน lint-staged                                                                                                                                         |
| [.nvmrc](.nvmrc)                         | Node version ที่ใช้                                                                                                                                                 |
| [next.config.ts](next.config.ts)         | ตั้งค่า Next.js (ปัจจุบันยังเป็นค่า default ทั้งหมด)                                                                                                                |
| [AGENTS.md](AGENTS.md)                   | คำเตือนสำหรับ AI coding agent ว่า Next.js 16 มี breaking changes จาก training data เก่า ให้ไปอ่าน docs ที่ bundle มาใน `node_modules/next/dist/docs/` ก่อนเขียนโค้ด |

---

## คำศัพท์ที่ควรรู้

| คำ                                 | ความหมาย                                                                                                                            |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **SSR** (Server-Side Rendering)    | Render HTML ที่ server ก่อนส่งให้ browser (ต่างจาก render ทุกอย่างที่ browser ล้วนๆ)                                                |
| **RSC** (React Server Component)   | Component ที่รันเฉพาะที่ server ไม่ส่ง JS ของ component นั้นไป browser เลย — คือ Server Component ที่อธิบายด้านบน                   |
| **Hydration**                      | ขั้นตอนที่ browser รับ HTML ที่ server render มา แล้วแนบ event listener/JS logic เข้าไปทำให้ interactive ได้                        |
| **App Router**                     | ระบบ routing ปัจจุบันของ Next.js (ใช้โฟลเดอร์ `app/`) แทนของเก่าคือ Pages Router (โฟลเดอร์ `pages/`)                                |
| **Turbopack**                      | Bundler (ตัวรวมไฟล์ JS/CSS ให้ browser โหลดได้) ตัวใหม่ของ Vercel เขียนด้วย Rust เร็วกว่า Webpack เดิม — เป็น default ใน Next.js 16 |
| **Utility-first CSS**              | แนวทางของ Tailwind: ใช้ class สำเร็จรูปเล็กๆ (`flex`, `p-4`) ประกอบกันแทนเขียน custom CSS class เอง                                 |
| **lockfile** (`package-lock.json`) | ไฟล์ที่ล็อก version ของทุก dependency (รวม nested) แบบเป๊ะๆ ให้ทุกเครื่อง/CI install ได้ของเดียวกันเสมอ ห้ามแก้มือ                  |

---

## หมายเหตุเรื่อง Git

`create-next-app` สร้าง git repo และ commit แรกให้อัตโนมัติ ("Initial commit from Create Next App") ส่วนการตั้งค่าเพิ่มเติมทั้งหมดข้างต้นยังไม่ได้ commit — เช็คได้ด้วย `git status` แล้วค่อย commit เองตอนพร้อม

---

## ยังไม่ได้เปิดใช้ (ทางเลือกในอนาคต)

- **React Compiler** — stable แล้วใน Next.js 16 เป็นตัวที่วิเคราะห์โค้ดแล้วแทรก memoization (กัน re-render ที่ไม่จำเป็น) ให้อัตโนมัติ โดยไม่ต้องเขียน `useMemo`/`useCallback` เอง ยังไม่ enable ในโปรเจกต์นี้เพราะเพิ่มเวลา build (ต้องผ่าน Babel เพิ่ม) ถ้าอยากเปิด ให้เพิ่ม `reactCompiler: true` ใน `next.config.ts` และลง `babel-plugin-react-compiler`
- **Cache Components / PPR (Partial Prerendering)** — ฟีเจอร์ caching ใหม่ของ Next.js 16 ที่ให้ render ส่วน static ของหน้าแบบ instant แล้ว stream ส่วน dynamic ตามมา ยังไม่เปิดเพราะเปลี่ยน caching behavior ค่อนข้างมาก ควรอ่านทำความเข้าใจก่อนใช้จริงกับข้อมูลที่ต้อง fresh เสมอ

---

## แหล่งเรียนรู้เพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs) — เอกสารหลัก อ่านเรื่อง App Router ก่อน
- [Learn Next.js](https://nextjs.org/learn) — tutorial แบบ interactive ทำตามได้เลย
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) — ค้น utility class ที่มีทั้งหมด
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — พื้นฐาน TypeScript แบบเป็นระบบ
- [React Documentation](https://react.dev) — คอนเซปต์ React ล่าสุด (รวม Server Components)
