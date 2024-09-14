"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicBaculoForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const index_js_1 = require("../TextField/index.js");
const index_js_2 = require("../FieldContainer/index.js");
const index_js_3 = require("../FieldContainer/index.js");
const index_js_4 = require("../YesNo/index.js");
const index_js_5 = require("../TextArea/index.js");
const index_js_6 = require("../SelectField/index.js");
const index_js_7 = require("../FileUpload/index.js");
const index_js_8 = require("../DatePicker/index.js");
const index_js_9 = require("../TimePicker/index.js");
const GenericDynamicTable_js_1 = require("../../DynamicTable/GenericDynamicTable.js");
const common_1 = require("@zauru-sdk/common");
const index_js_10 = require("../../Alerts/index.js");
const index_js_11 = require("../../Containers/index.js");
const index_js_12 = require("../../LineSeparator/index.js");
function DynamicBaculoForm(props) {
    const { form, options = { showDescription: false, showTitle: false }, formName = "", namesStr = "", defaultValues = [], showingRules = [], readOnly = false, } = props;
    if (!form) {
        return ((0, jsx_runtime_1.jsx)(index_js_10.StaticAlert, { title: "No se encontr\u00F3 el formulario din\u00E1mico", description: `Ocurrió un error encontrando el formulario para ${formName}, contacte al administrador con este mensaje de error.`, type: "info" }));
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
                return ((0, jsx_runtime_1.jsx)(index_js_11.SubContainer, { title: field.name, children: (0, jsx_runtime_1.jsx)(GenericDynamicTable_js_1.GenericDynamicTable, { name: "fixed_columns_table", columns: columns }) }, field.id));
            }
            case "zauru_data":
                return ((0, jsx_runtime_1.jsx)(index_js_1.TextField, { title: `${field.required ? "*" : ""}${field.name}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, disabled: true }, field.id));
            case "hour":
                return ((0, jsx_runtime_1.jsx)(index_js_9.FormTimePicker, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "date":
                return ((0, jsx_runtime_1.jsx)(index_js_8.FormDatePicker, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "file":
                return ((0, jsx_runtime_1.jsx)(index_js_7.FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, disabled: readOnly, defaultValue: defaultValue?.value, download: true }, field.id));
            case "image":
                return ((0, jsx_runtime_1.jsx)(index_js_7.FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, showAvailableTypes: true, fileTypes: ["png", "jpg", "jpeg"], disabled: readOnly, defaultValue: defaultValue?.value }, field.id));
            case "pdf":
                return ((0, jsx_runtime_1.jsx)(index_js_7.FileUploadField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, showAvailableTypes: true, fileTypes: ["pdf"], disabled: readOnly, defaultValue: defaultValue?.value, download: true }, field.id));
            case "email":
            case "url":
            case "text":
            case "currency":
            case "country":
                return ((0, jsx_runtime_1.jsx)(index_js_1.TextField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, disabled: readOnly }, field.id));
            case "percentage":
            case "number":
                return ((0, jsx_runtime_1.jsx)(index_js_1.TextField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, defaultValue: defaultValue?.value ?? field.default_value, type: "number", disabled: readOnly }, field.id));
            case "yes_no":
                return ((0, jsx_runtime_1.jsx)(index_js_4.YesNo, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, disabled: readOnly, defaultValue: field.default_value === "true" || defaultValue?.value === "true" }, field.id));
            case "section":
                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(index_js_12.LineSeparator, {}), (0, jsx_runtime_1.jsx)("h3", { className: "mb-10 text-3xl font-bold leading-8 text-gray-900", children: field.name })] }, field.id));
            case "multi_line_text":
                return ((0, jsx_runtime_1.jsx)(index_js_5.TextArea, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, defaultValue: defaultValue?.value ?? field.default_value, hint: field.hint, disabled: readOnly }, field.id));
            case "gt_departamentos": {
                const optionsDep = (0, common_1.getDepSelectOptions)();
                return ((0, jsx_runtime_1.jsx)(index_js_6.SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: optionsDep, disabled: readOnly, defaultValue: optionsDep.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "gt_municipios": {
                const options = (0, common_1.getMunSelectOptions)();
                return ((0, jsx_runtime_1.jsx)(index_js_6.SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: options, disabled: readOnly, defaultValue: options.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "single_select_options": {
                const formFieldOptions = field.settings_form_field_options?.map((x) => {
                    return { label: x.label, value: x.value };
                }) ?? [];
                return ((0, jsx_runtime_1.jsx)(index_js_6.SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, options: formFieldOptions, disabled: readOnly, defaultValue: formFieldOptions.find((x) => x.value === defaultValue?.value) }, field.id));
            }
            case "multi_select_options": {
                const formFieldOptions2 = field.settings_form_field_options?.map((x) => {
                    return { label: x.label, value: x.value };
                }) ?? [];
                const defaultValuesMulti = (() => {
                    const values = defaultValue?.value?.split(",").map((str) => str.trim()) ?? [];
                    return formFieldOptions2.filter((x) => values.includes(x.value));
                })();
                return ((0, jsx_runtime_1.jsx)(index_js_6.SelectField, { title: `${field.required ? "*" : ""}${field.name}`, name: `${namesStr}${field.form_id}_${field.id}`, hint: field.hint, isClearable: !field.required, isMulti: true, options: formFieldOptions2, defaultValueMulti: defaultValuesMulti, disabled: readOnly }, field.id));
            }
            default:
                return ((0, jsx_runtime_1.jsxs)("div", { children: ["Componente no encontrado para: ", field.field_type] }, field.id)); // o algún componente por defecto si lo prefieres
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
                        fieldGroups.push((0, jsx_runtime_1.jsx)(index_js_3.DoubleFieldContainer, { children: tempGroup }, i));
                    }
                    else if (tempGroup.length === 3) {
                        fieldGroups.push((0, jsx_runtime_1.jsx)(index_js_2.TripleFieldContainer, { children: tempGroup }, i));
                    }
                    fieldGroups.push(renderedField);
                    tempGroup = [];
                }
                else if (isLastField) {
                    if (tempGroup.length === 1) {
                        fieldGroups.push(tempGroup[0]);
                    }
                    else if (tempGroup.length === 2) {
                        fieldGroups.push((0, jsx_runtime_1.jsx)(index_js_3.DoubleFieldContainer, { children: tempGroup }, i));
                    }
                    else if (tempGroup.length === 3) {
                        fieldGroups.push((0, jsx_runtime_1.jsx)(index_js_2.TripleFieldContainer, { children: tempGroup }, i));
                    }
                    tempGroup = [];
                }
                else if (tempGroup.length === 3) {
                    // Si hay 3 elementos en el grupo temporal y el siguiente campo no es 'section', se agrega a fieldGroups
                    fieldGroups.push((0, jsx_runtime_1.jsx)(index_js_2.TripleFieldContainer, { children: tempGroup }, i));
                    tempGroup = [];
                }
            }
        });
        return fieldGroups;
    };
    return ((0, jsx_runtime_1.jsx)(index_js_11.SubContainer, { title: options?.showTitle ? form.name : undefined, description: options?.showDescription ? form.description : undefined, children: renderFields() }));
}
exports.DynamicBaculoForm = DynamicBaculoForm;
