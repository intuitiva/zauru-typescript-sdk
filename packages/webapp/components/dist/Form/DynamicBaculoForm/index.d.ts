import { FormGraphQL, FormSubmissionValueGraphQL } from "@zauru-sdk/types";
import { z } from "zod";
export declare const getDynamicBaculoFormSchema: (form?: FormGraphQL, extraFieldValidations?: {
    [key: string]: any;
}) => z.ZodAny | z.ZodObject<{
    [x: string]: any;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    [x: string]: any;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    [x: string]: any;
}, z.ZodTypeAny, "passthrough">>;
type Props = {
    form?: FormGraphQL;
    options?: {
        showTitle: boolean;
        showDescription: boolean;
    };
    defaultValues?: FormSubmissionValueGraphQL[];
    namesStr?: string;
    showingRules?: {
        name: string;
        show: boolean;
    }[];
    readOnly?: boolean;
    zauruBaseURL?: string;
    setProcessing?: (processing: boolean) => void;
};
export declare function DynamicBaculoForm(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
