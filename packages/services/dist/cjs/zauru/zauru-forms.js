"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFormSubmission = exports.updateSubmissionInvoiceFormSubmission = exports.createFormSubmission = exports.updateForm = exports.deleteForm = exports.createForm = exports.getFormSubmissionAPIZauru = exports.getInvoiceFormSubmissionsByInvoiceId = exports.getLastInvoiceFormSubmission = exports.getMyCaseFormSubmissions = exports.getInvoiceFormSubmissionsByAgencyId = exports.getFormSubmissionById = exports.getFormsByDocumentType = exports.getAllForms = exports.getFormByName = exports.getForms = void 0;
const common_1 = require("@zauru-sdk/common");
const common_js_1 = require("../common.js");
const httpGraphQL_js_1 = __importDefault(require("./httpGraphQL.js"));
const graphql_1 = require("@zauru-sdk/graphql");
const httpZauru_js_1 = __importDefault(require("./httpZauru.js"));
/**
 * getForms
 */
async function getForms(session) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getFormsStringQuery,
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        const registers = response?.data?.data?.settings_forms;
        return registers;
    });
}
exports.getForms = getForms;
/**
 * getFormByName
 */
async function getFormByName(session, name) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getFormByNameStringQuery,
            variables: {
                name,
            },
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
exports.getFormByName = getFormByName;
/**
 * getAllForms
 */
