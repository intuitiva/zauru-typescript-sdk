"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMuestrasByInvoiceId = exports.getLastMuestra = exports.createRespuestaFormSubmission = exports.transformResultadosFormData = exports.transformFormSubmitObject = void 0;
const common_1 = require("@zauru-sdk/common");
const services_1 = require("@zauru-sdk/services");
function transformFormSubmitObject(input) {
    const form_submission_values = [];
    // Itera sobre las propiedades del objeto
    for (const key in input) {
        // Utiliza una expresión regular para detectar claves que coinciden con el patrón 'word_number'
        const match = key.match(/^(.+?)_(\d+)$/);
        if (match) {
            const [, , form_field_id] = match;
            let newObj = {
                form_field_id,
                groups_path: "[]",
            };
            if (input[key] instanceof File) {
                const fileType = input[key].type;
                newObj["value"] = "";
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
            else {
                newObj["value"] = input[key];
            }
            form_submission_values.push(newObj);
        }
    }
    return {
        form_submission_values_attributes: (0, common_1.arrayToObject)(form_submission_values),
        form_id: input.form_id,
        document_id: input.document_id,
        zid: input.zid,
        document_type: input.document_type,
        reference: input.reference,
        id_number: input.id_number ?? "",
    };
}
exports.transformFormSubmitObject = transformFormSubmitObject;
function transformResultadosFormData(input, document_id) {
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
exports.transformResultadosFormData = transformResultadosFormData;
/**
 *
 * @param data
 * @returns
 */
const createRespuestaFormSubmission = (headers, data) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
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
            form_submission_values_attributes: (0, common_1.arrayToObject)(form_submission_values),
            zid: data.zid,
        };
        const response = await (0, services_1.createFormSubmission)(headers, sendBody);
        if (response.error) {
            throw new Error(`Ocurrió un error al intentar crear la respuesta de formulario: ${data}`);
        }
        return true;
    });
};
exports.createRespuestaFormSubmission = createRespuestaFormSubmission;
/**
 *
 * @param headers
 * @param session
 * @returns
 */
const getLastMuestra = (headers, session) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_muestras_form_zid } = await (0, services_1.getVariablesByName)(headers, session, ["lab_muestras_form_zid"]);
        const response = await (0, services_1.getLastInvoiceFormSubmission)(session, {
            formZid: Number(lab_muestras_form_zid),
        });
        if (response.error || !response.data) {
            throw new Error(`Ocurrió un error al intentar obtener la última muestra registrada: ${response.userMsg}`);
        }
        return response.data;
    });
};
exports.getLastMuestra = getLastMuestra;
const getMuestrasByInvoiceId = (headers, session, invoice_id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const { lab_muestras_form_zid } = await (0, services_1.getVariablesByName)(headers, session, ["lab_muestras_form_zid"]);
        const response = await (0, services_1.getInvoiceFormSubmissionsByInvoiceId)(session, invoice_id, { formZid: Number(lab_muestras_form_zid) });
        if (response.error || !response.data) {
            throw new Error(`Ocurrió un error al intentar obtener las muestras de la remisión: ${response.userMsg}`);
        }
        return response.data;
    });
};
exports.getMuestrasByInvoiceId = getMuestrasByInvoiceId;
