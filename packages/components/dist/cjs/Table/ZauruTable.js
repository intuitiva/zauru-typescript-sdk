"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZauruTable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@remix-run/react");
const react_2 = require("react");
const react_data_table_component_1 = require("react-data-table-component");
const icons_1 = require("@zauru-sdk/icons");
const ReactDataTableComponent = __importStar(require("react-data-table-component"));
const DataTable = ReactDataTableComponent.default;
const customStyles = {
    headCells: {
        style: {
            color: "#202124",
            fontSize: "14px",
            justifyContent: "left",
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: "250px",
            padding: "4px", // Add some padding
        },
    },
    cells: {
        style: {
            whiteSpace: "normal", // Allow wrapping for cell content
            wordBreak: "break-word",
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: "rgb(230, 244, 244)",
            borderBottomColor: "#FFFFFF",
            borderRadius: "25px",
            outline: "1px solid #FFFFFF",
        },
    },
    pagination: {
        style: {
            border: "none",
        },
    },
};
(0, react_data_table_component_1.createTheme)("solarized", {
    text: {
        primary: "#002b36",
        secondary: "#002b36",
    },
    background: {
        default: "#f9f9f9",
    },
    context: {
        background: "#cb4b16",
        text: "#555555",
    },
    divider: {
        default: "#e2e4ff",
    },
    action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
    },
    headRow: {
        background: "black",
    },
});
(0, react_data_table_component_1.createTheme)("subTable", {
    text: {
        primary: "#002b36",
        secondary: "#002b36",
    },
    background: {
        default: "#e9e9e9",
    },
    context: {
        background: "#cb4b16",
        text: "#555555",
    },
    divider: {
        default: "#e2e4ff",
    },
    action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
    },
    headRow: {
        background: "black",
    },
});
//Documentación de la tabla https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs
const ZauruTable = (props) => {
    const { columns, conditionalRowStyles, data, loading = false, pagination, search, theme, className, offlineSearch = [], whitOutPagination = false, ...others } = props;
    const [, setSearchParams] = (0, react_1.useSearchParams)({
        page: "1",
        perPage: "10",
        search: "",
    });
    const [filteredData, setFilteredData] = (0, react_2.useState)(data);
    const [showTable, setShowTable] = (0, react_2.useState)(false);
    (0, react_2.useEffect)(() => {
        setShowTable(true);
    }, []);
    (0, react_2.useEffect)(() => {
        setFilteredData(data);
    }, [data]);
    const subHeaderComponentMemo = ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { name: "search", type: "text", placeholder: search?.placeholderSearch ?? "Filtrar", "aria-label": "Search Input", className: "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2", onChange: (event) => {
                    const searchTerm = event.target.value;
                    if (offlineSearch.length > 0) {
                        filterData(searchTerm);
                    }
                }, onBlur: (event) => {
                    const searchTerm = event.target.value;
                    if (offlineSearch.length <= 0 && search) {
                        setSearchParams((prevState) => ({
                            ...Object.fromEntries(prevState),
                            search: searchTerm,
                        }));
                    }
                } }), (0, jsx_runtime_1.jsx)("button", { type: "button", name: "search", className: "px-2 font-bold", children: (0, jsx_runtime_1.jsx)(icons_1.SearchSVG, {}) })] }));
    const filterData = (searchTerm) => {
        if (!searchTerm || !offlineSearch || offlineSearch.length === 0) {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter((item) => offlineSearch.some((field) => item[field] &&
            item[field]
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())));
        setFilteredData(filtered);
    };
    const handlePageChange = (page) => {
        //hacer el fetch de más datos
        setSearchParams((prevState) => ({
            ...Object.fromEntries(prevState),
            page: page.toString(),
        }));
    };
    const handlePerRowsChange = async (newPerPage, page) => {
        //hacer el fetch de más datos
        setSearchParams((prevState) => ({
            ...Object.fromEntries(prevState),
            perPage: newPerPage.toString(),
        }));
    };
    if (!showTable) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Loading..." });
    }
    //Textos en español de la tabla
    const paginationComponentOptions = {
        rowsPerPageText: "Filas por página",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };
    const loadSubHeader = !!(search || offlineSearch.length > 0);
    const subHeaderComponent = loadSubHeader ? subHeaderComponentMemo : undefined;
    return ((0, jsx_runtime_1.jsx)(DataTable, { className: className, subHeaderWrap: true, theme: theme ?? "solarized", columns: columns, conditionalRowStyles: conditionalRowStyles, data: filteredData, customStyles: customStyles, progressPending: loading, highlightOnHover: true, pointerOnHover: true, dense: true, striped: true, pagination: !whitOutPagination, persistTableHead: true, responsive: true, noHeader: true, subHeader: loadSubHeader, subHeaderComponent: subHeaderComponent, paginationServer: !!pagination, paginationTotalRows: pagination?.totalRows ?? undefined, onChangeRowsPerPage: pagination ? handlePerRowsChange : undefined, onChangePage: pagination ? handlePageChange : undefined, paginationComponentOptions: paginationComponentOptions, paginationRowsPerPageOptions: pagination?.rowsPerPageOptions
            ? pagination.rowsPerPageOptions
            : [10, 50, 100], ...others }));
};
exports.ZauruTable = ZauruTable;
