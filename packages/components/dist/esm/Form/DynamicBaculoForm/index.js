import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField } from "../TextField/index.js";
import { TripleFieldContainer } from "../FieldContainer/index.js";
import { DoubleFieldContainer } from "../FieldContainer/index.js";
import { YesNo } from "../YesNo/index.js";
import { TextArea } from "../TextArea/index.js";
import { SelectField } from "../SelectField/index.js";
import { FileUploadField } from "../FileUpload/index.js";
import { FormDatePicker } from "../DatePicker/index.js";
import { FormTimePicker } from "../TimePicker/index.js";
import { GenericDynamicTable } from "../../DynamicTable/GenericDynamicTable.js";
import { getDepSelectOptions, getMunSelectOptions } from "@zauru-sdk/common";
import { StaticAlert } from "../../Alerts/index.js";
import { SubContainer } from "../../Containers/index.js";
import { LineSeparator } from "../../LineSeparator/index.js";
export function DynamicBaculoForm(props) {
    const { form, options = { showDescription: false, showTitle: false }, formName = "", namesStr = "", defaultValues = [], showingRules = [], readOnly = false, } = props;
    if (!form) {
        return (_jsx(StaticAlert, { title: "No se encontr\u00F3 el formulario din\u00E1mico", description: `Ocurrió un error encontrando el formulario para ${formName}, contacte al administrador con este mensaje de error.`, type: "info" }));
    }
    const renderFieldComponent = (field) => {
        const defaultValue = defaultValues?.find((x) => x.settings_form_field.print_var_name === field.print_var_name);
        switch (field.field_type) {
            case "fixed_rows_table":
            case "fixed_columns_table": {
                const columns = field.settings_form_field_table_headers?.map((x) => {
                    return {
                        label: x.name,
                        name: `${namesStr}${x.id}_${field.id}`,
                        type: x.cell_type === "yes_no" ? "checkbox" : "textField",
                    };
                }) ?? [];
                return (_jsx(SubContainer, { title: field.name, children: _jsx(GenericDynamicTable, { name: "fixed_columns_table", columns: columns }) }, field.id));
            }
            case "zauru_data":
                return (_jsx(TextField, { title: `${field.required ? "*" : ""}${field.name}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, disabled: true }, field.id));
            case "hour":
                return (_jsx(FormTimePicker, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "date":
                return (_jsx(FormDatePicker, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "file":
                return (_jsx(FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value, download: true }, field.id));
            case "image":
                return (_jsx(FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, showAvailableTypes: true, fileTypes: ["png", "jpg", "jpeg"], disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "pdf":
                return (_jsx(FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, showAvailableTypes: true, fileTypes: ["pdf"], disabled: readOnly, defaultValue: defaultValue?.value, download: true }, field.id));
            case "email":
            case "url":
            case "text":
            case "currency":
            case "country":
                return (_jsx(TextField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, disabled: readOnly }, field.id));
            case "percentage":
            case "number":
                return (_jsx(TextField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, type: "number", disabled: readOnly }, field.id));
            case "yes_no":
                return (_jsx(YesNo, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, disabled: readOnly, defaultValue: field.default_value === "true" || defaultValue?.value === "true" }, field.id));
            case "section":
                return (_jsxs("div", { children: [_jsx(LineSeparator, {}), _jsx("h3", { className: "mb-10 text-3xl font-bold leading-8 text-gray-900", children: field.name })] }, field.id));
            case "multi_line_text":
                return (_jsx(TextArea, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, defaultValue: defaultValue?.value ?? field.default_value, hint: field.hint, disabled: readOnly }, field.id));
            case "gt_departamentos": {
                const optionsDep = getDepSelectOptions();
                return (_jsx(SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: optionsDep, disabled: readOnly, defaultValue: optionsDep.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "gt_municipios": {
                const options = getMunSelectOptions();
                return (_jsx(SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: options, disabled: readOnly, defaultValue: options.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "single_select_options": {
                const formFieldOptions = field.settings_form_field_options?.map((x) => {
                    return { label: x.label, value: x.value };
                }) ?? [];
                return (_jsx(SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: formFieldOptions, disabled: readOnly, defaultValue: formFieldOptions.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "multi_select_options": {
                const formFieldOptions2 = field.settings_form_field_options?.map((x) => {
                    return { label: x.label, value: x.value };
                }) ?? [];
                const defaultValuesMulti = (() => {
                    const values = defaultValue?.value?.split(",").map((str) => str.trim()) ?? [];
                    return formFieldOptions2.filter((x) => values.includes(x.value));
                })();
                return (_jsx(SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, isMulti: true, options: formFieldOptions2, defaultValueMulti: defaultValuesMulti, disabled: readOnly }, field.id));
            }
            default:
                return (_jsxs("div", { children: ["Componente no encontrado para: ", field.field_type] }, field.id)); // o algún componente por defecto si lo prefieres
        }
    };
    const renderFields = () => {
        const fields = form.settings_form_fields;
        const fieldGroups = [];
        let tempGroup = [];
        fields.forEach((field, i) => {
            const rule = showingRules.find((x) => x.name === field.name);
            if (!(rule && !rule.show)) {
                const renderedField = renderFieldComponent(field);
                if (renderedField === null) {
                    return;
                }
                tempGroup.push(renderedField);
                const isLastField = i === fields.length - 1;
                const isSectionField = field.field_type === "section";
                if (isSectionField) {
                    tempGroup.pop();
                    if (tempGroup.length === 1) {
                        fieldGroups.push(tempGroup[0]);
                    }
                    else if (tempGroup.length === 2) {
                        fieldGroups.push(_jsx(DoubleFieldContainer, { children: tempGroup }, i));
                    }
                    else if (tempGroup.length === 3) {
                        fieldGroups.push(_jsx(TripleFieldContainer, { children: tempGroup }, i));
                    }
                    fieldGroups.push(renderedField);
                    tempGroup = [];
                }
                else if (isLastField) {
                    if (tempGroup.length === 1) {
                        fieldGroups.push(tempGroup[0]);
                    }
                    else if (tempGroup.length === 2) {
                        fieldGroups.push(_jsx(DoubleFieldContainer, { children: tempGroup }, i));
                    }
                    else if (tempGroup.length === 3) {
                        fieldGroups.push(_jsx(TripleFieldContainer, { children: tempGroup }, i));
                    }
                    tempGroup = [];
                }
                else if (tempGroup.length === 3) {
                    // Si hay 3 elementos en el grupo temporal y el siguiente campo no es 'section', se agrega a fieldGroups
                    fieldGroups.push(_jsx(TripleFieldContainer, { children: tempGroup }, i));
                    tempGroup = [];
                }
            }
        });
        return fieldGroups;
    };
    return (_jsx(SubContainer, { title: options?.showTitle ? form.name : undefined, description: options?.showDescription ? form.description : undefined, children: renderFields() }));
}
