"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactZodForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = require("@remix-run/react");
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const emptySchema = zod_2.z.any();
const ReactZodForm = (props) => {
    const { children, method = "post", schema = emptySchema, onSubmit, id, } = props;
    const submit = (0, react_1.useSubmit)();
    const methods = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema),
        mode: "onSubmit",
    });
    const handleSubmit = (data, event) => {
        if (onSubmit) {
            onSubmit(data, event);
        }
        else {
            // If no onSubmit is provided, use Remix's submit function
            submit(event?.target, { method });
        }
    };
    return ((0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, { ...methods, children: (0, jsx_runtime_1.jsx)(react_1.Form, { onSubmit: methods.handleSubmit(handleSubmit), method: method, id: id, children: children }) }));
};
exports.ReactZodForm = ReactZodForm;
exports.default = exports.ReactZodForm;
