import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Planora",
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">เข้าสู่ระบบ</h1>
        <p className="text-muted-foreground text-base">
          กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน Planora
        </p>
      </div>

      <LoginForm />

      <p className="text-muted-foreground text-center text-sm">
        ยังไม่มีบัญชี?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline">
          สมัครสมาชิกใหม่
        </Link>
      </p>

      <Separator />

      <p className="text-muted-foreground text-center text-xs">
        มีปัญหาการเข้าสู่ระบบ?{" "}
        <a href="mailto:support@planora.app" className="hover:underline">
          ติดต่อทีมสนับสนุน
        </a>
      </p>
    </div>
  );
}
