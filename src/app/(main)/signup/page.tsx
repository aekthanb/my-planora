import type { Metadata } from "next";
import { SignupWizard } from "./_components/signup-wizard";

export const metadata: Metadata = {
  title: "สมัครเข้าร่วม | Right Now",
};

export default function SignupPage() {
  return <SignupWizard />;
}
