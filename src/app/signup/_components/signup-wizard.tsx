"use client";

import { useState } from "react";
import { RegisterSidebar } from "./register-sidebar";
import { ApplicantTypeStep } from "./applicant-type-step";
import { ComingSoonStep } from "./coming-soon-step";

export function SignupWizard() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <RegisterSidebar currentStep={step} onStepClick={setStep} />
      <main className="flex flex-1 justify-center px-6 py-10 sm:px-12 sm:py-14">
        {step === 1 ? (
          <ApplicantTypeStep onNext={() => setStep(2)} />
        ) : (
          <ComingSoonStep step={step} onBack={() => setStep(1)} />
        )}
      </main>
    </div>
  );
}
