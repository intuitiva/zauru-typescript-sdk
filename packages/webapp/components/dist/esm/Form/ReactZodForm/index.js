import { jsx as _jsx } from "react/jsx-runtime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import { FormProvider, useForm, } from "react-hook-form";
import { z } from "zod";
const emptySchema = z.any();
export const ReactZodForm = (props) => {
    const { children, method = "post", schema = emptySchema, onSubmit, id, className, encType, } = props;
    const submit = useSubmit();
    const methods = useForm({
        resolver: zodResolver(schema),
        mode: "onSubmit",
    });
    const handleSubmit = (data, event) => {
        if (onSubmit) {
            onSubmit(data, event);
            return;
        }
        const form = event?.target;
        const nativeEvent = event?.nativeEvent;
        // Armamos el FormData a partir del propio <form>
        const formData = new FormData(form);
        // Detectamos el botón que disparó el submit (submitter),
        // en caso de que tenga un name/value, lo agregamos al formData
        const submitter = nativeEvent.submitter;
        if (submitter instanceof HTMLButtonElement && submitter.name) {
            formData.append(submitter.name, submitter.value);
        }
        submit(formData, { method, encType });
    };
    return (_jsx(FormProvider, { ...methods, children: _jsx(Form, { onSubmit: methods.handleSubmit(handleSubmit), method: method, id: id, className: className, encType: encType, children: children }) }));
};
