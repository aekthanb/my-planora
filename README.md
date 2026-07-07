# my-planora

โปรเจกต์ Next.js + Tailwind CSS ที่ตั้งค่าแบบ production-grade (พร้อม TypeScript, ESLint, Prettier, Git hooks)

## Stack ที่ใช้

| อะไร         | เวอร์ชัน        | หมายเหตุ                                           |
| ------------ | --------------- | -------------------------------------------------- |
| Next.js      | 16.2.10         | App Router, Turbopack (default ทั้ง dev และ build) |
| React        | 19.2            |                                                    |
| TypeScript   | 5               | strict mode + strict flags เพิ่มเติม               |
| Tailwind CSS | v4              | ตั้งค่าแบบ CSS-first ไม่มี `tailwind.config.js`    |
| Node.js      | ≥ 20 (แนะนำ 22) | กำหนดไว้ใน `.nvmrc` และ `engines`                  |

## สรุปสิ่งที่ตั้งค่าไปแล้ว

1. **แก้ช่องโหว่ความปลอดภัย** — `create-next-app` ติด postcss เวอร์ชันที่มีช่องโหว่ XSS มาแบบ nested dependency เลยเพิ่ม `overrides` ใน `package.json` บีบให้ใช้ postcss เวอร์ชันที่ปลอดภัย โดยไม่ต้อง downgrade Next.js — รันแล้วได้ `0 vulnerabilities`

2. **Prettier + จัดเรียง Tailwind class อัตโนมัติ** — ลง `prettier-plugin-tailwindcss` ให้ class ใน `className` ถูกจัดเรียงลำดับให้เองตอน format และลง `eslint-config-prettier` เพื่อไม่ให้ ESLint กับ Prettier ตีกันเรื่อง format

3. **Husky + lint-staged (Git hooks)** — ทุกครั้งที่ `git commit` จะรัน ESLint (`--fix`) และ Prettier กับไฟล์ที่ staged เท่านั้นอัตโนมัติ ป้องกันโค้ดที่ format ไม่สวย/มี lint error หลุดเข้า repo

4. **tsconfig เข้มขึ้น** — เพิ่ม `noUncheckedIndexedAccess`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames` ต่อจาก `strict` เดิม เพื่อจับบั๊กได้ตั้งแต่ compile time มากขึ้น

5. **ความสม่ำเสมอของ environment** — เพิ่ม `.editorconfig` (indent/charset ตรงกันทุก editor), `.nvmrc` และ `engines.node` (บังคับ Node version ให้ตรงกันทุกเครื่อง/CI)

6. **ตรวจสอบแล้วว่าใช้งานได้จริง** — รัน `lint`, `typecheck`, `build`, และ `dev` ผ่านหมดทุกตัว

## วิธีใช้งาน

### เริ่ม dev server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) แก้ไฟล์ที่ `src/app/page.tsx` แล้วหน้าจะ auto-reload ให้เอง

### คำสั่งที่มีให้ใช้

| คำสั่ง                 | ใช้ทำอะไร                                     |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | รัน dev server (Turbopack)                    |
| `npm run build`        | build โปรเจกต์สำหรับ production               |
| `npm run start`        | รันโปรเจกต์ที่ build แล้ว (ต้อง `build` ก่อน) |
| `npm run lint`         | ตรวจโค้ดด้วย ESLint                           |
| `npm run lint:fix`     | ตรวจแล้วแก้ให้อัตโนมัติเท่าที่ทำได้           |
| `npm run format`       | จัด format ทุกไฟล์ด้วย Prettier               |
| `npm run format:check` | เช็คว่าไฟล์ format ถูกต้องไหม (ไม่แก้ไฟล์)    |
| `npm run typecheck`    | ตรวจ type ด้วย TypeScript (ไม่ generate ไฟล์) |

### ตอน commit จะเกิดอะไรขึ้น

พอสั่ง `git commit` จะมี Husky ดักไว้ (`.husky/pre-commit`) ให้รัน `lint-staged` อัตโนมัติ ซึ่งจะ:

- รัน `eslint --fix` กับไฟล์ `.js/.jsx/.ts/.tsx` ที่ staged
- รัน `prettier --write` กับไฟล์ที่ staged ทั้งหมด (js/ts/json/css/md)

ถ้าแก้ไม่ได้ (เช่น lint error จริงๆ) commit จะถูก block ไว้ ให้แก้ตามที่ terminal แจ้งแล้ว `git add` ใหม่อีกครั้ง

### แก้ไข/เพิ่มหน้าเว็บ (App Router)

- หน้าแรกอยู่ที่ [src/app/page.tsx](src/app/page.tsx)
- layout หลัก (เช่น `<html>`, font, metadata) อยู่ที่ [src/app/layout.tsx](src/app/layout.tsx)
- จะเพิ่มหน้าใหม่ เช่น `/about` → สร้างไฟล์ `src/app/about/page.tsx`

### แก้ธีม/สี Tailwind (v4)

Tailwind v4 ไม่ใช้ `tailwind.config.js` แบบเดิมแล้ว แต่กำหนด custom theme ผ่าน CSS ที่ [src/app/globals.css](src/app/globals.css) โดยตรง ด้วย `@theme` เช่น:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

จะเพิ่มสีหรือ token ใหม่ก็เพิ่ม CSS variable ในไฟล์นี้ได้เลย ไม่ต้องไปสร้าง config ไฟล์แยก

## ไฟล์ตั้งค่าที่ควรรู้จัก

| ไฟล์                                     | หน้าที่                                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| [package.json](package.json)             | scripts, dependencies, `overrides` (postcss fix), `lint-staged` config                  |
| [tsconfig.json](tsconfig.json)           | TypeScript strict config                                                                |
| [eslint.config.mjs](eslint.config.mjs)   | ESLint flat config (Next.js + Prettier)                                                 |
| [.prettierrc.json](.prettierrc.json)     | Prettier config                                                                         |
| [postcss.config.mjs](postcss.config.mjs) | PostCSS + Tailwind plugin                                                               |
| [.husky/pre-commit](.husky/pre-commit)   | Git hook ที่รัน lint-staged                                                             |
| [.nvmrc](.nvmrc)                         | Node version ที่ใช้                                                                     |
| [AGENTS.md](AGENTS.md)                   | คำเตือนสำหรับ AI coding agent ว่า Next.js 16 มี breaking changes จาก training data เก่า |

## หมายเหตุเรื่อง Git

`create-next-app` สร้าง git repo และ commit แรกให้อัตโนมัติ ("Initial commit from Create Next App") ส่วนการตั้งค่าเพิ่มเติมทั้งหมดข้างต้นยังไม่ได้ commit — เช็คได้ด้วย `git status` แล้วค่อย commit เองตอนพร้อม

## ยังไม่ได้เปิดใช้ (ทางเลือกในอนาคต)

- **React Compiler** — stable แล้วใน Next.js 16 แต่ยังไม่ enable เพราะเพิ่มเวลา build (ใช้ Babel) ถ้าต้องการ auto-memoization ให้เปิดผ่าน `reactCompiler: true` ใน `next.config.ts`
- **Cache Components / PPR** — ฟีเจอร์ caching ใหม่ของ Next.js 16 ยังไม่เปิดเพราะเปลี่ยน caching behavior พอสมควร ต้องดูให้ดีก่อนใช้จริง
