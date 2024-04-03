"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageHistory = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_1 = require("@zauru-sdk/icons");
const react_1 = require("react");
const ChatMessageHistory = (props) => {
    const { author, content, onLike, onUpdateComment, id, commentOwner = false, date, imageLink, } = props;
    const initials = author ? author[0].toUpperCase() : "A";
    const [isUpdating, setIsUpdating] = (0, react_1.useState)(false);
    const [updatedContent, setUpdatedContent] = (0, react_1.useState)(content);
    const textAreaRef = (0, react_1.useRef)(null);
    const [shouldPulse, setShouldPulse] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isUpdating && textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            textAreaRef.current.focus();
        }
    }, [isUpdating]);
    // Efecto secundario que se ejecuta cada vez que 'isUpdating' cambia
    (0, react_1.useEffect)(() => {
        // Activar la animación
        setShouldPulse(true);
        // Establecer un temporizador para eliminar la clase después de que la animación se haya completado
        const timer = setTimeout(() => {
            setShouldPulse(false);
        }, 15000); // Tiempo total de la animación
        // Limpiar el temporizador si el componente se desmonta o si 'isUpdating' cambia de nuevo antes de que la animación se complete
        return () => clearTimeout(timer);
    }, [isUpdating]);
    const handleUpdate = (e) => {
        if (e.target.value.length <= 254) {
            setUpdatedContent(e.target.value);
        }
    };
    const handleUpdateClick = () => {
        if (isUpdating) {
            if (textAreaRef.current) {
                textAreaRef.current.blur();
            }
            //onUpdateComment && onUpdateComment(updatedContent, itsNew);
        }
        setIsUpdating(!isUpdating);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-1 rounded-xl flex items-center space-x-4 relative", children: [commentOwner && ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleUpdateClick, className: `${shouldPulse ? "animate-custom-pulse" : ""}`, children: isUpdating ? (0, jsx_runtime_1.jsx)(icons_1.CheckIconSVG, {}) : (0, jsx_runtime_1.jsx)(icons_1.PencilSvg, {}) }) })), (0, jsx_runtime_1.jsx)("div", { className: `w-[0%] lg:w-[8%] h-16 bg-purple-300 rounded-full flex items-center justify-center overflow-hidden text-white text-xl font-bold`, children: initials }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-between h-full w-[92%]", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xl font-medium text-black", children: author }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-medium text-gray-500", children: date && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [" - ", date] }) })] }), isUpdating ? ((0, jsx_runtime_1.jsx)("textarea", { ref: textAreaRef, className: "bg-gray-100 rounded p-2 w-full resize-none", value: updatedContent, onChange: handleUpdate, maxLength: 254, placeholder: "Deja tus buenos deseos..." })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: updatedContent }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end items-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => { }, children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }) })] }), imageLink && ((0, jsx_runtime_1.jsx)("div", { className: `w-[25%] flex items-center justify-center overflow-hidden text-white text-xl font-bold`, children: (0, jsx_runtime_1.jsx)("div", { onClick: () => {
                        return window.open(imageLink, "_blank");
                    }, children: (0, jsx_runtime_1.jsx)("img", { src: imageLink, alt: "IMG_CHAT", className: `h-48 w-48 inline mr-1 pb-1`, style: {
                            stroke: "currentColor",
                            strokeWidth: 2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            fill: "none",
                            backgroundColor: "transparent",
                        } }) }) }))] }));
};
exports.ChatMessageHistory = ChatMessageHistory;
