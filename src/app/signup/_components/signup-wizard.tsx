"use client";

import { useState } from "react";
import { RegisterSidebar } from "./register-sidebar";
import { ApplicantTypeStep } from "./applicant-type-step";
import { PersonalInfoStep } from "./personal-info-step";
import { ComingSoonStep } from "./coming-soon-step";

export function SignupWizard() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <RegisterSidebar currentStep={step} onStepClick={setStep} />
      <main className="flex-1 px-6 py-10 sm:px-12 sm:py-14">
        {step === 1 && <ApplicantTypeStep onNext={() => setStep(2)} />}
        {step === 2 && <PersonalInfoStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step > 2 && <ComingSoonStep step={step} onBack={() => setStep(1)} />}
      </main>
    </div>
  );
}
