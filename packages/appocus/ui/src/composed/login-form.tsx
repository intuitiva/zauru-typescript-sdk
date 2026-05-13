"use client";

import * as React from "react";
import { Form } from "react-router";
import { useAppocusConfig } from "@appocus/config";
import { cn } from "../lib/utils.js";
import { Button } from "../primitives/button.js";
import { Card, CardContent } from "../primitives/card.js";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "../primitives/field.js";

export interface LoginFormProps extends React.ComponentProps<"div"> {
  isLoading?: boolean;
  mode?: "login" | "logout";
  title?: string;
  loadingText?: string;
  buttonText?: string;
}

/**
 * Two-column card with a Zauru OAuth submit button. Pulls branding strings
 * (title, logo alt text, mailto link…) from `@appocus/config` so every app
 * gets its own copy without touching the component.
 */
export function LoginForm({
  className,
  isLoading = false,
  mode = "login",
  title: titleProp,
  loadingText: loadingTextProp,
  buttonText: buttonTextProp,
  ...props
}: LoginFormProps) {
  const { login, assets, support } = useAppocusConfig();
  const title = titleProp ?? login.defaultTitle;
  const loadingText = loadingTextProp ?? login.loadingText;
  const buttonText = buttonTextProp ?? login.buttonText;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form
            method="POST"
            action={mode === "login" ? "/login" : "/logout"}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl mb-4 font-bold">{title}</h1>
                <img
                  src={assets.logo}
                  alt={login.logoAlt}
                  className="h-20 w-auto object-contain"
                />
              </div>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card" />
              <Field>
                <Button
                  className="w-full cursor-pointer"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? loadingText : buttonText}
                </Button>
              </Field>
              {mode === "login" && (
                <FieldDescription className="text-center">
                  {login.accountPrompt}
                  <a
                    href={support.accountRequestMailtoHref}
                    className="text-primary hover:underline"
                  >
                    {login.accountLinkLabel}
                  </a>
                </FieldDescription>
              )}
            </FieldGroup>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={assets.loginHero}
              alt={login.heroAlt}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
