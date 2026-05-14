import type { Session } from "@remix-run/node";
import { LoteRecordBody, WebAppRowGraphQL } from "@zauru-sdk/types";
export declare function getLoteRecord(headers: any, session: Session): Promise<WebAppRowGraphQL<LoteRecordBody>[]>;
export declare function deleteLoteRecord(headers: any, session: Session, id: number): Promise<any>;
export declare function createLoteRecord(headers: any, session: Session, body: LoteRecordBody): Promise<{
    Nombre: string;
}>;
export declare function updateLoteRecord(headers: any, session: Session, id: number): Promise<any>;
