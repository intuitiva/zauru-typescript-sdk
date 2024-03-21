import type { ReactNode } from "react";
import React, { useState } from "react";
import { LoadingInputSkeleton } from "src";

export type StepWizard = {
  index: number;
  stepName: string;
  component: ReactNode;
};

interface StepWizardProps {
  steps: StepWizard[];
  showStepName?: boolean;
  loading?: boolean;
}

export const StepWizardComponent: React.FC<StepWizardProps> = ({
  steps,
  showStepName = false,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (loading) {
    return (
      <div className="lg:grid lg:grid-cols-10 gap-4">
        <div className="lg:col-span-2">
          <select className="lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option></option>
          </select>
          <div className="hidden lg:block">
            <LoadingInputSkeleton />
          </div>
        </div>
        <div className="lg:col-span-8">
          <LoadingInputSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-10 gap-4">
      <div className="lg:col-span-2">
        <select
          className="lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => setCurrentStep(parseInt(e.target.value))}
          value={currentStep}
        >
          {steps.map((step, index) => (
            <option key={index} value={index}>
              {showStepName ? step.stepName : `Step ${index + 1}`}
            </option>
          ))}
        </select>
        <div className="scroll-hidden hidden lg:block">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`py-2 px-4 mt-5 cursor-pointer rounded ${
                currentStep === index
                  ? "bg-blue-500 text-white"
                  : "text-blue-500 hover:bg-gray-100 border border-gray-300"
              } ${
                showStepName
                  ? "text-wrap break-words"
                  : "rounded-full w-8 h-8 flex items-center justify-center"
              }`}
            >
              {showStepName ? step.stepName : index + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={currentStep === index ? "block" : "hidden"}
          >
            {step.component}
          </div>
        ))}
      </div>
    </div>
  );
};
