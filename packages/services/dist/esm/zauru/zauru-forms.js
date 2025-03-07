import { arrayToObject, convertToFormData, handlePossibleAxiosErrors, } from "@zauru-sdk/common";
import { getGraphQLAPIHeaders } from "../common.js";
import { httpGraphQLAPI } from "./httpGraphQL.js";
import { getAllFormsStringQuery, getCaseFormSubmissionsByCaseIdStringQuery, getFormByNameStringQuery, getFormSubmissionByIdStringQuery, getFormsByDocumentTypeStringQuery, getFormsStringQuery, getInvoiceFormSubmissionsByAgencyIdStringQuery, getInvoiceFormSubmissionsByInvoiceIdStringQuery, getLastInvoiceFormSubmissionStringQuery, getMyCaseFormSubmissionsStringQuery, } from "@zauru-sdk/graphql";
import { httpZauru } from "./httpZauru.js";
/**
 * getForms
 */
export async function getForms(session) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getFormsStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.settings_forms;
        return registers;
    });
}
/**
 * getFormByName
 */
export async function getFormByName(session, name) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getFormByNameStringQuery(name),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.settings_forms[0]) {
            throw new Error(`No se encontró ningún formulario con el nombre: ${name} asociado`);
        }
        const register = response?.data?.data?.settings_forms[0];
        return register;
    });
}
/**
 * getAllForms
 */
export async function getAllForms(session, filters = { withSubmissions: false }) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getAllFormsStringQuery({
                withSubmissions: filters.withSubmissions,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.settings_forms;
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const groupedByVersion = registers.reduce((acc, record) => {
            const zid = record.zid;
            if (!acc[zid]) {
                acc[zid] = record;
            }
            return acc;
        }, {});
        const latestVersionRecords = Object.values(groupedByVersion).reverse();
        return latestVersionRecords;
    });
}
/**
 * getFormsByDocumentType
 */
export async function getFormsByDocumentType(session, document_type, filters = {}) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getFormsByDocumentTypeStringQuery(document_type, filters),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.settings_forms;
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const groupedByVersion = registers.reduce((acc, record) => {
            const zid = record.zid;
            if (!acc[zid]) {
                acc[zid] = record;
            }
            return acc;
        }, {});
        const latestVersionRecords = Object.values(groupedByVersion).reverse();
        return latestVersionRecords;
    });
}
/**
 * getFormSubmissionById
 */
export async function getFormSubmissionById(headersZauru, session, id, config = { withFiles: false }) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getFormSubmissionByIdStringQuery(Number(id)),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.settings_form_submissions.length) {
            throw new Error("No se encontró el form submission indicado.");
        }
        const register = response?.data?.data?.settings_form_submissions[0];
        if (config.withFiles) {
            const responseZauru = await httpZauru.get(`/settings/forms/form_submissions/${id}.json`, {
                headers: headersZauru,
            });
            register.settings_form_submission_values =
                register.settings_form_submission_values.map((x) => {
                    if (x.settings_form_field.field_type === "image" ||
                        x.settings_form_field.field_type === "file" ||
                        x.settings_form_field.field_type === "pdf") {
                        x.value = responseZauru.data[x.settings_form_field.print_var_name]
                            ?.toString()
                            .replace(/\\u0026/g, "&");
                    }
                    return x;
                });
        }
        return register;
    });
}
/**
 * getInvoiceFormSubmissionsByAgencyId
 */
export async function getInvoiceFormSubmissionsByAgencyId(session, agency_id, filters) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const queryBuilded = getInvoiceFormSubmissionsByAgencyIdStringQuery(Number(agency_id), {
            seller_id: filters?.seller_id,
            payee_id_number_search: filters?.payee_id_number_search,
            //some_field_value: filters?.some_field_value, //Este filtro ahora lo hago abajo, con código, porque al hacerlo así antes,
            //no funcionaba para cuando se cambiaba un campo, por ejemplo, tengo campo1 con "blabla", si lo cambiaba a campo1 = "bleble",
            //ese campo1 con "blabla" ya iba a ser la versión vieja, pero si buscaba por ese blabla, si me iba a seguir apareciendo.
            bundle_ids: filters?.bundle_ids,
            item_ids: filters?.item_ids,
            startDate: filters?.startDate,
            endDate: filters?.endDate,
            formZid: filters?.formZid,
        });
        const response = await httpGraphQLAPI.post("", {
            query: queryBuilded,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.submission_invoices;
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const groupedByVersion = registers.reduce((acc, record) => {
            const zid = record.settings_form_submission.zid;
            if (!acc[zid]) {
                acc[zid] = record;
            }
            return acc;
        }, {});
        let latestVersionRecords = Object.values(groupedByVersion).reverse();
        //aplico el filtro de somevalue
        if (filters?.some_field_value) {
            latestVersionRecords = latestVersionRecords.filter((x) => x.settings_form_submission.settings_form_submission_values.some((y) => y.value === filters?.some_field_value));
        }
        return latestVersionRecords;
    });
}
/**
 * getMyCaseFormSubmissions
 */