async function getAllForms(session, filters = { withSubmissions: false }) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getAllFormsStringQuery)({
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
exports.getAllForms = getAllForms;
/**
 * getFormsByDocumentType
 */
async function getFormsByDocumentType(session, document_type, filters = {}) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getFormsByDocumentTypeStringQuery)(filters),
            variables: {
                document_type,
            },
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
exports.getFormsByDocumentType = getFormsByDocumentType;
/**
 * getFormSubmissionById
 */
async function getFormSubmissionById(headersZauru, session, id, config = { withFiles: false }) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: graphql_1.getFormSubmissionByIdStringQuery,
            variables: {
                formId: id,
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        if (!response?.data?.data?.settings_form_submissions.length) {
            throw new Error("No se encontró el form submission indicado.");
        }
        const register = response?.data?.data?.settings_form_submissions[0];
        if (config.withFiles) {
            const responseZauru = await httpZauru_js_1.default.get(`/settings/forms/form_submissions/${id}.json`, {
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
exports.getFormSubmissionById = getFormSubmissionById;
/**
 * getInvoiceFormSubmissionsByAgencyId
 */
async function getInvoiceFormSubmissionsByAgencyId(session, agency_id, filters) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const queryBuilded = (0, graphql_1.getInvoiceFormSubmissionsByAgencyIdStringQuery)({
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
        const response = await httpGraphQL_js_1.default.post("", {
            query: queryBuilded,
            variables: {
                agency_id,
            },
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
exports.getInvoiceFormSubmissionsByAgencyId = getInvoiceFormSubmissionsByAgencyId;
/**
 * getMyCaseFormSubmissions
 */
async function getMyCaseFormSubmissions(headersZauru, session, filters = {}, config = { withFiles: false }) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getMyCaseFormSubmissionsStringQuery)({
                formZid: filters?.formZid,
                caseId: filters?.caseId,
            }),
            variables: {
                responsible_id: session.get("employee_id"),
            },
        }, { headers });
        if (response.data.errors) {
            throw new Error(response.data.errors.map((x) => x.message).join(";"));
        }
        let registers = response?.data?.data?.submission_cases;
        if (config.withFiles) {
            registers = await Promise.all(registers.map(async (register) => {
                const responseZauru = await httpZauru_js_1.default.get(`/settings/forms/form_submissions/${register.settings_form_submission.id}.json`, {
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
exports.getMyCaseFormSubmissions = getMyCaseFormSubmissions;
/**
 * getLastInvoiceFormSubmission
 * @param session
 * @param filters
 * @returns
 */
async function getLastInvoiceFormSubmission(session, filters = {}) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getLastInvoiceFormSubmissionStringQuery)({
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
exports.getLastInvoiceFormSubmission = getLastInvoiceFormSubmission;
/**
 * getInvoiceFormSubmissionsByInvoiceId
 */
async function getInvoiceFormSubmissionsByInvoiceId(session, invoice_id, filters = {}) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const headers = await (0, common_js_1.getGraphQLAPIHeaders)(session);
        const response = await httpGraphQL_js_1.default.post("", {
            query: (0, graphql_1.getInvoiceFormSubmissionsByInvoiceIdStringQuery)({
                formZid: filters?.formZid,
            }),
            variables: {
                invoice_id,
            },
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
        const latestVersionRecords = Object.values(groupedByVersion).reverse();
        return latestVersionRecords;
    });
}
exports.getInvoiceFormSubmissionsByInvoiceId = getInvoiceFormSubmissionsByInvoiceId;
const getFormSubmissionAPIZauru = async (headers, id) => {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const responseZauru = await httpZauru_js_1.default.get(`/settings/forms/form_submissions/${id}.json`, { headers });
        return responseZauru.data;
    });
};
exports.getFormSubmissionAPIZauru = getFormSubmissionAPIZauru;
/**
 * createForm
 * @param headers
 * @param body
 */
async function createForm(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            form_fields_attributes: (0, common_1.arrayToObject)(body.settings_form_fields),
        };
        delete sendBody.settings_form_fields;
        const response = await httpZauru_js_1.default.post(`/settings/forms.json`, { settings_form: sendBody }, { headers });
        return response.data;
    });
}
exports.createForm = createForm;
/**
 * deleteForm
 * @param headers
 * @param body
 */
async function deleteForm(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/forms/${id}?destroy=true`, {
            headers,
        });
        return true;
    });
}
exports.deleteForm = deleteForm;
/**
 * createForm
 * @param headers
 * @param body
 */
async function updateForm(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const sendBody = {
            ...body,
            form_fields_attributes: (0, common_1.arrayToObject)(body.settings_form_fields),
        };
        delete sendBody.settings_form_fields;
        const response = await httpZauru_js_1.default.post(`/settings/forms.json`, { settings_form: sendBody }, { headers });
        return response.data;
    });
}
exports.updateForm = updateForm;
/**
 * createFormSubmission
 * @param headers
 * @param body
 * @returns
 */
async function createFormSubmission(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        delete headers["Content-type"];
        const sendBody = (0, common_1.convertToFormData)({
            settings_form_submission: body,
        });
        const response = await httpZauru_js_1.default.post(`/settings/forms/form_submissions.json`, sendBody, { headers });
        return response.data;
    });
}
exports.createFormSubmission = createFormSubmission;
/**
 * updateSubmissionInvoiceFormSubmission
 * @param headers
 * @param body
 * @returns
 */
async function updateSubmissionInvoiceFormSubmission(headers, body) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        const settings_form_submission = {
            form_id: body.settings_form_submission?.settings_form?.id,
            reference: body.settings_form_submission?.reference,
            document_type: "invoice",
            document_id: body.invoice_id,
            zid: body.settings_form_submission?.zid,
            form_submission_values_attributes: (0, common_1.arrayToObject)(body.settings_form_submission?.settings_form_submission_values?.map((x) => {
                delete x.settings_form_field;
                return x;
            })),
        };
        const response = await httpZauru_js_1.default.post(`/settings/forms/form_submissions.json`, {
            settings_form_submission,
        }, { headers });
        return response.data;
    });
}
exports.updateSubmissionInvoiceFormSubmission = updateSubmissionInvoiceFormSubmission;
/**
 * deleteFormSubmission
 * @param headers
 * @param body
 */
async function deleteFormSubmission(headers, id) {
    return (0, common_1.handlePossibleAxiosErrors)(async () => {
        await httpZauru_js_1.default.delete(`/settings/forms/form_submissions/${id}.json`, {
            headers,
        });
        return true;
    });
}
exports.deleteFormSubmission = deleteFormSubmission;
