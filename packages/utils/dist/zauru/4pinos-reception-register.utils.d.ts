import { WebAppRowGraphQL, QueueFormReceptionWebAppTable } from "@zauru-sdk/types";
import { Session } from "@remix-run/node";
export declare const register4pinosReception: ({ cookie, idWebAppTable, agency_id, values, originApiResponses, }: any) => Promise<void>;
export declare const retryPO: (register: WebAppRowGraphQL<QueueFormReceptionWebAppTable>, session: Session, headers: any, hostname: string, cookie: string | null) => Promise<{
    error: boolean;
    title: string;
    type: string;
    description: string;
}>;
