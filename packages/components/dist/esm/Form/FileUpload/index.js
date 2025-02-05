import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
export const FileUploadField = (props) => {
    const { id, name, title, helpText, hint, onChange, readOnly = false, fileTypes = [], showAvailableTypes = false, className, defaultValue, download = false, required = false, } = props;
    const { register: tempRegister, formState: { errors }, } = useFormContext() || { formState: {} };
    const error = errors ? errors[name] : undefined;
    const register = tempRegister ? tempRegister(name, { required }) : undefined;
    const [showTooltip, setShowTooltip] = useState(false);
    // Para mostrar en el hint los tipos de archivo permitidos (opcional)
    let hintMessage = hint;
    if (showAvailableTypes && fileTypes.length > 0) {
        hintMessage = `${hint || ""} Archivos permitidos: ${fileTypes.join(", ")}`;
    }
    // Clases de estilo basadas en si hay error (color rojo) o no (gris),
    // pero ahora ignoramos el "disabled" y nos centramos en "readOnly".
    const color = error ? "red" : "gray";
    const isReadOnly = readOnly;
    // En modo readOnly, puedes poner un fondo distinto, o dejarlo en blanco
    const bgColor = isReadOnly ? "bg-gray-100" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-700" : `text-${color}-900`;
    const borderColor = error ? "border-red-500" : `border-${color}-500`;
    /**
     * onChange normal del input.
     * Sólo se llama cuando readOnly es false (porque si es true ni renderizamos el input).
     */
    const handleInputChange = (event) => {
        onChange && onChange(event);
        // Si usas register, la parte interna de react-hook-form también se encargará
        // del cambio, no necesitas llamarlo manualmente.
    };
    /**
     * Para el "preview" cuando `defaultValue` es string:
     * - Si `download` es true, mostramos un icono de descarga.
     * - Si `download` es false, mostramos la imagen en miniatura.
     * El click abre la URL en nueva ventana.
     */
    function renderPreview(defaultValue) {
        if (download) {
            // Botón de descarga
            return (_jsxs("div", { role: "button", tabIndex: 0, onClick: () => window.open(defaultValue, "_blank"), onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        window.open(defaultValue, "_blank");
                    }
                }, className: "inline-flex items-center cursor-pointer", children: [_jsx(DownloadIconSVG, {}), _jsx("span", { className: "ml-1 text-blue-600 underline", children: "Descargar archivo" })] }));
        }
        else {
            // Vista previa como imagen
            return (_jsx("div", { role: "button", tabIndex: 0, onClick: () => window.open(defaultValue, "_blank"), onKeyDown: (event) => {
                    if (event.key === "Enter") {
                        window.open(defaultValue, "_blank");
                    }
                }, className: "inline-block cursor-pointer", children: _jsx("img", { src: defaultValue, alt: name, className: "h-48 w-48 inline mr-1 pb-1", style: {
                        objectFit: "contain",
                        backgroundColor: "transparent",
                    } }) }));
        }
    }
    /**
     * 1) Si readOnly = true:
     *    - Si defaultValue es string -> Sólo mostramos el preview (descarga/imagen).
     *    - Si no hay defaultValue (o es File) -> mostramos "nada" o un texto de "Sin archivo".
     */
    if (readOnly) {
        return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-gray-700`, children: title })), typeof defaultValue === "string" && defaultValue ? (renderPreview(defaultValue)) : (_jsx("div", { className: "text-sm italic text-gray-400", children: "No hay archivo disponible" }))] }));
    }
    /**
     * 2) readOnly = false:
     *    - Si hay defaultValue y es string, mostramos la vista previa + el input
     *    - Si no hay defaultValue (o no es string) mostramos solo el input
     */
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: [title, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), typeof defaultValue === "string" && defaultValue && (_jsx("div", { className: "mb-2", children: renderPreview(defaultValue) })), _jsxs("div", { className: "flex relative items-center", children: [_jsx("input", { type: "file", id: id ?? name, accept: fileTypes.map((ft) => `.${ft}`).join(", "), className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, ...(register ?? {}), name: name, onChange: handleInputChange }), helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), error && (_jsxs("p", { className: `mt-2 text-sm text-red-600`, children: [_jsx("span", { className: "font-medium", children: "Oops!" }), " ", error.message?.toString()] })), !error && hintMessage && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500`, children: hintMessage }))] }));
};
