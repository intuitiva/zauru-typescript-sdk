import { FieldValues, SubmitHandler } from "react-hook-form";
import { ZodSchema } from "zod";
import React from "react";
type Props = {
    children: React.ReactNode;
    schema?: ZodSchema;
    onSubmit?: SubmitHandler<FieldValues>;
    id?: string;
    method?: "post" | "put" | "delete" | "patch";
};
export declare const ReactZodForm: (props: Props) => import("react/jsx-runtime").JSX.Element;
export default ReactZodForm;