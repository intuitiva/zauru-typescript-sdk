import { TextField } from "../TextField/index.js";
import { YesNo } from "../YesNo/index.js";
import { TextArea } from "../TextArea/index.js";
import { SelectField } from "../SelectField/index.js";
import { FileUploadField } from "../FileUpload/index.js";
import { FormDatePicker } from "../DatePicker/index.js";
import { FormTimePicker } from "../TimePicker/index.js";
import {
  FormFieldGraphQL,
  FormGraphQL,
  FormSubmissionValueGraphQL,
  GenericDynamicTableColumn,
  SelectFieldOption,
} from "@zauru-sdk/types";
import { GenericDynamicTable } from "../../DynamicTable/GenericDynamicTable.js";
import { getDepSelectOptions, getMunSelectOptions } from "@zauru-sdk/common";
import { StaticAlert } from "../../Alerts/index.js";
import { SubContainer } from "../../Containers/index.js";
import { LineSeparator } from "../../LineSeparator/index.js";
import { z } from "zod";

export const getDynamicBaculoFormSchema = (
  form?: FormGraphQL,
  extraFieldValidations: { [key: string]: any } = {}
) => {
  if (!form) {
    return z.any();
  }

  let fieldValidations = { ...extraFieldValidations };
  form.settings_form_fields.forEach((field) => {
    if (field.required) {
      if (field.field_type === "yes_no") {
        //se ignora la validación
      } else {
        // Si el campo es requerido, se debe tener al menos un carácter
        fieldValidations = {
          ...fieldValidations,
          [`${field.form_id}_${field.id}`]: z.coerce
            .string()
            .min(1, `Este campo es requerido.`),
        };
      }
    }
  });

  return z.object(fieldValidations).passthrough(); // Iniciar con un esquema que deja pasar todo.
};

type Props = {
  form?: FormGraphQL;
  options?: { showTitle: boolean; showDescription: boolean };
  defaultValues?: FormSubmissionValueGraphQL[];
  namesStr?: string;
  showingRules?: { name: string; show: boolean }[];
  readOnly?: boolean;
  zauruBaseURL?: string;
  setProcessing?: (processing: boolean) => void;
};

