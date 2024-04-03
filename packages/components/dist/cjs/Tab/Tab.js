"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const node_1 = require("@remix-run/node");
const react_1 = require("@remix-run/react");
const react_2 = __importDefault(require("react"));
//<reference> https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/tabs/text
const Tabs = (props) => {
    const { items } = props;
    const [openTab, setOpenTab] = react_2.default.useState(1);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("ul", { className: "flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row", role: "tablist", children: items?.map((item, index) => {
                            return ((0, jsx_runtime_1.jsx)("li", { className: "mb-px mr-2 last:mr-0 flex-auto text-center", children: (0, jsx_runtime_1.jsx)("a", { className: "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                        (openTab === index
                                            ? "text-white bg-red-600"
                                            : "text-red-600 bg-white"), onClick: (e) => {
                                        e.preventDefault();
                                        setOpenTab(index);
                                        (0, node_1.redirect)(item.link);
                                    }, "data-toggle": "tab", href: item.link, role: "tablist", children: item.title }, index) }, index));
                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded", children: (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-5 flex-auto", children: (0, jsx_runtime_1.jsx)("div", { className: "tab-content tab-space", children: (0, jsx_runtime_1.jsx)(react_1.Outlet, {}) }) }) })] }) }) }));
};
exports.Tabs = Tabs;
