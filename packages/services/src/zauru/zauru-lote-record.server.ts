import type { Session } from "@remix-run/node";
import { LoteRecordBody, WebAppRowGraphQL } from "@zauru-sdk/types";
import { getVariablesByName } from "../common.server.js";
import {
  createWebAppTableRegister,
  deleteWebAppTableRegister,
  getWebAppTableRegisters,
} from "./zauru-web-app-tables.server.js";

export async function getLoteRecord(
  headers: any,
  session: Session
): Promise<WebAppRowGraphQL<LoteRecordBody>[]> {
  const { lote_record_webapp_table_id: webapp_table_id } =
    await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);

  const response = await getWebAppTableRegisters<LoteRecordBody>(
    session,
    webapp_table_id
  );

  if (response.error) {
    throw new Error(`Error al obtener el lote: ${response.userMsg}`);
  }

  const lotes = response.data ?? [];

  return lotes;
}

export async function deleteLoteRecord(
  headers: any,
  session: Session,
  id: number
): Promise<any> {
  const { lote_record_webapp_table_id: webapp_table_id } =
    await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);

  const response = await deleteWebAppTableRegister(
    headers,
    webapp_table_id,
    id
  );
  return response.data;
}

export async function createLoteRecord(
  headers: any,
  session: Session,
  body: LoteRecordBody
) {
  const { lote_record_webapp_table_id: webapp_table_id } =
    await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);

  const response = await createWebAppTableRegister<LoteRecordBody>(
    headers,
    webapp_table_id,
    body
  );
  return response.data;
}

export async function updateLoteRecord(
  headers: any,
  session: Session,
  id: number
): Promise<any> {
  const { lote_record_webapp_table_id: webapp_table_id } =
    await getVariablesByName(headers, session, ["lote_record_webapp_table_id"]);

  const response = await deleteWebAppTableRegister(
    headers,
    webapp_table_id,
    id
  );
  return response.data;
}