export async function getMyCaseFormSubmissions(headersZauru, session, filters = {}, config = { withFiles: false }) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getMyCaseFormSubmissionsStringQuery(Number(session.get("employee_id")), {
                formZid: filters?.formZid,
                caseId: filters?.caseId,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        let registers = response?.data?.data?.submission_cases;
        if (config.withFiles) {
            registers = await Promise.all(registers.map(async (register) => {
                const responseZauru = await httpZauru.get(`/settings/forms/form_submissions/${register.settings_form_submission.id}.json`, {
                    headers: headersZauru,
                });
                register.settings_form_submission.settings_form_submission_values =
                    register.settings_form_submission.settings_form_submission_values.map((x) => {
                        if (x.settings_form_field.field_type === "image" ||
                            x.settings_form_field.field_type === "file" ||
                            x.settings_form_field.field_type === "pdf") {
                            x.value = responseZauru.data[x.settings_form_field.print_var_name]
                                ?.toString()
                                .replace(/\\u0026/g, "&");
                        }
                        return x;
                    });
                return register;
            }));
        }
        return registers;
    });
}
/**
 * getLastInvoiceFormSubmission
 * @param session
 * @param filters
 * @returns
 */
export async function getLastInvoiceFormSubmission(session, filters = {}) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const response = await httpGraphQLAPI.post("", {
            query: getLastInvoiceFormSubmissionStringQuery({
                formZid: filters?.formZid,
            }),
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const register = response?.data?.data?.submission_invoices[0];
        return register;
    });
}
/**
 * getInvoiceFormSubmissionsByInvoiceId
 */
export async function getInvoiceFormSubmissionsByInvoiceId(headersZauru, session, invoice_id, withFiles = false, filters = {}) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const query = getInvoiceFormSubmissionsByInvoiceIdStringQuery(Number(invoice_id), {
            formZid: filters?.formZid,
        });
        const response = await httpGraphQLAPI.post("", { query }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        let registers = response?.data?.data?.submission_invoices;
        if (withFiles) {
            registers = await Promise.all(registers.map(async (register) => {
                try {
                    const responseZauru = await httpZauru.get(`/settings/forms/form_submissions/${register.settings_form_submission.id}.json`, {
                        headers: headersZauru,
                    });
                    register.settings_form_submission.settings_form_submission_values =
                        register.settings_form_submission.settings_form_submission_values.map((x) => {
                            if (x.settings_form_field.field_type === "image" ||
                                x.settings_form_field.field_type === "file" ||
                                x.settings_form_field.field_type === "pdf") {
                                x.value = responseZauru.data[x.settings_form_field.print_var_name]
                                    ?.toString()
                                    .replace(/\\u0026/g, "&");
                            }
                            return x;
                        });
                    return register;
                }
                catch (error) {
                    console.error(`Error al obtener el archivo del formulario ${register.settings_form_submission.id}`, error);
                    return register;
                }
            }));
        }
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const groupedByVersion = registers.reduce((acc, record) => {
            const zid = record.settings_form_submission.zid;
            if (!acc[zid]) {
                acc[zid] = record;
            }
            return acc;
        }, {});
        const latestVersionRecords = Object.values(groupedByVersion).reverse();
        return latestVersionRecords;
    });
}
/**
 * getCaseFormSubmissionsByCaseId
 */
