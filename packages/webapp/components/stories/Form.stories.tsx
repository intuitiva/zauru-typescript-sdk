import { TextField } from "../src/Form/TextField/index.js";
import { SelectField } from "../src/Form/SelectField/index.js";
import { CheckBox } from "../src/Form/Checkbox/index.js";
import { FormDatePicker } from "../src/Form/DatePicker/index.js";
import { FileUploadField } from "../src/Form/FileUpload/index.js";
import { FormLayout } from "../src/Form/FormLayout/index.js";
import { RadioButtonGroup } from "../src/Form/RadioButtonGroup/index.js";
import { Button } from "../src/Buttons/Button.js";

export const Text = () => (
  <TextField name="nombre" title="Nombre" hint="Campo de texto" required />
);

export const Select = () => (
  <SelectField
    name="agencia"
    title="Agencia"
    options={[
      { label: "Central", value: "1" },
      { label: "Norte", value: "2", disabled: true, disabledLabel: "cerrada" },
      { label: "Sur", value: "3" },
    ]}
  />
);

export const Checkbox = () => (
  <CheckBox name="acepta" label="Acepto los términos" required />
);

export const DatePicker = () => (
  <FormDatePicker name="fecha" title="Fecha" />
);

export const FileUpload = () => (
  <FileUploadField name="archivo" title="Archivo" fileTypes={["pdf", "png"]} />
);

export const Layout = () => (
  <FormLayout
    formId="demo-form"
    title="Formulario de ejemplo"
    buttons={<Button title="Enviar" />}
  >
    <TextField name="campo" title="Campo" />
  </FormLayout>
);

export const Radios = () => (
  <RadioButtonGroup
    name="tipo"
    title="Tipo"
    options={[
      { label: "Uno", value: "1" },
      { label: "Dos", value: "2" },
    ]}
    orientation="horizontal"
  />
);
