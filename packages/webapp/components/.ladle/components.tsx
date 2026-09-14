import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import "../src/tailwind.css";

const playgroundStore = configureStore({
  reducer: {
    formValidation: (
      state = { formValidations: {} as Record<string, unknown> }
    ) => state,
  },
});

export const Provider = ({ children }: { children: ReactNode }) => {
  const methods = useForm({ mode: "onChange" });

  return (
    <ReduxProvider store={playgroundStore}>
      <FormProvider {...methods}>
        <MemoryRouter>
          <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
            {children}
          </div>
        </MemoryRouter>
      </FormProvider>
    </ReduxProvider>
  );
};
