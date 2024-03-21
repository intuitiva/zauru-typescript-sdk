import React from "react";
import { FormDocumentType } from "@zauru-sdk/types";
interface ChatLayoutProps {
    children?: React.ReactNode;
    sendingMessage?: boolean;
    formConfig?: {
        document_type: FormDocumentType;
        form_id: number;
        document_id: number;
        id_number?: string;
        reference?: string;
        attachmentFieldId: number;
        messageFieldId: number;
    };
}
export declare const ChatLayout: React.FC<ChatLayoutProps>;
export {};