export function DynamicBaculoForm(props: Props) {
  const {
    form,
    options = { showDescription: false, showTitle: false },
    namesStr = "",
    defaultValues = [],
    showingRules = [],
    readOnly = false,
    zauruBaseURL = "",
    setProcessing,
  } = props;

  if (!form) {
    return (
      <StaticAlert
        title="No se encontró el formulario dinámico"
        description={`Ocurrió un error encontrando el formulario, contacte al administrador con este mensaje de error.`}
        type="info"
      />
    );
  }

  const renderFieldComponent = (field: Partial<FormFieldGraphQL>) => {
    const defaultValue = defaultValues?.find(
      (x) => x.settings_form_field.print_var_name === field.print_var_name
    );

    if (
      field.print_var_name?.toLowerCase() === "firma_cliente" &&
      field.field_type === "image"
    ) {
      return (
        <FileUploadField
          key={field.id}
          title={`FIRMA: ${field.required ? "*" : ""}${field.name}`}
          name={`${namesStr}${field.form_id}_${field.id}`}
          hint={field.hint}
          readOnly={readOnly}
          defaultValue={defaultValue?.value}
          zauruBaseURL={zauruBaseURL}
          setProcessing={setProcessing}
          signature
        />
      );
    }

    switch (field.field_type) {
      case "zauru_data":
        return null;
      case "fixed_rows_table":
      case "fixed_columns_table": {
        const columns: GenericDynamicTableColumn[] =
          field.settings_form_field_table_headers?.map((x) => {
            return {
              label: x.name,
              name: `${namesStr}${x.id}_${field.id}`,
              type: x.cell_type === "yes_no" ? "checkbox" : "textField",
            } as GenericDynamicTableColumn;
          }) ?? [];
        return (
          <SubContainer key={field.id} title={field.name}>
            <GenericDynamicTable name="fixed_columns_table" columns={columns} />
          </SubContainer>
        );
      }
      case "hour":
        return (
          <FormTimePicker
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            disabled={readOnly}
            defaultValue={defaultValue?.value}
          />
        );
      case "date":
        return (
          <FormDatePicker
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            disabled={readOnly}
            defaultValue={defaultValue?.value}
          />
        );
      case "file":
        return (
          <FileUploadField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            readOnly={readOnly}
            defaultValue={defaultValue?.value}
            download={true}
            zauruBaseURL={zauruBaseURL}
            setProcessing={setProcessing}
          />
        );
      case "image":
        return (
          <FileUploadField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            showAvailableTypes
            fileTypes={["png", "jpg", "jpeg"]}
            readOnly={readOnly}
            defaultValue={defaultValue?.value}
            zauruBaseURL={zauruBaseURL}
            setProcessing={setProcessing}
          />
        );
      case "pdf":
        return (
          <FileUploadField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            showAvailableTypes
            fileTypes={["pdf"]}
            readOnly={readOnly}
            defaultValue={defaultValue?.value}
            download={true}
            zauruBaseURL={zauruBaseURL}
            setProcessing={setProcessing}
          />
        );
      case "email":
      case "url":
      case "text":
      case "currency":
      case "country":
        return (
          <TextField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            defaultValue={defaultValue?.value ?? field.default_value}
            disabled={readOnly}
          />
        );
      case "percentage":
      case "number":
        return (
          <TextField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            defaultValue={defaultValue?.value ?? field.default_value}
            type="number"
            disabled={readOnly}
          />
        );
      case "yes_no":
        return (
          <YesNo
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            disabled={readOnly}
            defaultValue={
              field.default_value === "true" || defaultValue?.value === "true"
            }
          />
        );
      case "section":
        return (
          <div key={field.id}>
            <LineSeparator />
            <h3 className="mb-10 text-3xl font-bold leading-8 text-gray-900">
              {field.name}
            </h3>
          </div>
        );
      case "multi_line_text":
        return (
          <TextArea
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            defaultValue={defaultValue?.value ?? field.default_value}
            hint={field.hint}
            disabled={readOnly}
          />
        );
      case "gt_departamentos": {
        const optionsDep = getDepSelectOptions();
        return (
          <SelectField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            isClearable={!field.required}
            options={optionsDep}
            disabled={readOnly}
            defaultValue={optionsDep.find(
              (x) => x.value === defaultValue?.value
            )}
          />
        );
      }
      case "gt_municipios": {
        const options = getMunSelectOptions();

        return (
          <SelectField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            isClearable={!field.required}
            options={options}
            disabled={readOnly}
            defaultValue={options.find((x) => x.value === defaultValue?.value)}
          />
        );
      }
      case "single_select_options": {
        const formFieldOptions =
          field.settings_form_field_options?.map((x) => {
            return { label: x.label, value: x.value } as SelectFieldOption;
          }) ?? [];

        return (
          <SelectField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            isClearable={!field.required}
            options={formFieldOptions}
            disabled={readOnly}
            defaultValue={formFieldOptions.find(
              (x) => x.value === defaultValue?.value
            )}
          />
        );
      }
      case "multi_select_options": {
        const formFieldOptions2 =
          field.settings_form_field_options?.map((x) => {
            return { label: x.label, value: x.value } as SelectFieldOption;
          }) ?? [];

        const defaultValuesMulti = (() => {
          const values =
            defaultValue?.value?.split(",").map((str) => str.trim()) ?? [];
          return formFieldOptions2.filter((x) => values.includes(x.value));
        })();

        return (
          <SelectField
            key={field.id}
            title={`${field.required ? "*" : ""}${field.name}`}
            name={`${namesStr}${field.form_id}_${field.id}`}
            hint={field.hint}
            isClearable={!field.required}
            isMulti
            options={formFieldOptions2}
            defaultValueMulti={defaultValuesMulti}
            disabled={readOnly}
          />
        );
      }
      default:
        return (
          <div key={field.id}>
            Componente no encontrado para: {field.field_type}
          </div>
        ); // o algún componente por defecto si lo prefieres
    }
  };

  const renderFields = () => {
    const fields = form.settings_form_fields;
    return (
      <div className="flex flex-wrap gap-4 items-stretch space-y-4">
        {fields.map((field) => {
          const rule = showingRules.find((x) => x.name === field.name);
          if (rule && !rule.show) return null;

          const renderedField = renderFieldComponent(field);
          if (!renderedField) return null;

          const isSectionField = field.field_type === "section";

          return (
            <div
              key={field.id}
              className={
                isSectionField
                  ? "w-full"
                  : "flex flex-col h-full flex-grow min-w-[250px] max-w-full sm:max-w-[48%] lg:max-w-[24%]"
              }
            >
              {renderedField}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <SubContainer
      title={options?.showTitle ? form.name : undefined}
      description={options?.showDescription ? form.description : undefined}
    >
      {renderFields()}
    </SubContainer>
  );
}
