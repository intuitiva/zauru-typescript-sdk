import { isNumeric } from "@zauru-sdk/common";
import { GenericDynamicTableColumn } from "@zauru-sdk/types";

//TABLA PARA LA IMPRESION:
export const BasicTableHTML = (props: {
  data: { [key: string]: string }[];
  headers: GenericDynamicTableColumn[];
  footer: { [key: string]: string };
}) => {
  const { data, footer, headers } = props;
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {headers?.map((titulo, index) => (
            <th
              key={index}
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "center",
                whiteSpace: "normal",
              }}
            >
              {titulo.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((fila, index) => (
          <tr key={index}>
            {headers?.map((titulo, index) => (
              <td
                key={index}
                style={{
                  border: "1px solid black",
                  padding: "1px",
                  textAlign: "center",
                  whiteSpace: "normal",
                  fontSize: isNumeric((fila as any)[titulo.name])
                    ? "2em"
                    : "1em",
                }}
              >
                {(fila as any)[titulo.name]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {headers?.map((titulo, index) => (
            <td
              key={index}
              style={{
                padding: "10px",
                textAlign: "center",
                whiteSpace: "normal",
                fontSize: isNumeric((footer as any)[titulo.name])
                  ? "2em"
                  : "1em",
              }}
            >
              {(footer as any)[titulo.name]}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};
