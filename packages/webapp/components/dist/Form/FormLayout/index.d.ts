import { type FormMethod } from "@remix-run/react";
import { type ReactNode } from "react";
type Props = {
    formId: string;
    title?: string;
    children: ReactNode;
    buttons?: ReactNode;
    method?: FormMethod;
};
export declare const FormLayout: (props: Props) => import("react/jsx-runtime").JSX.Element;
export {};
