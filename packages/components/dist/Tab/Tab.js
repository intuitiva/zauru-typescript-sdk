import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import React from "react";
//<reference> https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/tabs/text
export const Tabs = (props) => {
    const { items } = props;
    const [openTab, setOpenTab] = React.useState(1);
    return (_jsx(_Fragment, { children: _jsx("div", { className: "flex flex-wrap", children: _jsxs("div", { className: "w-full", children: [_jsx("ul", { className: "flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row", role: "tablist", children: items?.map((item, index) => {
                            return (_jsx("li", { className: "mb-px mr-2 last:mr-0 flex-auto text-center", children: _jsx("a", { className: "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                        (openTab === index
                                            ? "text-white bg-red-600"
                                            : "text-red-600 bg-white"), onClick: (e) => {
                                        e.preventDefault();
                                        setOpenTab(index);
                                        redirect(item.link);
                                    }, "data-toggle": "tab", href: item.link, role: "tablist", children: item.title }, index) }, index));
                        }) }), _jsx("div", { className: "relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded", children: _jsx("div", { className: "px-4 py-5 flex-auto", children: _jsx("div", { className: "tab-content tab-space", children: _jsx(Outlet, {}) }) }) })] }) }) }));
};
