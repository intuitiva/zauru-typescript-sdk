import { FormGraphQL, FormSubmissionValueGraphQL } from "@zauru-sdk/types";
type Props = {
    formName?: string;
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
};
export declare function DynamicBaculoForm(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
