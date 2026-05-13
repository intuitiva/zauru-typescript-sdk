import type { ReactNode } from "react";
import React from "react";
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
export declare const StepWizardComponent: React.FC<StepWizardProps>;
export {};
