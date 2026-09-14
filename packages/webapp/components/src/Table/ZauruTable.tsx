import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import type {
  PaginationOptions,
  TableProps,
  TableStyles,
} from "react-data-table-component";
import { createTheme } from "react-data-table-component";
import { SearchSVG } from "@zauru-sdk/icons";
import { ExpandableRowsComponent } from "react-data-table-component/dist/DataTable/types.js";
import * as ReactDataTableComponent from "react-data-table-component";
const DataTable = ReactDataTableComponent.default as any;

const headerTextWrapStyle = {
  whiteSpace: "normal",
  overflow: "visible",
  textOverflow: "clip",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  lineHeight: "1.25",
} as const;

const customStyles: TableStyles = {
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

type Props = TableProps<any> & {
  columns: any;
  conditionalRowStyles?: any;
  data: any[];
  loading?: boolean;
  pagination?: {
    totalRows: number;
    rowsPerPageOptions: number[];
  };
  whitOutPagination?: boolean;
  offlineSearch?: string[];
  search?: {
    placeholderSearch?: string;
  };
  expandable?: {
    expandableRowExpanded?: (row: any) => boolean;
    expandableRowsComponent?: ExpandableRowsComponent<any>;
  };
  theme?: "solarized" | "subTable";
  className?: string;
};

//Documentación de la tabla https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs
export const ZauruTable = (props: Props) => {
  const {
    columns,
    conditionalRowStyles,
    data,
    loading = false,
    pagination,
    search,
    expandable,
    theme,
    className,
    offlineSearch = [],
    whitOutPagination = false,
    ...others
  } = props;

  const [, setSearchParams] = useSearchParams({
    page: "1",
    perPage: "10",
    search: "",
  });
  const [filteredData, setFilteredData] = useState(data);

  const [showTable, setShowTable] = useState<boolean>(false);

  useEffect(() => {
    setShowTable(true);
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const subHeaderComponentMemo = (
    <>
      <input
        name="search"
        type="text"
        placeholder={search?.placeholderSearch ?? "Filtrar"}
        aria-label="Search Input"
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-2"
        onChange={(event) => {
          const searchTerm = event.target.value;
          if (offlineSearch.length > 0) {
            filterData(searchTerm);
          }
        }}
        onBlur={(event) => {
          const searchTerm = event.target.value;
          if (offlineSearch.length <= 0 && search) {
            setSearchParams((prevState: URLSearchParams) => ({
              ...Object.fromEntries(prevState),
              search: searchTerm,
            }));
          }
        }}
      />
      <button type="button" name="search" className="px-2 font-bold">
        <SearchSVG />
      </button>
    </>
  );

  const filterData = (searchTerm: string) => {
    if (!searchTerm || !offlineSearch || offlineSearch.length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) =>
      offlineSearch.some(
        (field) =>
          item[field] &&
          item[field]
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );

    setFilteredData(filtered);
  };

  const handlePageChange = (page: number) => {
    //hacer el fetch de más datos
    setSearchParams((prevState: URLSearchParams) => ({
      ...Object.fromEntries(prevState),
      page: page.toString(),
    }));
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    //hacer el fetch de más datos
    setSearchParams((prevState: URLSearchParams) => ({
      ...Object.fromEntries(prevState),
      perPage: newPerPage.toString(),
    }));
  };

  if (!showTable) {
    return <>Loading...</>;
  }

  //Textos en español de la tabla
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  } as PaginationOptions;

  const loadSubHeader = !!(search || offlineSearch.length > 0);
  const subHeaderComponent = loadSubHeader ? subHeaderComponentMemo : undefined;

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto">
      <DataTable
      className={className}
      subHeaderWrap
      theme={theme ?? "solarized"}
      columns={columns}
      conditionalRowStyles={conditionalRowStyles}
      data={filteredData}
      customStyles={customStyles}
      progressPending={loading}
      highlightOnHover
      pointerOnHover
      dense
      striped
      pagination={!whitOutPagination}
      persistTableHead
      responsive
      noHeader
      expandableRows={!!expandable}
      expandOnRowClicked={!!expandable}
      expandableRowExpanded={
        expandable ? expandable.expandableRowExpanded : undefined
      }
      expandableRowsComponent={
        expandable ? expandable.expandableRowsComponent : undefined
      }
      subHeader={loadSubHeader}
      subHeaderComponent={subHeaderComponent}
      paginationServer={!!pagination}
      paginationTotalRows={pagination?.totalRows ?? undefined}
      onChangeRowsPerPage={pagination ? handlePerRowsChange : undefined}
      onChangePage={pagination ? handlePageChange : undefined}
      paginationComponentOptions={paginationComponentOptions}
      paginationRowsPerPageOptions={
        pagination?.rowsPerPageOptions
          ? pagination.rowsPerPageOptions
          : [10, 50, 100]
      }
        {...others}
      />
    </div>
  );
};
