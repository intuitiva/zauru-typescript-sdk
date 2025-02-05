import { useFetcher } from "@remix-run/react";
import {
  FetcherErrorType,
  ReduxParamsConfig,
  TEMPLATE_NAMES,
  templateFetchStart,
  templateFetchSuccess,
  useAppDispatch,
  useAppSelector,
} from "@zauru-sdk/redux";
import { useEffect, useState } from "react";
import { showAlert } from "./index.js";

type ProfileType<T> = {
  data: T;
  loading: boolean;
};

// Opcional: si tu backend retorna un objeto con la forma { templateName: ... }
type TemplateData<T> = {
  [key: string]: T;
};

function useGetTemplateObject<T>(
  TEMPLATE_NAME: TEMPLATE_NAMES,
  config: ReduxParamsConfig = {}
): ProfileType<T> {
  try {
    const dispatch = useAppDispatch();
    const fetcher = useFetcher<FetcherErrorType | TemplateData<T>>();

    // Obtenemos del store lo que ya se tenga
    const objectData = useAppSelector(
      (state) => state.templates[TEMPLATE_NAME]
    );

    // Verifica si ya tenemos algo en Redux
    const hasLocalData =
      objectData?.data && Object.keys(objectData.data).length > 0;

    // Estado local para data y loading
    const [data, setData] = useState<ProfileType<T>>({
      data: hasLocalData ? (objectData?.data as T) : ({} as T),
      loading: false,
    });

    /**
     * 1) Efecto para decidir si hacemos fetch o no.
     *    - Si `config.online === true`, forzamos fetch.
     *    - Si `objectData.reFetch === true`, forzamos fetch (si así lo manejas en redux).
     *    - Si no tenemos datos locales, forzamos fetch.
     *    - En caso contrario, mostramos datos locales y no hacemos fetch.
     */
    useEffect(() => {
      const mustFetch = config.online || objectData?.reFetch || !hasLocalData;

      if (mustFetch) {
        setData((prev) => ({ ...prev, loading: true }));
        dispatch(templateFetchStart(TEMPLATE_NAME));

        // Aquí hacemos la llamada a la API a través del fetcher
        try {
          fetcher.load(`/api/templates?object=${TEMPLATE_NAME}`);
        } catch (error) {
          console.error(error);
          // Si hay datos locales, los conservamos; si no, data queda vacío
          setData({
            data: hasLocalData ? (objectData?.data as T) : ({} as T),
            loading: false,
          });
          showAlert({
            type: "error",
            title: `Error al cargar la plantilla: ${TEMPLATE_NAME}`,
            description: `Error: ${String(error)}`,
          });
        }
      } else {
        // Si NO debemos hacer fetch, aseguramos loading en false
        // y usamos lo que haya en Redux
        setData({
          data: hasLocalData ? (objectData?.data as T) : ({} as T),
          loading: false,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.online, objectData?.reFetch, hasLocalData, TEMPLATE_NAME]);

    /**
     * 2) Efecto para cuando el fetcher termina (fetcher.state === "idle").
     *    Decidimos si lo que vino es error o data, y procedemos.
     */
    useEffect(() => {
      if (fetcher.state === "idle") {
        if (fetcher.data) {
          // Podría ser un error o ser la data
          const possibleError = fetcher.data as FetcherErrorType;
          const possibleData = fetcher.data as TemplateData<T>;

          // Si detectamos que es un objeto con 'description', interpretamos error
          if (possibleError.description) {
            // Ya teníamos datos locales?
            if (hasLocalData) {
              // Mostramos alert, pero NO borramos los datos locales
              showAlert({
                type: possibleError.type || "error",
                title: possibleError.title || "Error",
                description: possibleError.description,
              });
              // Dejamos loading en false, data queda como estaba
              setData((prev) => ({ ...prev, loading: false }));
            } else {
              // No hay datos locales, error fatal
              showAlert({
                type: possibleError.type || "error",
                title: possibleError.title || "Error",
                description: possibleError.description,
              });
              setData({ data: {} as T, loading: false });
            }
          } else {
            // Caso: es data real (ajusta la forma en que tu backend envía la info)
            const newData = possibleData[TEMPLATE_NAME];

            if (newData) {
              // Guardamos en redux y en el state local
              dispatch(
                templateFetchSuccess({
                  name: TEMPLATE_NAME,
                  data: newData,
                })
              );
              setData({ data: newData, loading: false });
            } else {
              // No llegó la propiedad esperada en la respuesta
              if (hasLocalData) {
                // No reportar error, usamos lo local
                setData((prev) => ({ ...prev, loading: false }));
              } else {
                // No tenemos nada local -> error
                showAlert({
                  type: "error",
                  title: `Error al recibir la plantilla: ${TEMPLATE_NAME}`,
                  description: `No se encontró "${TEMPLATE_NAME}" en la respuesta de la API.`,
                });
                setData((prev) => ({ ...prev, loading: false }));
              }
            }
          }
        } else {
          // fetcher.state === "idle" pero fetcher.data = null/undefined
          // probablemente un error global (red, servidor caído, etc.)
          if (hasLocalData) {
            // Fallback a datos locales
            setData((prev) => ({ ...prev, loading: false }));
          } else {
            // Ni API ni local data => error
            showAlert({
              type: "error",
              title: `Error al cargar la plantilla ${TEMPLATE_NAME}`,
              description: `No se obtuvo respuesta y no hay datos locales.`,
            });
            setData({ data: {} as T, loading: false });
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.state]);

    // Retornamos el estado final
    return data;
  } catch (err) {
    console.error(err);
    return {
      data: {} as T,
      loading: false,
    };
  }
}

export const useGetReceptionTemplate = (
  config?: ReduxParamsConfig
): {
  loading: boolean;
  data: string;
} => useGetTemplateObject<string>("receptionTemplate", config);
