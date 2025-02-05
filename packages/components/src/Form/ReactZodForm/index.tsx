import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useSubmit } from "@remix-run/react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodSchema } from "zod";
import React from "react";

type Props = {
  children: React.ReactNode;
  schema?: ZodSchema;
  onSubmit?: SubmitHandler<FieldValues>;
  id?: string;
  method?: "post" | "put" | "delete" | "patch";
  className?: string;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
};

const emptySchema = z.any();

export const ReactZodForm = (props: Props) => {
  const {
    children,
    method = "post",
    schema = emptySchema,
    onSubmit,
    id,
    className,
    encType,
  } = props;

  const submit = useSubmit();
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const handleSubmit: SubmitHandler<FieldValues> = (data, event) => {
    if (onSubmit) {
      onSubmit(data, event);
      return;
    }

    const form = event?.target as HTMLFormElement;
    const nativeEvent = event?.nativeEvent as SubmitEvent;

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

  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(handleSubmit)}
        method={method}
        id={id}
        className={className}
        encType={encType}
      >
        {children}
      </Form>
    </FormProvider>
  );
};
