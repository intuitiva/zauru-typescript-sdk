import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createTheme } from "react-data-table-component";
import { SearchSVG } from "@zauru-sdk/icons";
import * as ReactDataTableComponent from "react-data-table-component";
const DataTable = ReactDataTableComponent.default;
const headerTextWrapStyle = {
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "clip",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    lineHeight: "1.25",
};
const customStyles = {
    table: {
        style: {
            minWidth: 0,
        },
    },
    tableWrapper: {
        style: {
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowX: "auto",
        },
    },
    responsiveWrapper: {
        style: {
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            overflowX: "auto",
        },
    },
    headRow: {
        style: {
            minHeight: "40px",
            height: "auto",
            alignItems: "stretch",
        },
        denseStyle: {
            minHeight: "36px",
            height: "auto",
        },
    },
    headCells: {
        style: {
            color: "#202124",
            fontSize: "14px",
            justifyContent: "left",
            alignItems: "flex-start",
            paddingTop: "8px",
            paddingBottom: "8px",
            ...headerTextWrapStyle,
            ".rdt_TableCol_Sortable": {
                height: "auto",
                minHeight: "100%",
                overflow: "visible",
                whiteSpace: "normal",
                alignItems: "flex-start",
            },
            ".rdt_TableCol_Sortable > div": headerTextWrapStyle,
        },
    },
    cells: {
        style: {
            whiteSpace: "normal", // Allow wrapping for cell content
            wordBreak: "break-word",
        },
    },
    expanderRow: {
        style: {
            minWidth: 0,
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: "rgb(230, 244, 244)",
            borderBottomColor: "#FFFFFF",
            outline: "1px solid #FFFFFF",
        },
    },
    pagination: {
        style: {
            border: "none",
        },
    },
};
createTheme("solarized", {
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
createTheme("subTable", {
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
export const ZauruTable = (props) => {
    const { columns, conditionalRowStyles, data, loading = false, pagination, search, expandable, theme, className, offlineSearch = [], whitOutPagination = false, ...others } = props;
    const [, setSearchParams] = useSearchParams({
        page: "1",
        perPage: "10",
        search: "",
    });
    const [filteredData, setFilteredData] = useState(data);
    const [showTable, setShowTable] = useState(false);
    useEffect(() => {
        setShowTable(true);
    }, []);
    useEffect(() => {
        setFilteredData(data);
    }, [data]);
    const subHeaderComponentMemo = (_jsxs(_Fragment, { children: [_jsx("input", { name: "search", type: "text", placeholder: search?.placeholderSearch ?? "Filtrar", "aria-label": "Search Input", className: "bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2", onChange: (event) => {
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
                } }), _jsx("button", { type: "button", name: "search", className: "px-2 font-bold", children: _jsx(SearchSVG, {}) })] }));
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
        return _jsx(_Fragment, { children: "Loading..." });
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
    return (_jsx("div", { className: "w-full min-w-0 max-w-full overflow-x-auto", children: _jsx(DataTable, { className: className, subHeaderWrap: true, theme: theme ?? "solarized", columns: columns, conditionalRowStyles: conditionalRowStyles, data: filteredData, customStyles: customStyles, progressPending: loading, highlightOnHover: true, pointerOnHover: true, dense: true, striped: true, pagination: !whitOutPagination, persistTableHead: true, responsive: true, noHeader: true, expandableRows: !!expandable, expandOnRowClicked: !!expandable, expandableRowExpanded: expandable ? expandable.expandableRowExpanded : undefined, expandableRowsComponent: expandable ? expandable.expandableRowsComponent : undefined, subHeader: loadSubHeader, subHeaderComponent: subHeaderComponent, paginationServer: !!pagination, paginationTotalRows: pagination?.totalRows ?? undefined, onChangeRowsPerPage: pagination ? handlePerRowsChange : undefined, onChangePage: pagination ? handlePageChange : undefined, paginationComponentOptions: paginationComponentOptions, paginationRowsPerPageOptions: pagination?.rowsPerPageOptions
                ? pagination.rowsPerPageOptions
                : [10, 50, 100], ...others }) }));
};
