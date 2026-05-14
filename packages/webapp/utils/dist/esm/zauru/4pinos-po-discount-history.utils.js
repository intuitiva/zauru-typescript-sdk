import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import { create4pinosPoDiscountHistory, getPurchaseOrder, getVariablesByName, update4pinosPoDiscountHistory, } from "@zauru-sdk/services";
export const add4pinosPoDiscountsHistory = async (session, headers, purchaseOrderId, discounts) => {
    return handlePossibleAxiosErrors(async () => {
        const { historial_porcentajes_de_rechazo_webapp_table_id } = await getVariablesByName(headers, session, [
            "historial_porcentajes_de_rechazo_webapp_table_id",
        ]);
        const purchaseOrderResponse = await getPurchaseOrder(session, purchaseOrderId);
        if (purchaseOrderResponse.error || !purchaseOrderResponse.data) {
            throw new Error(purchaseOrderResponse.userMsg);
        }
        const purchaseOrder = purchaseOrderResponse.data;
        // Pregunto si tiene historial de descuentos
        const purchaseOrderHistory = purchaseOrder.webapp_table_rowables?.find((x) => x.webapp_rows?.webapp_table_id ===
            Number(historial_porcentajes_de_rechazo_webapp_table_id));
        if (purchaseOrderHistory) {
            console.log("Ya existe una tabla de historial de porcentaje de rechazo");
            await update4pinosPoDiscountHistory(headers, session, purchaseOrderHistory.webapp_rows?.id ?? -1, {
                purchase_order_id: purchaseOrder.id,
                purchase_order_id_number: purchaseOrder.id_number,
                discounts: [
                    ...(purchaseOrderHistory.webapp_rows?.data?.discounts ?? []),
                    ...discounts,
                ],
            });
        }
        else {
            console.log("No existe una tabla de historial de porcentaje de rechazo - Creando nueva...");
            await create4pinosPoDiscountHistory(headers, session, {
                purchase_order_id: purchaseOrder.id,
                purchase_order_id_number: purchaseOrder.id_number,
                discounts: discounts,
            });
        }
    });
};
