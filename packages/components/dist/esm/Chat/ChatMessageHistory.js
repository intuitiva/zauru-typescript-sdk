import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIconSVG, PencilSvg } from "@zauru-sdk/icons";
import { useState, useEffect, useRef } from "react";
export const ChatMessageHistory = (props) => {
    const { author, content, onLike, onUpdateComment, id, commentOwner = false, date, imageLink, } = props;
    const initials = author ? author[0].toUpperCase() : "A";
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);
    const textAreaRef = useRef(null);
    const [shouldPulse, setShouldPulse] = useState(false);
    useEffect(() => {
        if (isUpdating && textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            textAreaRef.current.focus();
        }
    }, [isUpdating]);
    // Efecto secundario que se ejecuta cada vez que 'isUpdating' cambia
    useEffect(() => {
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
    return (_jsxs("div", { className: "p-1 rounded-xl flex items-center space-x-4 relative", children: [commentOwner && (_jsx("div", { className: "absolute top-2 right-2", children: _jsx("button", { onClick: handleUpdateClick, className: `${shouldPulse ? "animate-custom-pulse" : ""}`, children: isUpdating ? _jsx(CheckIconSVG, {}) : _jsx(PencilSvg, {}) }) })), _jsx("div", { className: `w-[0%] lg:w-[8%] h-16 bg-purple-300 rounded-full flex items-center justify-center overflow-hidden text-white text-xl font-bold`, children: initials }), _jsxs("div", { className: "flex flex-col justify-between h-full w-[92%]", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex flex-row space-x-2", children: [_jsx("div", { className: "text-xl font-medium text-black", children: author }), _jsx("div", { className: "text-xl font-medium text-gray-500", children: date && _jsxs(_Fragment, { children: [" - ", date] }) })] }), isUpdating ? (_jsx("textarea", { ref: textAreaRef, className: "bg-gray-100 rounded p-2 w-full resize-none", value: updatedContent, onChange: handleUpdate, maxLength: 254, placeholder: "Deja tus buenos deseos..." })) : (_jsx("p", { className: "text-gray-500", children: updatedContent }))] }), _jsx("div", { className: "flex justify-end items-center", children: _jsx("button", { onClick: () => { }, children: _jsx(_Fragment, {}) }) })] }), imageLink && (_jsx("div", { className: `w-[25%] flex items-center justify-center overflow-hidden text-white text-xl font-bold`, children: _jsx("div", { onClick: () => {
                        return window.open(imageLink, "_blank");
                    }, children: _jsx("img", { src: imageLink, alt: "IMG_CHAT", className: `h-48 w-48 inline mr-1 pb-1`, style: {
                            stroke: "currentColor",
                            strokeWidth: 2,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            fill: "none",
                            backgroundColor: "transparent",
                        } }) }) }))] }));
};
