import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const getConfig = (type) => {
    switch (type) {
        case "info":
            return {
                containerClassName: "text-blue-900 bg-blue-100 border border-blue-200 rounded-md",
                buttonClassName: "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                path: (_jsx("path", { d: "M14.1667 17h-3.3334c-.5 0-.8333-.3146-.8333-.7865 0-.472.3333-.7865.8333-.7865H11.5c.0833 0 .1667-.0787.1667-.1573v-3.5394c0-.0786-.0834-.1573-.1667-.1573h-.6667c-.5 0-.8333-.3146-.8333-.7865S10.3333 10 10.8333 10h.8334c.9166 0 1.6666.7079 1.6666 1.573v3.7753c0 .0787.0834.1573.1667.1573h.6667c.5 0 .8333.3146.8333.7865 0 .472-.3333.7079-.8333.7079zM12.3 6c.6933 0 1.3.6067 1.3 1.3s-.52 1.3-1.3 1.3S11 7.9933 11 7.3 11.6067 6 12.3 6zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" })),
            };
        case "success":
            return {
                containerClassName: "text-green-900 bg-green-100 border border-green-200 rounded-md",
                buttonClassName: "rounded-md focus:outline-none focus:ring-2 focus:ring-green-500",
                path: (_jsx("path", { d: "M8.445 12.6675A.9.9 0 0 0 7.1424 13.91l2.5726 2.7448c.3679.3856.9884.3689 1.335-.036l5.591-7.0366a.9.9 0 0 0-1.3674-1.1705l-4.6548 5.9132a.4.4 0 0 1-.607.0252l-1.567-1.6826zM1.9995 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" })),
            };
        default:
            return {
                containerClassName: "text-blue-900 bg-blue-100 border border-blue-200 rounded-md",
                buttonClassName: "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                path: (_jsx("path", { d: "M14.1667 17h-3.3334c-.5 0-.8333-.3146-.8333-.7865 0-.472.3333-.7865.8333-.7865H11.5c.0833 0 .1667-.0787.1667-.1573v-3.5394c0-.0786-.0834-.1573-.1667-.1573h-.6667c-.5 0-.8333-.3146-.8333-.7865S10.3333 10 10.8333 10h.8334c.9166 0 1.6666.7079 1.6666 1.573v3.7753c0 .0787.0834.1573.1667.1573h.6667c.5 0 .8333.3146.8333.7865 0 .472-.3333.7079-.8333.7079zM12.3 6c.6933 0 1.3.6067 1.3 1.3s-.52 1.3-1.3 1.3S11 7.9933 11 7.3 11.6067 6 12.3 6zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2" })),
            };
    }
};
export const StaticAlert = (props) => {
    const { className, title, description, onClose, type = "info", loading = false, } = props;
    const config = getConfig(type);
    return (_jsx("div", { className: `${className} ${config.containerClassName} ${loading ? " hidden" : ""}`, children: _jsxs("div", { className: "flex justify-between flex-wrap", children: [_jsxs("div", { className: "w-0 flex-1 flex", children: [_jsx("div", { className: "mr-3 pt-1", children: _jsx("svg", { width: "26", height: "26", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: config.path }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-md leading-6 font-medium", children: title }), _jsx("div", { className: "text-sm", children: description })] })] }), onClose && (_jsx("div", { children: _jsx("button", { type: "button", className: `${config.buttonClassName}`, onClick: onClose, children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: _jsx("path", { d: "M17.6555 6.3331a.9.9 0 0 1 .001 1.2728l-4.1032 4.1085a.4.4 0 0 0 0 .5653l4.1031 4.1088a.9002.9002 0 0 1 .0797 1.1807l-.0806.092a.9.9 0 0 1-1.2728-.0009l-4.1006-4.1068a.4.4 0 0 0-.5662 0l-4.099 4.1068a.9.9 0 1 1-1.2738-1.2718l4.1027-4.1089a.4.4 0 0 0 0-.5652L6.343 7.6059a.9002.9002 0 0 1-.0796-1.1807l.0806-.092a.9.9 0 0 1 1.2728.0009l4.099 4.1055a.4.4 0 0 0 .5662 0l4.1006-4.1055a.9.9 0 0 1 1.2728-.001z" }) }) }) }))] }) }));
};
