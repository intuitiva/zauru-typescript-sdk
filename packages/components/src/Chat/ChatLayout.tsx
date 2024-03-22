import React, { useRef, useState } from "react";
import { TextField } from "../Form";
import { Form } from "@remix-run/react";
import { FormDocumentType } from "@zauru-sdk/types";
import { LoadingInputSkeleton } from "./../index";
import {
  AttachmentIconSVG,
  SendMessageIcon,
  SpinnerSvg,
} from "@zauru-sdk/icons";

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

const ChatLayout: React.FC<ChatLayoutProps> = ({
  children,
  sendingMessage = false,
  formConfig = undefined,
}) => {
  const refAttachment = useRef<HTMLInputElement>(null);
  const [formValues, setFormValues] = useState<{ image: any }>({ image: null });

  const handleAttachmentClick = () => {
    if (refAttachment.current) {
      refAttachment.current.click();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col-reverse overflow-y-auto p-4 bg-gray-100 border border-gray-200 rounded-lg grow max-h-[65vh]">
        {children}
      </div>
      <Form id="formRef" encType="multipart/form-data" method="post">
        {formConfig ? (
          <>
            <TextField
              hidden
              name="reference"
              defaultValue={formConfig.reference ?? ""}
            />
            <TextField
              hidden
              name="form_id"
              defaultValue={formConfig.form_id}
            />
            <TextField
              hidden
              name="document_id"
              defaultValue={formConfig.document_id}
            />
            <TextField
              hidden
              name="document_type"
              defaultValue={formConfig.document_type}
            />
            <TextField
              hidden
              name="id_number"
              defaultValue={formConfig?.id_number ?? ""}
            />
          </>
        ) : (
          <></>
        )}
        <div className="mt-4 flex">
          {sendingMessage ? (
            <LoadingInputSkeleton />
          ) : (
            <input
              name={`message${
                formConfig?.messageFieldId
                  ? `_${formConfig?.messageFieldId}`
                  : ""
              }`}
              type="text"
              placeholder="Escribe un mensaje..."
              className="form-input px-4 py-2 border border-gray-300 rounded-l-lg grow"
            />
          )}
          <button
            onClick={handleAttachmentClick}
            className={`${
              formValues?.image ? "bg-blue-500" : ""
            } hover:bg-blue-700 text-white font-bold py-2 px-4`}
            type="button"
          >
            <AttachmentIconSVG />
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r-lg"
            type="submit"
            name="action"
            value="sendMessage"
          >
            {sendingMessage ? <SpinnerSvg /> : <SendMessageIcon />}
          </button>
        </div>
        <input
          ref={refAttachment}
          hidden
          name={`attachment${
            formConfig?.attachmentFieldId
              ? `_${formConfig?.attachmentFieldId}`
              : ""
          }`}
          type="file"
          accept=".jpg, .png, .jpeg, .png"
          onChange={(e) => {
            if (e.target.value && e.target.value !== "") {
              setFormValues({ ...formValues, image: e.target.value });
            } else {
              setFormValues({ ...formValues, image: null });
            }
          }}
        />
      </Form>
    </div>
  );
};

export default ChatLayout;
