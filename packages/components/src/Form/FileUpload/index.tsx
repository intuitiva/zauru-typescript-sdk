import { DownloadIconSVG, IdeaIconSVG } from "@zauru-sdk/icons";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
/*
import imageCompression from "browser-image-compression";
import type { Options } from "browser-image-compression";
*/

type Props = {
  id?: string;
  name: string;
  formName?: string;
  title?: string;
  helpText?: string;
  hint?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  fileTypes?: string[];
  showAvailableTypes?: boolean;
  className?: string;
  defaultValue?: string | File;
  download?: boolean;
  required?: boolean;
  optimizeImages?: boolean;
  zauruBaseURL?: string;
};

export const FileUploadField = (props: Props) => {
  const {
    id,
    name,
    title,
    helpText,
    hint,
    onChange,
    readOnly = false,
    fileTypes = [],
    showAvailableTypes = false,
    className,
    defaultValue,
    download = false,
    required = false,
    optimizeImages = true,
    zauruBaseURL = "https://zauru.herokuapp.com",
  } = props;

  const {
    register: tempRegister,
    setValue,
    formState: { errors },
  } = useFormContext() || { formState: {} };

  const error = errors ? errors[name] : undefined;
  const register = tempRegister ? tempRegister(name, { required }) : undefined;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [fileDeleted, setFileDeleted] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  /**
   * Función que se dispara cuando el usuario selecciona un archivo.
   * Si optimizeImages está activo y se trata de una imagen, la convierte a WebP
   * usando la librería browser-image-compression.
   */
  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];

      // Si se activa la optimización y es imagen, se convierte a WebP
      if (file && file.type.startsWith("image/") && optimizeImages) {
        try {
          /*
           const options: Options = {
             fileType: "image/webp", // Especificamos el formato WebP
             initialQuality: 0.7, // Calidad inicial (puedes ajustar este valor)
             maxSizeMB: 1, // Tamaño máximo (opcional)
             maxWidthOrHeight: 1920, // Dimensión máxima (opcional)
             useWebWorker: true,
           };
          // Después de la compresión, renombramos el archivo:
          const compressedFile = await imageCompression(file, options);
          const newFile = new File(
            [compressedFile],
            file.name.replace(/\.[^.]+$/, ".webp"),
            {
              type: file.type,
            }
          );
          file = newFile;
          */
          console.log("Archivo convertido:", file.name, file.type);
          const objectUrl = URL.createObjectURL(file);
          setPreviewSrc(objectUrl);
        } catch (error) {
          console.error("Error al convertir la imagen a WebP:", error);
          const objectUrl = URL.createObjectURL(file);
          setPreviewSrc(objectUrl);
        }
      } else if (file && file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewSrc(objectUrl);
      } else {
        setPreviewSrc(null);
      }

      // Actualizamos el input para que contenga el archivo convertido
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      event.target.files = dataTransfer.files;

      // Importamos dinámicamente DirectUpload solo en el cliente
      import("@rails/activestorage")
        .then(({ DirectUpload }) => {
          const uploadUrl = `${zauruBaseURL}/api/direct_uploads`;

          setUploading(true);
          setUploadProgress(0);

          const directUpload = new DirectUpload(file, uploadUrl, {
            directUploadWillStoreFileWithXHR: (xhr: XMLHttpRequest) => {
              xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                  const progress = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  setUploadProgress(progress);
                }
              });
            },
          });

          directUpload.create((error, blob) => {
            setUploading(false);
            if (error) {
              console.error("Error al subir el archivo:", error);
            } else {
              setValue(name, blob.signed_id);
              setValue(`${name}_file_type`, blob.content_type);

              // Input hidden para el signed_id
              const hiddenField = document.createElement("input");
              hiddenField.setAttribute("type", "hidden");
              hiddenField.setAttribute("value", blob.signed_id);
              hiddenField.setAttribute("name", name);
              // Input hidden para el content_type
              const typeHiddenField = document.createElement("input");
              typeHiddenField.setAttribute("type", "hidden");
              typeHiddenField.setAttribute("value", blob.content_type);
              typeHiddenField.setAttribute("name", `${name}_file_type`);

              const formElement = document.querySelector("form");
              if (formElement) {
                formElement.appendChild(hiddenField);
                formElement.appendChild(typeHiddenField);
              }

              // Removemos el atributo "name" del input file para evitar enviar el archivo
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("name");
              }
            }
          });
        })
        .catch((err) => console.error("Error al cargar DirectUpload:", err));
    }

    onChange && onChange(event);
    setFileDeleted(false);
  };

  /**
   * Función para eliminar el archivo. Además de limpiar la vista previa,
   * limpia el input y el valor del campo en el formulario.
   */
  const deleteFile = () => {
    setPreviewSrc(null);
    setFileDeleted(true);
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
  function renderPreview(src: string) {
    if (download) {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => window.open(src, "_blank")}
          onKeyDown={(event) => {
            if (event.key === "Enter") window.open(src, "_blank");
          }}
          className="inline-flex items-center cursor-pointer"
        >
          <DownloadIconSVG />
          <span className="ml-1 text-blue-600 underline">
            Descargar archivo
          </span>
        </div>
      );
    } else {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => window.open(src, "_blank")}
          onKeyDown={(event) => {
            if (event.key === "Enter") window.open(src, "_blank");
          }}
          className="inline-block cursor-pointer"
        >
          <img
            src={src}
            alt={name}
            className="h-48 w-48 inline mr-1 pb-1"
            style={{ objectFit: "contain", backgroundColor: "transparent" }}
          />
        </div>
      );
    }
  }

  /**
   * 1) Modo readOnly:
   *    - Si defaultValue es string, se muestra el preview (descarga/imagen).
   *    - Si no hay defaultValue (o es File), se muestra "Sin archivo".
   */
  if (readOnly) {
    return (
      <div className={`col-span-6 sm:col-span-3 ${className}`}>
        {title && (
          <label
            htmlFor={name}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {title}
          </label>
        )}
        {typeof defaultValue === "string" && defaultValue ? (
          renderPreview(defaultValue)
        ) : (
          <div className="text-sm italic text-gray-400">
            No hay archivo disponible
          </div>
        )}
      </div>
    );
  }

  /**
   * 2) Modo editable (readOnly = false):
   *    - Si se ha seleccionado una imagen o existe defaultValue y no se ha eliminado,
   *      se muestra la vista previa generada junto con un botón para eliminar el archivo.
   *    - Si se elimina el archivo o no hay ninguno, se muestra el input para cargar uno.
   */
  return (
    <div className={`col-span-6 sm:col-span-3 ${className}`}>
      {title && (
        <label
          htmlFor={name}
          className={`block mb-1 text-sm font-medium text-${color}-700`}
        >
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!fileDeleted &&
        (previewSrc ? (
          <div className="mb-2 flex items-center">
            {renderPreview(previewSrc)}
            <button
              type="button"
              onClick={deleteFile}
              className="ml-2 text-red-600 underline text-sm"
            >
              Eliminar archivo
            </button>
          </div>
        ) : (
          typeof defaultValue === "string" &&
          defaultValue && (
            <div className="mb-2 flex items-center">
              {renderPreview(defaultValue)}
              <button
                type="button"
                onClick={deleteFile}
                className="ml-2 text-red-600 underline text-sm"
              >
                Eliminar archivo
              </button>
            </div>
          )
        ))}

      <div className="flex relative items-center">
        <input
          type="file"
          id={id ?? name}
          accept={fileTypes.map((ft) => `.${ft}`).join(", ")}
          className={`block w-full rounded-md ${bgColor} ${borderColor} ${textColor} shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          {...(register ?? {})}
          ref={fileInputRef}
          name={name}
          onChange={handleInputChange}
        />

        {helpText && (
          <div className="flex items-center relative ml-3">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IdeaIconSVG />
              {showTooltip && (
                <div className="absolute -left-48 top-0 mt-8 p-2 bg-white border rounded shadow text-black z-50">
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {uploading && (
        <div className="mt-2">
          <progress
            value={uploadProgress}
            max="100"
            className="w-full"
          ></progress>
          <p className="text-sm text-blue-600 mt-1">
            Subiendo archivo: {uploadProgress}%
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">
          <span className="font-medium">¡Oops!</span>{" "}
          {error.message?.toString()}
        </p>
      )}
      {!error && hintMessage && (
        <p className={`mt-2 italic text-sm text-${color}-500`}>{hintMessage}</p>
      )}
    </div>
  );
};
