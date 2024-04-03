"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepWizardComponent = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const index_js_1 = require("../Skeletons/index.js");
const StepWizardComponent = ({ steps, showStepName = false, loading = false, }) => {
    const [currentStep, setCurrentStep] = (0, react_1.useState)(0);
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "lg:grid lg:grid-cols-10 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2", children: [(0, jsx_runtime_1.jsx)("select", { className: "lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", children: (0, jsx_runtime_1.jsx)("option", {}) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:block", children: (0, jsx_runtime_1.jsx)(index_js_1.LoadingInputSkeleton, {}) })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-8", children: (0, jsx_runtime_1.jsx)(index_js_1.LoadingInputSkeleton, {}) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "lg:grid lg:grid-cols-10 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lg:col-span-2", children: [(0, jsx_runtime_1.jsx)("select", { className: "lg:hidden mb-5 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md", onChange: (e) => setCurrentStep(parseInt(e.target.value)), value: currentStep, children: steps.map((step, index) => ((0, jsx_runtime_1.jsx)("option", { value: index, children: showStepName ? step.stepName : `Step ${index + 1}` }, index))) }), (0, jsx_runtime_1.jsx)("div", { className: "scroll-hidden hidden lg:block", children: steps.map((step, index) => ((0, jsx_runtime_1.jsx)("div", { onClick: () => setCurrentStep(index), className: `py-2 px-4 mt-5 cursor-pointer rounded ${currentStep === index
                                ? "bg-blue-500 text-white"
                                : "text-blue-500 hover:bg-gray-100 border border-gray-300"} ${showStepName
                                ? "text-wrap break-words"
                                : "rounded-full w-8 h-8 flex items-center justify-center"}`, children: showStepName ? step.stepName : index + 1 }, index))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg:col-span-8", children: steps.map((step, index) => ((0, jsx_runtime_1.jsx)("div", { className: currentStep === index ? "block" : "hidden", children: step.component }, index))) })] }));
};
exports.StepWizardComponent = StepWizardComponent;
