import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ActionList = ({ items, disabled = false, className = "", }) => {
    return (_jsx("div", { className: `flex flex-col gap-1 ${className}`, children: items.map((item) => {
            const itemBusy = Boolean(item.loading);
            const itemDisabled = disabled || item.disabled || itemBusy;
            return (_jsxs("button", { type: "button", disabled: itemDisabled, onClick: item.onClick, className: "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-progress disabled:opacity-60", children: [item.badge ? (_jsx("span", { className: `inline-flex min-w-[2.25rem] justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${item.badgeClassName ?? "bg-gray-100 text-gray-700"}`, children: item.badge })) : null, _jsx("span", { children: itemBusy ? (item.loadingLabel ?? item.label) : item.label })] }, item.key));
        }) }));
};
