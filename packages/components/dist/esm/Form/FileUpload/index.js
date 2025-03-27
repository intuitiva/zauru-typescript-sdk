import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../../Buttons/index.js";
export const FileUploadField = (props) => {
    const { id, name, title, helpText, hint, onChange, readOnly = false, fileTypes = [], showAvailableTypes = false, className, defaultValue, download = false, required = false, optimizeImages = true, zauruBaseURL = "https://zauru.herokuapp.com", setProcessing, signature = false, } = props;
    const { register: tempRegister, setValue, formState: { errors }, } = useFormContext() || { formState: {} };
    const error = errors ? errors[name] : undefined;
    const register = tempRegister ? tempRegister(name, { required }) : undefined;
    const [showTooltip, setShowTooltip] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [openSignatureModal, setOpenSignatureModal] = useState(false);
    // Estados para la optimización de imagen
    const [optimizing, setOptimizing] = useState(false);
    const [optimizationProgress, setOptimizationProgress] = useState(0);
    const fileInputRef = useRef(null);
    // For signature drawing mode
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const handlePointerDown = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const rect = canvas.getBoundingClientRect();
        lastX.current = e.clientX - rect.left;
        lastY.current = e.clientY - rect.top;
        isDrawing.current = true;
    };
    const handlePointerMove = (e) => {
        e.preventDefault();
        if (!isDrawing.current)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX.current, lastY.current);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        lastX.current = currentX;
        lastY.current = currentY;
    };
    const handlePointerUp = (e) => {
        e?.preventDefault();
        isDrawing.current = false;
    };
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const handleSignatureConfirm = () => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        canvas.toBlob(async (blob) => {
            if (blob) {
                const file = new File([blob], "signature.png", { type: "image/png" });
                const objectUrl = URL.createObjectURL(file);
                setPreviewSrc(objectUrl);
                await processFile(file);
                setOpenSignatureModal(false);
            }
        }, "image/png");
    };
    useEffect(() => {
        return () => {
            if (previewSrc) {
                URL.revokeObjectURL(previewSrc);
            }
        };
    }, [previewSrc]);
    let hintMessage = hint;
    if (showAvailableTypes && fileTypes.length > 0) {
        hintMessage = `${hint || ""} Archivos permitidos: ${fileTypes.join(", ")}`;
    }
    const color = error ? "red" : "gray";
    const isReadOnly = readOnly;
    const bgColor = isReadOnly ? "bg-gray-100" : `bg-${color}-50`;
    const textColor = isReadOnly ? "text-gray-700" : `text-${color}-900`;
    const borderColor = error ? "border-red-500" : `border-${color}-500`;
    const processFile = async (file, event) => {
        let processedFile = file;
        /*
        if (file && file.type.startsWith("image/") && optimizeImages) {
          try {
            setOptimizing(true);
            setOptimizationProgress(0);
            const options: Options = {
              fileType: "image/webp",
              initialQuality: 0.7,
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              onProgress: (progress: number) => {
                setOptimizationProgress(progress);
              },
            };
            const compressedFile = await imageCompression(file, options);
            setOptimizing(false);
            processedFile = new File(
              [compressedFile],
              file.name.replace(/\.[^.]+$/, ".webp"),
              { type: "image/webp" }
            );
            const objectUrl = URL.createObjectURL(processedFile);
            setPreviewSrc(objectUrl);
          } catch (error) {
            console.error("Error al convertir la imagen a WebP:", error);
            setOptimizing(false);
            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);
          }
        } else
        */
        if (file && file.type.startsWith("image/")) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);
        }
        else {
            setPreviewSrc(null);
        }
        if (event && event.target) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(processedFile);
            event.target.files = dataTransfer.files;
        }
        // Proceso de subida mediante DirectUpload
        import("@rails/activestorage")
            .then(({ DirectUpload }) => {
            const uploadUrl = `${zauruBaseURL}/api/direct_uploads`;
            setProcessing && setProcessing(true);
            setUploading(true);
            setUploadProgress(0);
            const directUpload = new DirectUpload(processedFile, uploadUrl, {
                directUploadWillStoreFileWithXHR: (xhr) => {
                    xhr.upload.addEventListener("progress", (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(progress);
                        }
                    });
                },
            });
            directUpload.create((error, blob) => {
                setUploading(false);
                setProcessing && setProcessing(false);
                if (error) {
                    console.error("Error al subir el archivo:", error);
                }
                else {
                    setValue(name, blob.signed_id);
                    setValue(`${name}_file_type`, blob.content_type);
                    const hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("value", blob.signed_id);
                    hiddenField.setAttribute("name", name);
                    const typeHiddenField = document.createElement("input");
                    typeHiddenField.setAttribute("type", "hidden");
                    typeHiddenField.setAttribute("value", blob.content_type);
                    typeHiddenField.setAttribute("name", `${name}_file_type`);
                    const formElement = document.querySelector("form");
                    if (formElement) {
                        formElement.appendChild(hiddenField);
                        formElement.appendChild(typeHiddenField);
                    }
                    if (fileInputRef.current) {
                        fileInputRef.current.removeAttribute("name");
                    }
                }
            });
        })
            .catch((err) => {
            setProcessing && setProcessing(false);
            console.error("Error al cargar DirectUpload:", err);
        });
    };
    /**
     * Función que se dispara cuando el usuario selecciona un archivo.
     * Si optimizeImages está activo y se trata de una imagen, la convierte a WebP
     * usando la librería browser-image-compression.
     */
    const handleInputChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            await processFile(event.target.files[0], event);
        }
        onChange && onChange(event);
    };
    /**
     * Función para eliminar el archivo. Además de limpiar la vista previa,
     * limpia el input y el valor del campo en el formulario.
     */
    const deleteFile = () => {
        setPreviewSrc(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setValue(name, "");
    };
    /**
     * Renderiza la vista previa del archivo.
     * - Si `download` es true, muestra un botón para descargar.
     * - Si no, muestra la imagen en miniatura.
     */
    function renderPreview(src) {
        if (download) {
            return (_jsxs("div", { role: "button", tabIndex: 0, onClick: () => window.open(src, "_blank"), onKeyDown: (event) => {
                    if (event.key === "Enter")
                        window.open(src, "_blank");
                }, className: "inline-flex items-center cursor-pointer", children: [_jsx(DownloadIconSVG, {}), _jsx("span", { className: "ml-1 text-blue-600 underline", children: "Descargar archivo" })] }));
        }
        else {
            return (_jsx("div", { role: "button", tabIndex: 0, onClick: () => window.open(src, "_blank"), onKeyDown: (event) => {
                    if (event.key === "Enter")
                        window.open(src, "_blank");
                }, className: "inline-block cursor-pointer", children: _jsx("img", { src: src, alt: name, className: "h-48 w-48 inline mr-1 pb-1", style: { objectFit: "contain", backgroundColor: "transparent" } }) }));
        }
    }
    /**
     * 1) Modo readOnly:
     *    - Si defaultValue es string, se muestra el preview (descarga/imagen).
     *    - Si no hay defaultValue (o es File), se muestra "Sin archivo".
     */
    if (signature) {
        if (readOnly) {
            return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), typeof defaultValue === "string" && defaultValue ? (renderPreview(defaultValue)) : (_jsx("div", { className: "text-sm italic text-gray-400", children: "No hay firma disponible" }))] }));
        }
        else {
            return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: [title, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), previewSrc ? (_jsxs("div", { children: [renderPreview(previewSrc), _jsx("button", { type: "button", onClick: () => {
                                    setPreviewSrc(null);
                                }, className: "ml-2 text-red-600 underline text-sm", children: "Eliminar firma" })] })) : (_jsx("div", { children: _jsx("button", { type: "button", onClick: () => setOpenSignatureModal(true), className: "px-4 py-2 bg-blue-600 text-white rounded", children: "Firmar" }) })), openSignatureModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex flex-col bg-white", children: [_jsx("div", { className: "flex-grow flex items-center justify-center", children: _jsx("canvas", { ref: canvasRef, width: 400, height: 200, style: {
                                        border: "1px solid #ccc",
                                        backgroundColor: "transparent",
                                        touchAction: "none",
                                    }, onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerUp, onPointerLeave: handlePointerUp }) }), _jsxs("div", { className: "flex flex-col md:flex-row justify-center items-center space-x-4 space-y-4", children: [_jsxs(Button, { className: "flex items-center space-x-5", type: "button", name: "print", selectedColor: "indigo", onClickSave: clearCanvas, children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", style: {
                                                    fill: "rgba(0, 0, 0, 1)",
                                                    transform: "scale(2)",
                                                    msFilter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                                                }, children: [_jsx("path", { d: "M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z" }), _jsx("path", { d: "M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z" })] }), _jsx("span", { className: "text-5xl", children: "Limpiar" })] }), _jsxs(Button, { className: "flex items-center space-x-5", type: "button", name: "print", selectedColor: "green", onClickSave: handleSignatureConfirm, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", style: {
                                                    fill: "rgba(0, 0, 0, 1)",
                                                    transform: "scale(2)",
                                                    msFilter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                                                }, children: _jsx("path", { d: "M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" }) }), _jsx("span", { className: "text-5xl", children: "Confirmar" })] }), _jsxs(Button, { className: "flex items-center space-x-5", type: "button", name: "print", selectedColor: "gray", onClickSave: () => setOpenSignatureModal(false), children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", style: {
                                                    fill: "rgba(0, 0, 0, 1)",
                                                    transform: "scale(2)",
                                                    msFilter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)",
                                                }, children: [_jsx("path", { d: "M19.002 3h-14c-1.103 0-2 .897-2 2v4h2V5h14v14h-14v-4h-2v4c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.898-2-2-2z" }), _jsx("path", { d: "m11 16 5-4-5-4v3.001H3v2h8z" })] }), _jsx("span", { className: "text-5xl", children: "Cancelar" })] })] })] }))] }));
        }
    }
    /**
     * 2) Modo editable (readOnly = false):
     *    - Se muestra siempre el recuadro de vista previa, ya sea con la imagen cargada o con un placeholder.
     *    - Si se ha seleccionado una imagen o existe defaultValue y no se ha eliminado,
     *      se muestra la imagen y un botón para eliminar el archivo.
     */
    if (readOnly) {
        return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsx("label", { htmlFor: name, className: "block mb-1 text-sm font-medium text-gray-700", children: title })), typeof defaultValue === "string" && defaultValue ? (renderPreview(defaultValue)) : (_jsx("div", { className: "text-sm italic text-gray-400", children: "No hay archivo disponible" }))] }));
    }
    return (_jsxs("div", { className: `col-span-6 sm:col-span-3 ${className}`, children: [title && (_jsxs("label", { htmlFor: name, className: `block mb-1 text-sm font-medium text-${color}-700`, children: [title, required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "mb-2 flex items-center", children: [_jsx("div", { role: "button", tabIndex: 0, onClick: () => {
                            const srcToOpen = previewSrc || (typeof defaultValue === "string" && defaultValue);
                            if (srcToOpen)
                                window.open(srcToOpen, "_blank");
                        }, onKeyDown: (event) => {
                            const srcToOpen = previewSrc || (typeof defaultValue === "string" && defaultValue);
                            if (event.key === "Enter" && srcToOpen)
                                window.open(srcToOpen, "_blank");
                        }, className: "cursor-pointer border border-gray-300 h-48 w-48 flex items-center justify-center", children: previewSrc || (typeof defaultValue === "string" && defaultValue) ? (_jsx("img", { src: previewSrc ??
                                (typeof defaultValue === "string" && defaultValue
                                    ? defaultValue
                                    : undefined), alt: name, className: "h-48 w-48", style: { objectFit: "contain" } })) : (_jsx("span", { className: "text-gray-400", children: "No image" })) }), (previewSrc || (typeof defaultValue === "string" && defaultValue)) && (_jsx("button", { type: "button", onClick: deleteFile, className: "ml-2 text-red-600 underline text-sm", children: "Eliminar archivo" }))] }), _jsxs("div", { className: "flex relative items-center", children: [_jsx("input", { type: "file", id: id ?? name, accept: fileTypes.map((ft) => `.${ft}`).join(", "), className: `block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`, ...(register ?? {}), ref: fileInputRef, name: name, onChange: handleInputChange }), helpText && (_jsx("div", { className: "flex items-center relative ml-3", children: _jsxs("div", { className: "relative cursor-pointer", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsx(IdeaIconSVG, {}), showTooltip && (_jsx("div", { className: "absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50", children: helpText }))] }) }))] }), _jsx("div", { className: "mt-2 min-h-[60px] flex items-center justify-center border border-dashed border-gray-200 rounded", children: optimizing || uploading ? (_jsxs(_Fragment, { children: [optimizing && (_jsxs("div", { className: "w-full", children: [_jsx("progress", { value: optimizationProgress, max: "100", className: "w-full" }), _jsxs("p", { className: "text-sm text-blue-600 mt-1 text-center", children: ["Optimizando imagen a webp: ", optimizationProgress, "%"] })] })), uploading && (_jsxs("div", { className: "w-full", children: [_jsx("progress", { value: uploadProgress, max: "100", className: "w-full" }), _jsxs("p", { className: "text-sm text-blue-600 mt-1 text-center", children: ["Subiendo archivo: ", uploadProgress, "%"] })] }))] })) : (_jsx("span", { className: "text-sm text-gray-500", children: "Informaci\u00F3n de progreso" })) }), error && (_jsxs("p", { className: "mt-2 text-sm text-red-600", children: [_jsx("span", { className: "font-medium", children: "\u00A1Oops!" }), " ", error.message?.toString()] })), !error && hintMessage && (_jsx("p", { className: `mt-2 italic text-sm text-${color}-500`, children: hintMessage }))] }));
};
