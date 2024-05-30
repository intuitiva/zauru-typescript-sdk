import React from "react";
import { createRoot } from "react-dom/client";

export type ModalOption = "OK" | "CANCEL" | null;

type ModalParams = {
  title: string;
  description: React.ReactNode | (() => React.ReactNode);
  okButtonText?: string;
  showOptions?: boolean;
};

export const createModal = ({
  title,
  description,
  okButtonText,
  showOptions = true,
}: ModalParams): Promise<ModalOption> => {
  return new Promise((resolve) => {
    const handleClose = () => {
      resolve(null);
      removeModal();
    };

    const handleOk = () => {
      resolve("OK");
      removeModal();
    };

    const handleCancel = () => {
      resolve("CANCEL");
      removeModal();
    };

    const removeModal = () => {
      document.body.removeChild(modalWrapper);
      document.body.removeChild(modalOverlay);
    };

    const modalWrapper = document.createElement("div");
    modalWrapper.classList.add(
      "justify-center",
      "items-center",
      "flex",
      "overflow-x-hidden",
      "overflow-y-auto",
      "fixed",
      "inset-0",
      "z-50",
      "outline-none",
      "focus:outline-none"
    );

    // Crear capa de fondo detrás del modal
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add(
      "fixed",
      "inset-0",
      "bg-black",
      "opacity-50",
      "z-40"
    );

    document.body.appendChild(modalOverlay);
    document.body.appendChild(modalWrapper);

    const content =
      typeof description === "function" ? description() : description;

    const ModalContent = () => (
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none">
              <span className="close-button" onClick={handleClose}>
                &times;
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">{content}</div>
          {showOptions && (
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="cancel-button text-red-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                className="ok-button bg-emerald-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleOk}
              >
                {okButtonText ?? "Aceptar"}
              </button>
            </div>
          )}
        </div>
      </div>
    );

    const root = createRoot(modalWrapper);
    root.render(<ModalContent />);
  });
};
