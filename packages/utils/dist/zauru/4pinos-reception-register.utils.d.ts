import { WebAppRowGraphQL, QueueFormReceptionWebAppTable } from "@zauru-sdk/types";
import { Session } from "@remix-run/node";
/**
 * Flujo de la función register4pinosReception:
 *
 * 1. Recibe parámetros como cookie, idWebAppTable, agency_id, values y originApiResponses.
 * 2. Inicializa la sesión y los headers.
 * 3. Realiza una serie de llamadas API en orden, manejadas por apiResponses.apiCall:
 *    - Actualiza el estado de la cola de recepción.
 *    - Valida que no exista una orden de compra con el mismo número.
 *    - Crea una nueva orden de compra autorizada.
 *    - Crea una nueva recepción.
 *    - Realiza un envío de canastas a la agencia.
 *    - Recibe el envío de canastas.
 *    - Si no es centro de acopio:
 *      - Realiza un envío de canastas a control de calidad (si aplica).
 *      - Recibe el envío de control de calidad.
 *      - Guarda el rechazo de canastas directo (si aplica).
 *    - Si es centro de acopio:
 *      - Guarda los motivos de rechazo (si existen).
 * 4. Elimina el registro de la cola al finalizar.
 * 5. En caso de error en cualquier paso, actualiza el estado de la cola a ERROR.
 *
 * La función decide qué camino tomar basándose en:
 * - El valor de apiResponses.apiCall para determinar en qué paso está.
 * - Si es centro de acopio o no (esCentroDeAcopio).
 * - La existencia de canastas de control de calidad (qualityControlBaskets).
 * - La presencia de motivos de rechazo para centros de acopio.
 */
export declare const register4pinosReception: ({ cookie, idWebAppTable, agency_id, values, originApiResponses, }: any) => Promise<void>;
export declare const retryPO: (register: WebAppRowGraphQL<QueueFormReceptionWebAppTable>, session: Session, headers: any, hostname: string, cookie: string | null) => Promise<{
    error: boolean;
    title: string;
    type: string;
    description: string;
}>;
