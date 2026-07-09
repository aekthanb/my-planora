import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Planora",
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
          P
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">เข้าสู่ระบบ Planora</h1>
        <p className="text-muted-foreground text-sm">กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน</p>
      </div>

      <LoginForm />

      <p className="text-muted-foreground text-center text-sm">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline">
          สมัครสมาชิกใหม่
        </Link>
      </p>
    </div>
  );
}
