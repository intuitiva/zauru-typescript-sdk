import type { Session } from "@remix-run/node";
import { WebAppRowGraphQL, Programacion, AxiosUtilsResponse, WebAppTableUpdateResponse } from "@zauru-sdk/types";
/**
 * Get programaciones from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @returns A Promise of AxiosUtilsResponse<WebAppRowGraphQL<Programacion>[]>>.
 */
export declare const getProgramaciones: (headers: any, session: Session) => Promise<AxiosUtilsResponse<WebAppRowGraphQL<Programacion>[]>>;
/**
 * Create a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param body Programacion data to be created.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const createProgramacion: (headers: any, session: Session, body: Programacion) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Delete a programacion from the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be deleted.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const deleteProgramacion: (headers: any, session: Session, id: string) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
/**
 * Update a programacion in the web app table.
 * @param headers Request headers.
 * @param session Session object.
 * @param id ID of the programacion to be updated.
 * @param body Updated programacion data.
 * @returns A Promise of AxiosUtilsResponse<WebAppTableUpdateResponse>.
 */
export declare const updateProgramacion: (headers: any, session: Session, id: string, body: Partial<Programacion>) => Promise<AxiosUtilsResponse<WebAppTableUpdateResponse>>;
