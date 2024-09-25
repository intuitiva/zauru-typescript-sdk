import { jsx as _jsx } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { FormProvider, useForm, } from "react-hook-form";
import { z } from "zod";
const emptySchema = z.any();
export const ReactZodForm = (props) => {
    const { children, method = "post", schema = emptySchema, onSubmit, id, className, } = props;
    const submit = useSubmit();
    const methods = useForm({
        resolver: zodResolver(schema),
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
    return (_jsx(FormProvider, { ...methods, children: _jsx(Form, { onSubmit: methods.handleSubmit(handleSubmit), method: method, id: id, className: className, children: children }) }));
};
export default ReactZodForm;
