"use client";

import { useState } from "react";
import { RegisterSidebar } from "./register-sidebar";
import { ApplicantTypeStep } from "./applicant-type-step";
import { PersonalInfoStep } from "./personal-info-step";
import { PdpaConsentStep, type ConsentSummary } from "./pdpa-consent-step";
import { ReviewSubmitStep } from "./review-submit-step";

export function SignupWizard() {
  const [step, setStep] = useState(1);
  const [applicantType, setApplicantType] = useState("E11");
  const [subStepCompletion, setSubStepCompletion] = useState<Record<number, boolean>>({});
  const [consent, setConsent] = useState<ConsentSummary | null>(null);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <RegisterSidebar
        currentStep={step}
        onStepClick={setStep}
        subStepCompletion={subStepCompletion}
      />
      <main className="flex-1 px-6 py-10 sm:px-12 sm:py-14">
        {step === 1 && (
          <ApplicantTypeStep
            onNext={(code) => {
              setApplicantType(code);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <PersonalInfoStep
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
            onProgressChange={setSubStepCompletion}
          />
        )}
        {step === 3 && (
          <PdpaConsentStep
            applicantType={applicantType}
            onNext={(consentData) => {
              setConsent(consentData);
              setStep(4);
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <ReviewSubmitStep
            applicantType={applicantType}
            consent={consent}
            onBack={() => setStep(3)}
            onEditStep={setStep}
          />
        )}
      </main>
    </div>
  );
}
