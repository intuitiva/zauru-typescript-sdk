"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTableHTML = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const common_1 = require("@zauru-sdk/common");
//TABLA PARA LA IMPRESION:
const BasicTableHTML = (props) => {
    const { data, footer, headers } = props;
    return ((0, jsx_runtime_1.jsxs)("table", { style: { borderCollapse: "collapse", width: "100%" }, children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsx)("tr", { children: headers?.map((titulo, index) => ((0, jsx_runtime_1.jsx)("th", { style: {
                            border: "1px solid black",
                            padding: "10px",
                            textAlign: "center",
                            whiteSpace: "normal",
                        }, children: titulo.label }, index))) }) }), (0, jsx_runtime_1.jsx)("tbody", { children: data?.map((fila, index) => ((0, jsx_runtime_1.jsx)("tr", { children: headers?.map((titulo, index) => ((0, jsx_runtime_1.jsx)("td", { style: {
                            border: "1px solid black",
                            padding: "1px",
                            textAlign: "center",
                            whiteSpace: "normal",
                            fontSize: (0, common_1.isNumeric)(fila[titulo.name])
                                ? "2em"
                                : "1em",
                        }, children: fila[titulo.name] }, index))) }, index))) }), (0, jsx_runtime_1.jsx)("tfoot", { children: (0, jsx_runtime_1.jsx)("tr", { children: headers?.map((titulo, index) => ((0, jsx_runtime_1.jsx)("td", { style: {
                            padding: "10px",
                            textAlign: "center",
                            whiteSpace: "normal",
                            fontSize: (0, common_1.isNumeric)(footer[titulo.name])
                                ? "2em"
                                : "1em",
                        }, children: footer[titulo.name] }, index))) }) })] }));
};
exports.BasicTableHTML = BasicTableHTML;
