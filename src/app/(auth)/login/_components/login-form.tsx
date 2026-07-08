"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">อีเมล</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!state?.errors?.email}
          required
        />
        {state?.errors?.email && (
          <p className="text-destructive text-sm">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-sm hover:underline"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={!!state?.errors?.password}
            className="pr-14"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-3 text-sm"
          >
            {showPassword ? "ซ่อน" : "แสดง"}
          </button>
        </div>
        {state?.errors?.password && (
          <p className="text-destructive text-sm">{state.errors.password[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" defaultChecked />
        <Label htmlFor="remember" className="text-muted-foreground font-normal">
          จดจำการเข้าสู่ระบบ 30 วัน
        </Label>
      </div>

      {state?.message && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </Button>
    </form>
  );
}
