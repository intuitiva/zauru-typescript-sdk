import type { Session } from "@remix-run/node";
import { arrayToObject, handlePossibleAxiosErrors } from "@zauru-sdk/common";
import {
  createFormSubmission,
  getInvoiceFormSubmissionsByInvoiceId,
  getLastInvoiceFormSubmission,
  getVariablesByName,
} from "@zauru-sdk/services";
import {
  AxiosUtilsResponse,
  SubmissionInvoicesGraphQL,
  TransformedObject,
} from "@zauru-sdk/types";

export function transformFormSubmitObject(input: {
  [key: string]: any;
}): TransformedObject {
  const form_submission_values: Array<{
    form_field_id: string;
    value?: string;
    image?: any;
    pdf?: any;
    file?: any;
    groups_path: string;
  }> = [];

  const isJsonArray = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed);
    } catch (e) {
      return false;
    }
  };

  // Itera sobre las propiedades del objeto
  for (const key in input) {
    // Utiliza una expresión regular para detectar claves que coinciden con el patrón 'word_number'
    const match = key.match(/^(.+?)_(\d+)$/);
    if (match && !key.includes("deleted")) {
      const [, , form_field_id] = match;
      let newObj: any = {
        form_field_id,
        groups_path: "[]",
        value: "",
      };

      // Verifica si se ha enviado un archivo (tipo File o signed_id acompañado de file_type)
      if (
        input[key] instanceof File ||
        (typeof input[key] === "string" && input[`${key}_file_type`])
      ) {
        if (
          (input[key] instanceof File && input[key]?.size > 0) ||
          (typeof input[key] === "string" && input[`${key}_file_type`])
        ) {
          // Determina el tipo usando ya sea el file original o el file_type enviado
          const fileType =
            input[key] instanceof File
              ? input[key].type
              : input[`${key}_file_type`];

          // Si es imagen
          if (fileType.startsWith("image/")) {
            newObj["image"] = input[key];
          }
          // Si es PDF
          else if (fileType === "application/pdf") {
            newObj["pdf"] = input[key];
          }
          // Para otros tipos de archivo
          else {
            newObj["file"] = input[key];
          }
          delete newObj.value;
        }
      } else if (isJsonArray(input[key])) {
        // Manejo de JSON array (para tablas, etc.)
        const tableJsonArray: any[] = JSON.parse(input[key]);
        if (tableJsonArray.length > 0) {
          const form_table_values_attributes: {
            table_header_id: number;
            value: string;
            row_or_column_number: number;
          }[] = [];
          tableJsonArray.forEach((x, index) => {
            for (const keyTable in x) {
              const matchTableId = keyTable.match(/^(.+?)_(\d+)$/);
              if (matchTableId) {
                const [, , table_header_id] = matchTableId;
                form_table_values_attributes.push({
                  table_header_id: Number(table_header_id),
                  value: x[keyTable],
                  row_or_column_number: index + 1,
                });
              }
            }
          });
          newObj["form_table_values_attributes"] = arrayToObject(
            form_table_values_attributes
          );
          delete newObj.value;
        }
      } else {
        // Para otros valores simples
        newObj["value"] = input[key];
      }
      form_submission_values.push(newObj);
    }
  }

  return {
    form_submission_values_attributes: arrayToObject(form_submission_values),
    form_id: input.form_id,
    document_id: input.document_id,
    zid: input.zid,
    document_type: input.document_type,
    reference: input.reference,
    id_number: input.id_number ?? "",
  };
}

type OutputData = {
  index: number;
  item_id: number;
  form_id?: number;
  document_id: number;
  reference?: string;
  zid?: string;
  fields: { [field_id: number]: string }[];
};

export function transformResultadosFormData(
  input: {
    [key: string]: string;
  },
  document_id: number
): OutputData[] {
  const resultMap: { [compositeKey: string]: OutputData } = {};

  for (const [key, value] of Object.entries(input)) {
    const parts = key.split("_");

    if (
      parts.length === 3 &&
      (parts[2] === "zid" || parts[2] === "reference")
    ) {
      const [index, item_id, specialField] = parts;

      const compositeKey = `${index}_${item_id}`;

      if (!resultMap[compositeKey]) {
        resultMap[compositeKey] = {
          index: parseInt(index),
          item_id: parseInt(item_id),
          document_id,
          fields: [],
        };
      }

      if (specialField === "zid") {
        resultMap[compositeKey].zid = value;
      } else if (specialField === "reference") {
        resultMap[compositeKey].reference = value;
      }

      continue;
    }

    if (parts.length !== 4) continue;

    if (parts.some((part) => isNaN(parseInt(part, 10)))) continue;

    const [index, item_id, form_id, field_id] = parts.map((part) =>
      parseInt(part, 10)
    );

    const compositeKey = `${index}_${item_id}`;

    if (!resultMap[compositeKey]) {
      resultMap[compositeKey] = {
        index,
        item_id,
        form_id,
        document_id,
        fields: [],
      };
    }

    resultMap[compositeKey].fields.push({ [field_id]: value });
    resultMap[compositeKey].form_id = form_id;
  }

  return Object.values(resultMap);
}

/**
 *
 * @param data
 * @returns
 */
export const createRespuestaFormSubmission = (
  headers: any,
  data: OutputData
): Promise<AxiosUtilsResponse<any>> => {
  return handlePossibleAxiosErrors(async () => {
    const form_submission_values: Array<{
      form_field_id: string;
      value: string;
      groups_path: string;
    }> = [];

    for (const value of data.fields) {
      const form_field_id = Object.keys(value)[0];
      const associatedValue = value[form_field_id as any];
      form_submission_values.push({
        form_field_id,
        value: associatedValue,
        groups_path: "[]",
      });
    }
    const sendBody = {
      form_id: data.form_id,
      reference: `${data.index}_${data.item_id};${data?.reference}`,
      document_type: "invoice",
      document_id: data.document_id,
      form_submission_values_attributes: arrayToObject(form_submission_values),
      zid: data.zid,
    } as any;
    const response = await createFormSubmission(headers, sendBody);
    if (response.error) {
      throw new Error(
        `Ocurrió un error al intentar crear la respuesta de formulario: ${data}`
      );
    }
    return true;
  });
};

/**
 *
 * @param headers
 * @param session
 * @returns
 */
export const getLastMuestra = (
  headers: any,
  session: Session
): Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL>> => {
  return handlePossibleAxiosErrors(async () => {
    const { lab_muestras_form_zid } = await getVariablesByName(
      headers,
      session,
      ["lab_muestras_form_zid"]
    );
    const response = await getLastInvoiceFormSubmission(session, {
      formZid: Number(lab_muestras_form_zid),
    });

    if (response.error || !response.data) {
      throw new Error(
        `Ocurrió un error al intentar obtener la última muestra registrada: ${response.userMsg}`
      );
    }

    return response.data;
  });
};

export const getMuestrasByInvoiceId = (
  headers: any,
  session: Session,
  invoice_id: string
): Promise<AxiosUtilsResponse<SubmissionInvoicesGraphQL[]>> => {
  return handlePossibleAxiosErrors(async () => {
    const { lab_muestras_form_zid } = await getVariablesByName(
      headers,
      session,
      ["lab_muestras_form_zid"]
    );
    const response = await getInvoiceFormSubmissionsByInvoiceId(
      headers,
      session,
      invoice_id,
      false,
      { formZid: Number(lab_muestras_form_zid) }
    );

    if (response.error || !response.data) {
      throw new Error(
        `Ocurrió un error al intentar obtener las muestras de la remisión: ${response.userMsg}`
      );
    }

    return response.data;
  });
};
