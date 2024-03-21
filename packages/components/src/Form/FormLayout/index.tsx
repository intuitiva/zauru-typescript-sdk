import { Form, type FormMethod } from "@remix-run/react";
import { type ReactNode } from "react";
import { ButtonSectionContainer } from "src";

type Props = {
  formId: string;
  title?: string;
  children: ReactNode;
  buttons?: ReactNode;
  method?: FormMethod;
};

export const FormLayout = (props: Props) => {
  const { title, children, buttons, method, formId } = props;

  return (
    <Form id={formId} name={formId} method={method ?? "post"} key={formId}>
      {title && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {title}
        </label>
      )}
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
          {/* AQUÍ VAN EL CONTENIDO DEL FORM */}
          {children}
        </div>
        {buttons && (
          <ButtonSectionContainer>
            {/* AQUÍ VAN LOS BOTONES */}
            {buttons}
          </ButtonSectionContainer>
        )}
      </div>
    </Form>
  );
};
