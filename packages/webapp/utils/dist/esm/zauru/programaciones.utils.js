import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { associateWebAppTableRegister, createWebAppTableRegister, deleteWebAppTableRegister, getVariablesByName, getWebAppTableRegisters, updateWebAppTableRegister, } from "@zauru-sdk/services";
/**
 * Get programaciones from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<Programacion>[]>>.
 */
export const getProgramaciones = (headers, session) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await getWebAppTableRegisters(session, programaciones_webapp_table_id);
        if (response.error) {
            throw new Error(`Ocurrió un error al consultar las programaciones: ${response.userMsg}`);
        }
        const registers = response.data ?? [];
        return registers;
    });
};
/**
 * Create a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Programacion data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const createProgramacion = (headers, session, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await createWebAppTableRegister(headers, programaciones_webapp_table_id, body);
        return response;
    });
};
/**
 * Delete a programacion from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const deleteProgramacion = (headers, session, id) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await deleteWebAppTableRegister(headers, programaciones_webapp_table_id, Number(id));
        return response;
    });
};
/**
 * Associate a PurchaseOrder to an existing programacion.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion (webapp row) to associate to.
 * @param purchase_order_id ID of the PurchaseOrder to associate.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowAssociateResponse>.
 */
export const associatePurchaseOrderToProgramacion = (headers, session, id, purchase_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await associateWebAppTableRegister(headers, programaciones_webapp_table_id, Number(id), { temp_purchase_order_id: purchase_order_id });
        return response;
    });
};
/**
 * Associate a WorkOrder to an existing programacion.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion (webapp row) to associate to.
 * @param work_order_id ID of the WorkOrder to associate.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowAssociateResponse>.
 */
export const associateWorkOrderToProgramacion = (headers, session, id, work_order_id) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await associateWebAppTableRegister(headers, programaciones_webapp_table_id, Number(id), { temp_work_order_id: work_order_id });
        return response;
    });
};
/**
 * Update a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be updated.
 * @param body Updated programacion data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export const updateProgramacion = (headers, session, id, body) => {
    return handlePossibleAxiosErrors(async () => {
        const { programaciones_webapp_table_id } = await getVariablesByName(headers, session, ["programaciones_webapp_table_id"]);
        const response = await updateWebAppTableRegister(headers, programaciones_webapp_table_id, Number(id), body);
        return response;
    });
};