export async function getCaseFormSubmissionsByCaseId(headersZauru, session, case_id, withFiles = false, filters = {}) {
    return handlePossibleAxiosErrors(async () => {
        const headers = await getGraphQLAPIHeaders(session);
        const query = getCaseFormSubmissionsByCaseIdStringQuery(Number(case_id), {
            formZid: filters?.formZid,
        });
        const response = await httpGraphQLAPI.post("", { query }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        let registers = response?.data?.data?.submission_cases;
        if (withFiles) {
            registers = await Promise.all(registers.map(async (register) => {
                try {
                    const responseZauru = await httpZauru.get(`/settings/forms/form_submissions/${register.settings_form_submission.id}.json`, {
                        headers: headersZauru,
                    });
                    register.settings_form_submission.settings_form_submission_values =
                        register.settings_form_submission.settings_form_submission_values.map((x) => {
                            if (x.settings_form_field.field_type === "image" ||
                                x.settings_form_field.field_type === "file" ||
                                x.settings_form_field.field_type === "pdf") {
                                x.value = responseZauru.data[x.settings_form_field.print_var_name]
                                    ?.toString()
                                    .replace(/\\u0026/g, "&");
                            }
                            return x;
                        });
                    return register;
                }
                catch (error) {
                    console.error(`Error al obtener el archivo del formulario ${register.settings_form_submission.id}`, error);
                    return register;
                }
            }));
        }
        // Filtrar los registros para obtener sólo los de la versión más alta.
        const groupedByVersion = registers.reduce((acc, record) => {
            const zid = record.settings_form_submission.zid;
            if (!acc[zid]) {
                acc[zid] = record;
            }
            return acc;
        }, {});
        const latestVersionRecords = Object.values(groupedByVersion).reverse();
        return latestVersionRecords;
    });
}
export const getFormSubmissionAPIZauru = async (headers, id) => {
    return handlePossibleAxiosErrors(async () => {
        const responseZauru = await httpZauru.get(`/settings/forms/form_submissions/${id}.json`, { headers });
        return responseZauru.data;
    });
};
/**
 * createForm
 * @param headers
 * @param body
 */
export async function createForm(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            form_fields_attributes: arrayToObject(body.settings_form_fields),
        };
        delete sendBody.settings_form_fields;
        const response = await httpZauru.post(`/settings/forms.json`, { settings_form: sendBody }, { headers });
        return response.data;
    });
}
/**
 * deleteForm
 * @param headers
 * @param body
 */
export async function deleteForm(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/forms/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
/**
 * createForm
 * @param headers
 * @param body
 */
export async function updateForm(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const sendBody = {
            ...body,
            form_fields_attributes: arrayToObject(body.settings_form_fields),
        };
        delete sendBody.settings_form_fields;
        const response = await httpZauru.post(`/settings/forms.json`, { settings_form: sendBody }, { headers });
        return response.data;
    });
}
/**
 * createFormSubmission
 * @param headers
 * @param body
 * @returns
 */
export async function createFormSubmission(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        delete headers["Content-type"];
        const sendBody = convertToFormData({
            settings_form_submission: body,
        });
        const response = await httpZauru.post(`/settings/forms/form_submissions.json`, sendBody, { headers });
        return response.data;
    });
}
/**
 * updateSubmissionInvoiceFormSubmission
 * @param headers
 * @param body
 * @returns
 */
export async function updateSubmissionInvoiceFormSubmission(headers, body) {
    return handlePossibleAxiosErrors(async () => {
        const settings_form_submission = {
            form_id: body.settings_form_submission?.settings_form?.id,
            reference: body.settings_form_submission?.reference,
            document_type: "invoice",
            document_id: body.invoice_id,
            zid: body.settings_form_submission?.zid,
            form_submission_values_attributes: arrayToObject(body.settings_form_submission?.settings_form_submission_values?.map((x) => {
                delete x.settings_form_field;
                return x;
            })),
        };
        const response = await httpZauru.post(`/settings/forms/form_submissions.json`, {
            settings_form_submission,
        }, { headers });
        return response.data;
    });
}
/**
 * deleteFormSubmission
 * @param headers
 * @param body
 */
export async function deleteFormSubmission(headers, id) {
    return handlePossibleAxiosErrors(async () => {
        await httpZauru.delete(`/settings/forms/form_submissions/${id}.json`, {
            headers,
        });
        return true;
    });
}
