import type { Metadata } from "next";
import { RegisterSidebar } from "./_components/register-sidebar";
import { ApplicantTypeStep } from "./_components/applicant-type-step";

export const metadata: Metadata = {
  title: "สมัครเข้าร่วม | Right Now",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <RegisterSidebar currentStep={1} />
      <main className="flex flex-1 justify-center px-6 py-10 sm:px-12 sm:py-14">
        <ApplicantTypeStep />
      </main>
    </div>
  );
}
