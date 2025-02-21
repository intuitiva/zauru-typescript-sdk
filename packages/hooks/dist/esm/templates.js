"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetReceptionTemplate = void 0;
const react_1 = require("@remix-run/react");
const redux_1 = require("@zauru-sdk/redux");
const react_2 = require("react");
const index_js_1 = require("./index.js");
function useGetTemplateObject(TEMPLATE_NAME, config = {}) {
    try {
        const dispatch = (0, redux_1.useAppDispatch)();
        const fetcher = (0, react_1.useFetcher)();
        const [fetchTriggered, setFetchTriggered] = (0, react_2.useState)(false);
        // Obtenemos del store lo que ya se tenga
        const objectData = (0, redux_1.useAppSelector)((state) => state.templates[TEMPLATE_NAME]);
        // Verifica si ya tenemos algo en Redux
        const hasLocalData = objectData?.data && Object.keys(objectData.data).length > 0;
        // Estado local para data y loading
        const [data, setData] = (0, react_2.useState)({
            data: hasLocalData ? objectData?.data : {},
            loading: false,
        });
        /**
         * 1) Efecto para decidir si hacemos fetch o no.
         *    - Si `config.online === true`, forzamos fetch.
         *    - Si `objectData.reFetch === true`, forzamos fetch (si así lo manejas en redux).
         *    - Si no tenemos datos locales, forzamos fetch.
         *    - En caso contrario, mostramos datos locales y no hacemos fetch.
         */
        (0, react_2.useEffect)(() => {
            const mustFetch = config.online || !hasLocalData;
            if (mustFetch) {
                setData((prev) => ({ ...prev, loading: true }));
                dispatch((0, redux_1.templateFetchStart)(TEMPLATE_NAME));
                // Aquí hacemos la llamada a la API a través del fetcher
                try {
                    setFetchTriggered(true);
                    fetcher.load(`/api/templates?object=${TEMPLATE_NAME}`);
                }
                catch (error) {
                    console.error(error);
                    // Si hay datos locales, los conservamos; si no, data queda vacío
                    setData({
                        data: hasLocalData ? objectData?.data : {},
                        loading: false,
                    });
                    (0, index_js_1.showAlert)({
                        type: "error",
                        title: `Error al cargar la plantilla: ${TEMPLATE_NAME}`,
                        description: `Error: ${String(error)}`,
                    });
                }
            }
            else {
                // Si NO debemos hacer fetch, aseguramos loading en false
                // y usamos lo que haya en Redux
                setData({
                    data: hasLocalData ? objectData?.data : {},
                    loading: false,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [config.online, hasLocalData, TEMPLATE_NAME]);
        /**
         * 2) Efecto para cuando el fetcher termina (fetcher.state === "idle").
         *    Decidimos si lo que vino es error o data, y procedemos.
         */
        (0, react_2.useEffect)(() => {
            // Solo ejecuto la lógica si ya disparé al menos un fetch
            if (!fetchTriggered)
                return;
            if (fetcher.state === "idle") {
                if (fetcher.data) {
                    // Podría ser un error o ser la data
                    const possibleError = fetcher.data;
                    const possibleData = fetcher.data;
                    // Si detectamos que es un objeto con 'description', interpretamos error
                    if (possibleError.description) {
                        // Ya teníamos datos locales?
                        if (hasLocalData) {
                            // Dejamos loading en false, data queda como estaba
                            setData((prev) => ({ ...prev, loading: false }));
                        }
                        else {
                            // No hay datos locales, error fatal
                            (0, index_js_1.showAlert)({
                                type: possibleError.type || "error",
                                title: possibleError.title || "Error",
                                description: possibleError.description,
                            });
                            setData({ data: {}, loading: false });
                        }
                    }
                    else {
                        // Caso: es data real (ajusta la forma en que tu backend envía la info)
                        const newData = possibleData[TEMPLATE_NAME];
                        if (newData) {
                            // Guardamos en redux y en el state local
                            dispatch((0, redux_1.templateFetchSuccess)({
                                name: TEMPLATE_NAME,
                                data: newData,
                            }));
                            setData({ data: newData, loading: false });
                        }
                        else {
                            // No llegó la propiedad esperada en la respuesta
                            if (hasLocalData) {
                                // No reportar error, usamos lo local
                                setData((prev) => ({ ...prev, loading: false }));
                            }
                            else {
                                // No tenemos nada local -> error
                                (0, index_js_1.showAlert)({
                                    type: "error",
                                    title: `Error al recibir la plantilla: ${TEMPLATE_NAME}`,
                                    description: `No se encontró "${TEMPLATE_NAME}" en la respuesta de la API.`,
                                });
                                setData((prev) => ({ ...prev, loading: false }));
                            }
                        }
                    }
                }
                else {
                    // fetcher.state === "idle" pero fetcher.data = null/undefined
                    // probablemente un error global (red, servidor caído, etc.)
                    if (hasLocalData) {
                        // Fallback a datos locales
                        setData((prev) => ({ ...prev, loading: false }));
                    }
                    else {
                        // Ni API ni local data => error
                        (0, index_js_1.showAlert)({
                            type: "error",
                            title: `Error al cargar la plantilla ${TEMPLATE_NAME}`,
                            description: `No se obtuvo respuesta y no hay datos locales.`,
                        });
                        setData({ data: {}, loading: false });
                    }
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fetcher.state]);
        // Retornamos el estado final
        return data;
    }
    catch (err) {
        console.error(err);
        return {
            data: {},
            loading: false,
        };
    }
}
const useGetReceptionTemplate = (config) => useGetTemplateObject("receptionTemplate", config);
exports.useGetReceptionTemplate = useGetReceptionTemplate;
