import type { Session } from "@remix-run/node";
import { handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createPayee,
  createPayeeCategory,
  createPriceList,
  deletePayeeCategory,
  deletePriceList,
  getPayeeCategoriesByNotesMatch,
  getPaymentTermById,
  getVariablesByName,
  updatePayeeCategory,
  updatePaymentTerm,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  CreatePriceListBody,
  PayeeCategoryGraphQL,
  PayeeGraphQL,
} from "@zauru-sdk/types";

export const TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE =
  "CATEGORIA_QUE_REPRESENTA_UN_PRECIO_DE_LABORATORIO (No borrar esto): ";

export const TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE = "CAT-LABORATORIO: ";

/**
 * getClientesLaboratorio
 * @param session
 * @param headers
 * @returns
 */
export const getClientesLaboratorio = (
  session: Session
): Promise<AxiosUtilsResponse<PayeeGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const clientesResponse = await getPayeeCategoriesByNotesMatch(
      session,
      TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE
    );

    if (clientesResponse.error || !clientesResponse.data) {
      throw new Error(clientesResponse.userMsg);
    }

    const clientes: PayeeGraphQL[] = [];
    clientesResponse.data.forEach((x) => clientes.push(...x.payees));

    return clientes;
  });
};

/**
 * createNewLaboratoryClient
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export const createNewLaboratoryClient = (
  headers: any,
  body: Partial<PayeeGraphQL>
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    const sendBody = {
      ...body,
      vendor: false,
      currency_id: 1,
      buyer: true,
      service_provider: true,
    } as PayeeGraphQL;

    const createResponse = await createPayee(headers, sendBody);

    if (!createResponse.data) {
      throw new Error(
        `Ocurrió un error al intentar crear el cliente: ${createResponse.userMsg}`
      );
    }

    return true;
  });
};

/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export const updateLaboratoryClientCategoryPrice = (
  headers: any,
  body: Partial<PayeeCategoryGraphQL>
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    const sendBody: Partial<PayeeCategoryGraphQL> = {
      ...body,
      name: `${TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE}${body.name ?? ""}`,
      notes: `${TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE}${body.notes ?? ""}`,
    };

    const createResponse = await updatePayeeCategory(headers, sendBody);

    if (!createResponse.data || createResponse.error) {
      throw new Error(
        `Ocurrió un error al intentar editar la categoría de cliente: ${createResponse.userMsg}`
      );
    }

    return true;
  });
};

/**
 * createNewLaboratoryClientCategoryPrice
 * @param session
 * @param headers
 * @param body
 * @returns
 */
export const createNewLaboratoryClientCategoryPrice = (
  headers: any,
  session: Session,
  body: Partial<PayeeCategoryGraphQL>
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    const sendBody: Partial<PayeeCategoryGraphQL> = {
      ...body,
      name: `${TEXT_PAYEE_CATEGORY_NAME_FOR_PRICE}${body.name ?? ""}`,
      notes: `${TEXT_PAYEE_CATEGORY_NOTES_FOR_PRICE}${body.notes ?? ""}`,
    };

    const createResponse = await createPayeeCategory(headers, sendBody);

    if (!createResponse.data || createResponse.error) {
      throw new Error(
        `Ocurrió un error al intentar crear la categoría de cliente: ${createResponse.userMsg}`
      );
    }

    //Luego creo el listado de precios también
    const sendBodyPriceList: CreatePriceListBody = {
      client_exclusive: true,
      name: `PRECIO_LABORATORIO: ${body.name}`,
      description: `Listado de precio asociado a la categoría de cliente: ${body.name} id: ${createResponse.data?.id}`,
      payee_category_ids: [createResponse.data.id?.toString()],
    };

    const createPriceResponse = await createPriceList(
      headers,
      sendBodyPriceList
    );

    if (!createPriceResponse.data || createPriceResponse.error) {
      throw new Error(
        `Ocurrió un error al intentar crear el listado de precio: ${createPriceResponse.userMsg}`
      );
    }

    //Por último, asigno la categoría de empleados al término de pago de laboratorio
    const { lab_payment_term_default_id } = await getVariablesByName(
      headers,
      session,
      ["lab_payment_term_default_id"]
    );
    const paymentTermResponse = await getPaymentTermById(
      session,
      lab_payment_term_default_id
    );
    if (!paymentTermResponse.data || paymentTermResponse.error) {
      throw new Error(
        `Ocurrió un error al intentar encontrar el término de pago: ${paymentTermResponse.userMsg}`
      );
    }

    const updatePaymentTermResponse = await updatePaymentTerm(headers, {
      id: Number(lab_payment_term_default_id),
      payee_category_ids: [
        ...paymentTermResponse?.data?.allowed_payment_terms?.map((x) =>
          x.payee_category_id.toString()
        ),
        createResponse.data.id?.toString(),
      ],
    });

    if (!updatePaymentTermResponse.data || updatePaymentTermResponse.error) {
      throw new Error(
        `Ocurrió un error al intentar actualizar el término de pago: ${updatePaymentTermResponse.userMsg}`
      );
    }
    return true;
  });
};

/**
 * deleteLaboratoryClientCategoryPrice
 * @param headers
 * @param body
 * @returns
 */
export const deleteLaboratoryClientCategoryPrice = (
  headers: any,
  body: Partial<PayeeCategoryGraphQL>
): Promise<AxiosUtilsResponse<boolean>> => {
  return handlePossibleAxiosErrors(async () => {
    //Elimino la categoría
    await deletePayeeCategory(headers, body.id ?? "");
    //Elimino la lista de precios
    await deletePriceList(headers, body.price_list_id ?? "");
    return true;
  });
};
