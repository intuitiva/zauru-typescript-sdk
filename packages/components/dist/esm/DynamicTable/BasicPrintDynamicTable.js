import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { isNumeric } from "@zauru-sdk/common";
//TABLA PARA LA IMPRESION:
export const BasicTableHTML = (props) => {
    const { data, footer, headers } = props;
    return (_jsxs("table", { style: { borderCollapse: "collapse", width: "100%" }, children: [_jsx("thead", { children: _jsx("tr", { children: headers?.map((titulo, index) => (_jsx("th", { style: {
                            border: "1px solid black",
                            padding: "10px",
                            textAlign: "center",
                            whiteSpace: "normal",
                        }, children: titulo.label }, index))) }) }), _jsx("tbody", { children: data?.map((fila, index) => (_jsx("tr", { children: headers?.map((titulo, index) => (_jsx("td", { style: {
                            border: "1px solid black",
                            padding: "1px",
                            textAlign: "center",
                            whiteSpace: "normal",
                            fontSize: isNumeric(fila[titulo.name])
                                ? "2em"
                                : "1em",
                        }, children: fila[titulo.name] }, index))) }, index))) }), _jsx("tfoot", { children: _jsx("tr", { children: headers?.map((titulo, index) => (_jsx("td", { style: {
                            padding: "10px",
                            textAlign: "center",
                            whiteSpace: "normal",
                            fontSize: isNumeric(footer[titulo.name])
                                ? "2em"
                                : "1em",
                        }, children: footer[titulo.name] }, index))) }) })] }));
};
