import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { LoadingInputSkeleton } from "./../index";
export const StepWizardComponent = ({ steps, showStepName = false, loading = false, }) => {
    const [currentStep, setCurrentStep] = useState(0);
    if (loading) {
        return (_jsxs("div", { className: "lg:grid lg:grid-cols-10 gap-4", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("select", { className: "lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", children: _jsx("option", {}) }), _jsx("div", { className: "hidden lg:block", children: _jsx(LoadingInputSkeleton, {}) })] }), _jsx("div", { className: "lg:col-span-8", children: _jsx(LoadingInputSkeleton, {}) })] }));
    }
    return (_jsxs("div", { className: "lg:grid lg:grid-cols-10 gap-4", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("select", { className: "lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", onChange: (e) => setCurrentStep(parseInt(e.target.value)), value: currentStep, children: steps.map((step, index) => (_jsx("option", { value: index, children: showStepName ? step.stepName : `Step ${index + 1}` }, index))) }), _jsx("div", { className: "scroll-hidden hidden lg:block", children: steps.map((step, index) => (_jsx("div", { onClick: () => setCurrentStep(index), className: `py-2 px-4 mt-5 cursor-pointer rounded ${currentStep === index
                                ? "bg-blue-500 text-white"
                                : "text-blue-500 hover:bg-gray-100 border border-gray-300"} ${showStepName
                                ? "text-wrap break-words"
                                : "rounded-full w-8 h-8 flex items-center justify-center"}`, children: showStepName ? step.stepName : index + 1 }, index))) })] }), _jsx("div", { className: "lg:col-span-8", children: steps.map((step, index) => (_jsx("div", { className: currentStep === index ? "block" : "hidden", children: step.component }, index))) })] }));
};
