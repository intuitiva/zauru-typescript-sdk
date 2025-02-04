import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { createFormSubmission, getInvoiceFormSubmissionsByInvoiceId, getLastInvoiceFormSubmission, getVariablesByName, } from "@zauru-sdk/services";
export function transformFormSubmitObject(input) {
    const form_submission_values = [];
    const isJsonArray = (value) => {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed);
        }
        catch (e) {
            return false;
        }
    };
    // Itera sobre las propiedades del objeto
    for (const key in input) {
        // Utiliza una expresión regular para detectar claves que coinciden con el patrón 'word_number'
        const match = key.match(/^(.+?)_(\d+)$/);
        if (match && !key.includes("deleted")) {
            const [, , form_field_id] = match;
            let newObj = {
                form_field_id,
                groups_path: "[]",
                value: "",
            };
            if (input[key] instanceof File) {
                const fileType = input[key].type;
                if (input[key]?.size > 0) {
                    // Verifica si el archivo es una imagen
                    if (fileType.startsWith("image/")) {
                        newObj["image"] = input[key];
                    }
                    // Verifica si el archivo es un PDF
                    else if (fileType === "application/pdf") {
                        newObj["pdf"] = input[key];
                    }
                    // Cualquier otro tipo de archivo
                    else {
                        newObj["file"] = input[key];
                    }
                }
            }
            else if (isJsonArray(input[key])) {
                const tableJsonArray = JSON.parse(input[key]);
                if (tableJsonArray.length > 0) {
                    const form_table_values_attributes = [];
                    tableJsonArray.forEach((x, index) => {
                        for (const keyTable in x) {
                            const matchTableId = keyTable.match(/^(.+?)_(\d+)$/);
                            if (matchTableId) {
                                const [, , table_header_id] = matchTableId;
                                form_table_values_attributes.push({
                                    table_header_id: Number(table_header_id),
                                    value: x[keyTable],
                                    row_or_column_number: index + 1,
                                });
                            }
                        }
                    });
                    newObj["form_table_values_attributes"] = arrayToObject(form_table_values_attributes);
                    delete newObj.value;
                }
            }
            else {
                newObj["value"] = input[key];
            }
            form_submission_values.push(newObj);
        }
    }
    return {
        form_submission_values_attributes: arrayToObject(form_submission_values),
        form_id: input.form_id,
        document_id: input.document_id,
        zid: input.zid,
        document_type: input.document_type,
        reference: input.reference,
        id_number: input.id_number ?? "",
    };
}
export function transformResultadosFormData(input, document_id) {
    const resultMap = {};
    for (const [key, value] of Object.entries(input)) {
        const parts = key.split("_");
        if (parts.length === 3 &&
            (parts[2] === "zid" || parts[2] === "reference")) {
            const [index, item_id, specialField] = parts;
            const compositeKey = `${index}_${item_id}`;
            if (!resultMap[compositeKey]) {
                resultMap[compositeKey] = {
                    index: parseInt(index),
                    item_id: parseInt(item_id),
                    document_id,
                    fields: [],
                };
            }
            if (specialField === "zid") {
                resultMap[compositeKey].zid = value;
            }
            else if (specialField === "reference") {
                resultMap[compositeKey].reference = value;
            }
            continue;
        }
        if (parts.length !== 4)
            continue;
        if (parts.some((part) => isNaN(parseInt(part, 10))))
            continue;
        const [index, item_id, form_id, field_id] = parts.map((part) => parseInt(part, 10));
        const compositeKey = `${index}_${item_id}`;
        if (!resultMap[compositeKey]) {
            resultMap[compositeKey] = {
                index,
                item_id,
                form_id,
                document_id,
                fields: [],
            };
        }
        resultMap[compositeKey].fields.push({ [field_id]: value });
        resultMap[compositeKey].form_id = form_id;
    }
    return Object.values(resultMap);
}
/**
 *
 * @param data
 * @returns
 */
export const createRespuestaFormSubmission = (headers, data) => {
    return handlePossibleAxiosErrors(async () => {
        const form_submission_values = [];
        for (const value of data.fields) {
            const form_field_id = Object.keys(value)[0];
            const associatedValue = value[form_field_id];
            form_submission_values.push({
                form_field_id,
                value: associatedValue,
                groups_path: "[]",
            });
        }
        const sendBody = {
            form_id: data.form_id,
            reference: `${data.index}_${data.item_id};${data?.reference}`,
            document_type: "invoice",
            document_id: data.document_id,
            form_submission_values_attributes: arrayToObject(form_submission_values),
            zid: data.zid,
        };
        const response = await createFormSubmission(headers, sendBody);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar crear la respuesta de formulario: ${data}`);
        }
        return true;
    });
};
/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getLastMuestra = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_muestras_form_zid } = await getVariablesByName(headers, session, ["lab_muestras_form_zid"]);
        const response = await getLastInvoiceFormSubmission(session, {
            formZid: Number(lab_muestras_form_zid),
        });
        if (response.error || !response.data) {
            throw new Error(`Ocurrió un error al intentar obtener la última muestra registrada: ${response.userMsg}`);
        }
        return response.data;
    });
};
export const getMuestrasByInvoiceId = (headers, session, invoice_id) => {
    return handlePossibleAxiosErrors(async () => {
        const { lab_muestras_form_zid } = await getVariablesByName(headers, session, ["lab_muestras_form_zid"]);
        const response = await getInvoiceFormSubmissionsByInvoiceId(session, invoice_id, { formZid: Number(lab_muestras_form_zid) });
        if (response.error || !response.data) {
            throw new Error(`Ocurrió un error al intentar obtener las muestras de la remisión: ${response.userMsg}`);
        }
        return response.data;
    });
};
