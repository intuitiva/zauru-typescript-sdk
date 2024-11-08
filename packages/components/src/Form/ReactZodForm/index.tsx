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
    } else {
      // If no onSubmit is provided, use Remix's submit function
      submit(event?.target as HTMLFormElement, { method });
    }
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
