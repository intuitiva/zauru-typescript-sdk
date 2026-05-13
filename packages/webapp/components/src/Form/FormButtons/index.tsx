import React from "react";

type Props = {
  //Guardar
  saveTitle?: string;
  saveName?: string;
  onClickSave?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  //Cancelar
  showCancel?: boolean;
  cancelTitle?: string;
  cancelName?: string;
  //Limpiar
  showClear?: boolean;
  clearTitle?: string;
  clearName?: string;
  //Cargando...
  loading?: boolean;
  loadingSaveText?: string;
};

export const FormButtons = (props: Props) => {
  const {
    saveTitle = "Guardar",
    saveName = "save",
    cancelTitle = "Cancelar",
    cancelName = "cancel",
    showCancel = true,
    showClear = false,
    clearName = "clear",
    clearTitle = "Limpiar",
    loading = false,
    onClickSave,
    loadingSaveText = "Guardando...",
  } = props;

  return (
    <>
      {showClear && (
        <button
          type="reset"
          name="action"
          disabled={loading}
          value={clearName}
          className={`ml-5 ${
            loading ? " bg-opacity-25 cursor-progress" : ""
          } rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {clearTitle}
        </button>
      )}
      {showCancel && (
        <button
          type="button"
          name="action"
          disabled={loading}
          value={cancelName}
          className={`${showClear ? "ml-2" : "ml-5"} ${
            loading ? " bg-opacity-25 cursor-progress" : ""
          } rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          {cancelTitle}
        </button>
      )}
      <button
        type="submit"
        name="action"
        disabled={loading}
        value={saveName}
        onClick={onClickSave}
        className={`ml-2 ${
          loading ? " bg-opacity-25 cursor-progress" : "hover:bg-indigo-700"
        } inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        {loading ? loadingSaveText : saveTitle}
      </button>
    </>
  );
};
