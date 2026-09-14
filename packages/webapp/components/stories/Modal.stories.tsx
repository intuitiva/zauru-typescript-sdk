import { useState } from "react";
import { ProgressModal } from "../src/Modal/ProgressModal.js";
import { Button } from "../src/Buttons/Button.js";

export const Progress = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button type="button" title="Abrir progreso" onClickSave={() => setOpen(true)} />
      <ProgressModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Procesando"
        current={3}
        total={10}
        currentItem="Item 3"
        description="Trabajo de ejemplo"
      />
    </>
  );
};
