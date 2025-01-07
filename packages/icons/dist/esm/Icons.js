"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomIconFromImage = exports.AttachmentIconSVG = exports.LoaderCircleSVG = exports.LoadingIconSVG = exports.DownloadIconSVG2 = exports.DownloadIconSVG = exports.PrintIconSVG = exports.CheckIconSVG = exports.SendMessageIcon = exports.FinishLabRemisionSVG = exports.ClockIconSVG = exports.CalendarIconSVG = exports.IdeaIconSVG = exports.LoadingBarSpinnerSvg = exports.BigChecklistIcon = exports.NewDropdownSvgIcon = exports.LogoutDropDownSvgIcon = exports.ChangeDropDownSvgIcon = exports.ReportDropDownIcon = exports.UserDropdownIcon = exports.NewNavbarButtonIcon = exports.ReportButtonIcon = exports.NewButtonSvgIcon = exports.OpcionButtonSvgIcon = exports.DropDownArrowSvgIcon = exports.ArrowToRigth = exports.SpreadsheetSvgIcon = exports.ReturnButtonSvgIcon = exports.ChangeSvgIcon = exports.CloseSvgIcon = exports.PrinterButtonIcon = exports.ButtonTrashSvg = exports.WhitePencilSvg = exports.PlusSvgIcon = exports.SpinnerSvg = exports.PlusSvg = exports.SearchSVG = exports.PdfDownloadSvg = exports.TrashSvg = exports.PencilSvg = exports.EyeSvg = exports.ExitSvg = exports.MenuAlt4Svg = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const StylesConstants_js_1 = require("./StylesConstants.js");
const MenuAlt4Svg = (props = { open: false }) => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: `transition duration-100 ease h-8 w-8 ${props.open ? "transform rotate-90" : ""}`, viewBox: "0 0 20 20", fill: "white", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z", clipRule: "evenodd" }) }));
exports.MenuAlt4Svg = MenuAlt4Svg;
const ExitSvg = () => ((0, jsx_runtime_1.jsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { d: "M17.6555 6.3331a.9.9 0 0 1 .001 1.2728l-4.1032 4.1085a.4.4 0 0 0 0 .5653l4.1031 4.1088a.9002.9002 0 0 1 .0797 1.1807l-.0806.092a.9.9 0 0 1-1.2728-.0009l-4.1006-4.1068a.4.4 0 0 0-.5662 0l-4.099 4.1068a.9.9 0 1 1-1.2738-1.2718l4.1027-4.1089a.4.4 0 0 0 0-.5652L6.343 7.6059a.9002.9002 0 0 1-.0796-1.1807l.0806-.092a.9.9 0 0 1 1.2728.0009l4.099 4.1055a.4.4 0 0 0 .5662 0l4.1006-4.1055a.9.9 0 0 1 1.2728-.001z" }) }));
exports.ExitSvg = ExitSvg;
const EyeSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-blue-900 mt-2", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "2" }), (0, jsx_runtime_1.jsx)("path", { d: "M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" }), (0, jsx_runtime_1.jsx)("path", { d: "M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" })] }));
exports.EyeSvg = EyeSvg;
const PencilSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-blue-900", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" }), (0, jsx_runtime_1.jsx)("line", { x1: "13.5", y1: "6.5", x2: "17.5", y2: "10.5" })] }));
exports.PencilSvg = PencilSvg;
const TrashSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-blue-900", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("polyline", { points: "3 6 5 6 21 6" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), (0, jsx_runtime_1.jsx)("line", { x1: "10", y1: "11", x2: "10", y2: "17" }), (0, jsx_runtime_1.jsx)("line", { x1: "14", y1: "11", x2: "14", y2: "17" })] }));
exports.TrashSvg = TrashSvg;
const PdfDownloadSvg = () => ((0, jsx_runtime_1.jsx)("svg", { className: "h-6 w-6 text-blue-900", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: (0, jsx_runtime_1.jsx)("path", { d: "M14 2v7h3l-4 4-4-4h3V2" }) }));
exports.PdfDownloadSvg = PdfDownloadSvg;
const SearchSVG = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-4 w-4 text-blue-900", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [" ", (0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "10", cy: "10", r: "7" }), (0, jsx_runtime_1.jsx)("line", { x1: "21", y1: "21", x2: "15", y2: "15" })] }));
exports.SearchSVG = SearchSVG;
const PlusSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-blue-900", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "8", x2: "12", y2: "16" }), (0, jsx_runtime_1.jsx)("line", { x1: "8", y1: "12", x2: "16", y2: "12" })] }));
exports.PlusSvg = PlusSvg;
const SpinnerSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { role: "status", className: "inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [(0, jsx_runtime_1.jsx)("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), (0, jsx_runtime_1.jsx)("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })] }));
exports.SpinnerSvg = SpinnerSvg;
const PlusSvgIcon = () => {
    (0, jsx_runtime_1.jsxs)("svg", { className: "h-8 w-8 text-indigo-800", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] });
};
exports.PlusSvgIcon = PlusSvgIcon;
// =============================|  Button Icons | ==============================================
const WhitePencilSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-white-900 inline mr-1 pb-1", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" }), (0, jsx_runtime_1.jsx)("line", { x1: "13.5", y1: "6.5", x2: "17.5", y2: "10.5" })] }));
exports.WhitePencilSvg = WhitePencilSvg;
const ButtonTrashSvg = () => ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-white-900 inline mr-1 pb-1", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("polyline", { points: "3 6 5 6 21 6" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }), (0, jsx_runtime_1.jsx)("line", { x1: "10", y1: "11", x2: "10", y2: "17" }), (0, jsx_runtime_1.jsx)("line", { x1: "14", y1: "11", x2: "14", y2: "17" })] }));
exports.ButtonTrashSvg = ButtonTrashSvg;
const PrinterButtonIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-white-900 inline mr-1 pb-1", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("polyline", { points: "6 9 6 2 18 2 18 9" }), (0, jsx_runtime_1.jsx)("path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }), (0, jsx_runtime_1.jsx)("rect", { x: "6", y: "14", width: "12", height: "8" })] }));
};
exports.PrinterButtonIcon = PrinterButtonIcon;
const CloseSvgIcon = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { className: "h-6 w-6 text-grey-800", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }));
};
exports.CloseSvgIcon = CloseSvgIcon;
const ChangeSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-5 w-5 mr-1 pb-1 text-white-500 inline", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "5", cy: "18", r: "2" }), (0, jsx_runtime_1.jsx)("circle", { cx: "19", cy: "6", r: "2" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3" }), (0, jsx_runtime_1.jsx)("path", { d: "M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3" })] }));
};
exports.ChangeSvgIcon = ChangeSvgIcon;
const ReturnButtonSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-white-500 mr-1 pb-1 inline", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M15 11l4 4l-4 4m4 -4h-11a4 4 0 0 1 0 -8h1" })] }));
};
exports.ReturnButtonSvgIcon = ReturnButtonSvgIcon;
const SpreadsheetSvgIcon = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-white-500 inline mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }));
};
exports.SpreadsheetSvgIcon = SpreadsheetSvgIcon;
const ArrowToRigth = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", width: "25", height: "50", children: [(0, jsx_runtime_1.jsx)("line", { x1: "10", y1: "25", x2: "40", y2: "25", stroke: "black", strokeWidth: "2" }), (0, jsx_runtime_1.jsx)("polygon", { points: "40,25 30,35 30,15", fill: "black" })] }));
};
exports.ArrowToRigth = ArrowToRigth;
const DropDownArrowSvgIcon = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { className: "w-5 h-5 mx-1", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { d: "M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z", fill: "currentColor" }) }));
};
exports.DropDownArrowSvgIcon = DropDownArrowSvgIcon;
const OpcionButtonSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-white-500 inline", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "12", r: "3" })] }));
};
exports.OpcionButtonSvgIcon = OpcionButtonSvgIcon;
const NewButtonSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-5 w-5 text-white-500 inline mr-1", width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }));
};
exports.NewButtonSvgIcon = NewButtonSvgIcon;
const ReportButtonIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-5 w-5 text-white-500 inline mx-1", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), (0, jsx_runtime_1.jsx)("polyline", { points: "14 2 14 8 20 8" }), (0, jsx_runtime_1.jsx)("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), (0, jsx_runtime_1.jsx)("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), (0, jsx_runtime_1.jsx)("polyline", { points: "10 9 9 9 8 9" })] }));
};
exports.ReportButtonIcon = ReportButtonIcon;
// =============================|  Nav Bar Icons | ==============================================
const NewNavbarButtonIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-5 w-5 text-white-500 inline pb-1`, width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }));
};
exports.NewNavbarButtonIcon = NewNavbarButtonIcon;
// =============================|  Nav Bar dropdown Icons | ==============================================
const UserDropdownIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-8 w-8 mx-1 ${StylesConstants_js_1.applicationDropDownIconColor}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), (0, jsx_runtime_1.jsx)("circle", { cx: "12", cy: "7", r: "4" })] }));
};
exports.UserDropdownIcon = UserDropdownIcon;
const ReportDropDownIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-5 w-5 ${StylesConstants_js_1.applicationDropDownIconColor} inline mr-1`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), (0, jsx_runtime_1.jsx)("polyline", { points: "14 2 14 8 20 8" }), (0, jsx_runtime_1.jsx)("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), (0, jsx_runtime_1.jsx)("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), (0, jsx_runtime_1.jsx)("polyline", { points: "10 9 9 9 8 9" })] }));
};
exports.ReportDropDownIcon = ReportDropDownIcon;
const ChangeDropDownSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-5 w-5 ${StylesConstants_js_1.applicationDropDownIconColor} inline mr-1`, width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "5", cy: "18", r: "2" }), (0, jsx_runtime_1.jsx)("circle", { cx: "19", cy: "6", r: "2" }), (0, jsx_runtime_1.jsx)("path", { d: "M19 8v5a5 5 0 0 1 -5 5h-3l3 -3m0 6l-3 -3" }), (0, jsx_runtime_1.jsx)("path", { d: "M5 16v-5a5 5 0 0 1 5 -5h3l-3 -3m0 6l3 -3" })] }));
};
exports.ChangeDropDownSvgIcon = ChangeDropDownSvgIcon;
const LogoutDropDownSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-5 w-5 mr-1 ${StylesConstants_js_1.applicationDropDownIconColor} inline mr-1`, width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" }), (0, jsx_runtime_1.jsx)("path", { d: "M7 12h14l-3 -3m0 6l3 -3" })] }));
};
exports.LogoutDropDownSvgIcon = LogoutDropDownSvgIcon;
const NewDropdownSvgIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-5 w-5 mr-1 ${StylesConstants_js_1.applicationDropDownIconColor} inline mr-1`, width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), (0, jsx_runtime_1.jsx)("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }));
};
exports.NewDropdownSvgIcon = NewDropdownSvgIcon;
// =============================| Info Page Icons | ==============================================
const BigChecklistIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: `h-32 w-32 ${StylesConstants_js_1.greenColorIcon}`, width: "24", height: "24", viewBox: "0 0 24 24", strokeWidth: "2", stroke: "currentColor", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { stroke: "none", d: "M0 0h24v24H0z" }), (0, jsx_runtime_1.jsx)("path", { d: "M3.5 5.5l1.5 1.5l2.5 -2.5" }), (0, jsx_runtime_1.jsx)("path", { d: "M3.5 11.5l1.5 1.5l2.5 -2.5" }), (0, jsx_runtime_1.jsx)("path", { d: "M3.5 17.5l1.5 1.5l2.5 -2.5" }), (0, jsx_runtime_1.jsx)("line", { x1: "11", y1: "6", x2: "20", y2: "6" }), (0, jsx_runtime_1.jsx)("line", { x1: "11", y1: "12", x2: "20", y2: "12" }), (0, jsx_runtime_1.jsx)("line", { x1: "11", y1: "18", x2: "20", y2: "18" })] }));
};
exports.BigChecklistIcon = BigChecklistIcon;
// =============================| label Icons | ==============================================
const LoadingBarSpinnerSvg = (barColor = StylesConstants_js_1.progressBarLightTextColor, spinnerFillColor = StylesConstants_js_1.progressBarSpinnerFillColor) => ((0, jsx_runtime_1.jsxs)("svg", { role: "status", className: `inline w-3 h-3 mr-1 mb-0.5 ${barColor} animate-spin dark:text-gray-600 ${spinnerFillColor} dark:fill-gray-300`, viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [(0, jsx_runtime_1.jsx)("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), (0, jsx_runtime_1.jsx)("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })] }));
exports.LoadingBarSpinnerSvg = LoadingBarSpinnerSvg;
const IdeaIconSVG = () => ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", width: "32px", height: "32px", children: (0, jsx_runtime_1.jsx)("path", { d: "M 6.8125 2.40625 L 5.40625 3.8125 L 7.5 5.90625 L 8.90625 4.5 Z M 25.1875 2.40625 L 23.09375 4.5 L 24.5 5.90625 L 26.59375 3.8125 Z M 16 3.03125 C 15.671875 3.035156 15.335938 3.054688 15 3.09375 C 14.988281 3.09375 14.980469 3.09375 14.96875 3.09375 C 10.914063 3.558594 7.6875 6.835938 7.125 10.875 C 6.675781 14.125 8.015625 17.070313 10.25 18.96875 C 11.207031 19.789063 11.796875 20.882813 12 22 L 12 28 L 14.28125 28 C 14.628906 28.597656 15.261719 29 16 29 C 16.738281 29 17.371094 28.597656 17.71875 28 L 20 28 L 20 24 L 20.09375 24 L 20.09375 22.8125 C 20.09375 21.347656 20.855469 19.867188 22.09375 18.71875 C 23.75 17.0625 25 14.707031 25 12 C 25 7.058594 20.933594 2.984375 16 3.03125 Z M 16 5.03125 C 19.863281 4.976563 23 8.140625 23 12 C 23 14.09375 22.03125 15.9375 20.6875 17.28125 L 20.71875 17.3125 C 19.375 18.566406 18.515625 20.207031 18.28125 22 L 13.90625 22 C 13.6875 20.285156 12.949219 18.628906 11.5625 17.4375 C 9.796875 15.933594 8.742188 13.675781 9.09375 11.125 C 9.53125 7.972656 12.085938 5.441406 15.21875 5.09375 C 15.480469 5.0625 15.742188 5.035156 16 5.03125 Z M 2 12 L 2 14 L 5 14 L 5 12 Z M 27 12 L 27 14 L 30 14 L 30 12 Z M 7.5 20.09375 L 5.40625 22.1875 L 6.8125 23.59375 L 8.90625 21.5 Z M 24.5 20.09375 L 23.09375 21.5 L 25.1875 23.59375 L 26.59375 22.1875 Z M 14 24 L 18 24 L 18 26 L 14 26 Z" }) }));
exports.IdeaIconSVG = IdeaIconSVG;
const CalendarIconSVG = () => ((0, jsx_runtime_1.jsx)("svg", { "aria-hidden": "true", className: "w-5 h-5 text-gray-500", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z", clipRule: "evenodd" }) }));
exports.CalendarIconSVG = CalendarIconSVG;
const ClockIconSVG = () => ((0, jsx_runtime_1.jsx)("svg", { "aria-hidden": "true", className: "w-5 h-5 text-gray-500", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", d: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 1a7 7 0 100 14 7 7 0 000-14zM9 5a1 1 0 012 0v4a1 1 0 01.293.707l1 1a1 1 0 11-1.414 1.414L10 11H9V5z", clipRule: "evenodd" }) }));
exports.ClockIconSVG = ClockIconSVG;
const FinishLabRemisionSVG = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("rect", { x: "2", y: "2", width: "14", height: "20" }), (0, jsx_runtime_1.jsx)("line", { x1: "2", y1: "6", x2: "16", y2: "6" }), (0, jsx_runtime_1.jsx)("path", { d: "M19,2 L22,2 L22,16 C22,17.1046 21.1046,18 20,18 L18,18 C16.8954,18 16,17.1046 16,16 L16,2 L19,2 Z" }), (0, jsx_runtime_1.jsx)("polyline", { points: "16 6 18 8 22 4" })] }));
};
exports.FinishLabRemisionSVG = FinishLabRemisionSVG;
const SendMessageIcon = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", fill: "none", viewBox: "0 0 24 24", id: "send", children: [(0, jsx_runtime_1.jsx)("path", { fill: "#000", fillRule: "evenodd", d: "M3.48935 7.06989C2.63559 4.93551 4.87248 2.8773 6.92858 3.90535L18.6458 9.76397C20.4884 10.6853 20.4884 13.3148 18.6458 14.2361L6.92857 20.0947C4.87247 21.1228 2.6356 19.0646 3.48935 16.9302L5.4614 12L3.48935 7.06989ZM6.48136 4.79977C5.2477 4.18294 3.90557 5.41788 4.41782 6.6985L6.46416 11.8143C6.51184 11.9335 6.51184 12.0665 6.46416 12.1857L4.41782 17.3016C3.90557 18.5822 5.2477 19.8171 6.48136 19.2003L18.1986 13.3417C19.3042 12.7889 19.3042 11.2112 18.1986 10.6584L6.48136 4.79977Z", clipRule: "evenodd" }), (0, jsx_runtime_1.jsx)("path", { fill: "#000", fillRule: "evenodd", d: "M5.5 11.5H10V12.5H5.5V11.5Z", clipRule: "evenodd" })] }));
};
exports.SendMessageIcon = SendMessageIcon;
const CheckIconSVG = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: (0, jsx_runtime_1.jsx)("polyline", { points: "20 6 9 17 4 12" }) }));
};
exports.CheckIconSVG = CheckIconSVG;
const PrintIconSVG = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { className: "h-6 w-6 text-blue-400", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "0.5", strokeLinecap: "round", strokeLinejoin: "round", children: [(0, jsx_runtime_1.jsx)("path", { d: "M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z" }), (0, jsx_runtime_1.jsx)("circle", { cx: "18", cy: "11.5", r: "1" })] }));
};
exports.PrintIconSVG = PrintIconSVG;
const DownloadIconSVG = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "22", id: "download", children: (0, jsx_runtime_1.jsx)("g", { fill: "none", fillRule: "evenodd", stroke: "#000", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", children: (0, jsx_runtime_1.jsx)("path", { d: "M1 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M6 11l4 4 4-4M10 1v14" }) }) }));
};
exports.DownloadIconSVG = DownloadIconSVG;
const DownloadIconSVG2 = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { "data-testid": "geist-icon", height: "16", strokeLinejoin: "round", viewBox: "0 0 16 16", width: "16", children: (0, jsx_runtime_1.jsx)("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.75 1V1.75V8.68934L10.7197 6.71967L11.25 6.18934L12.3107 7.25L11.7803 7.78033L8.70711 10.8536C8.31658 11.2441 7.68342 11.2441 7.29289 10.8536L4.21967 7.78033L3.68934 7.25L4.75 6.18934L5.28033 6.71967L7.25 8.68934V1.75V1H8.75ZM13.5 9.25V13.5H2.5V9.25V8.5H1V9.25V14C1 14.5523 1.44771 15 2 15H14C14.5523 15 15 14.5523 15 14V9.25V8.5H13.5V9.25Z", fill: "currentColor" }) }));
};
exports.DownloadIconSVG2 = DownloadIconSVG2;
const LoadingIconSVG = () => {
    return ((0, jsx_runtime_1.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 64 64", id: "loading", className: "animate-spin", children: (0, jsx_runtime_1.jsx)("path", { fill: "#88e2de", d: "M50.287 32A18.287 18.287 0 1 1 32 13.713a1.5 1.5 0 1 1 0 3A15.287 15.287 0 1 0 47.287 32a1.5 1.5 0 0 1 3 0Z", name: "Loading" }) }));
};
exports.LoadingIconSVG = LoadingIconSVG;
const LoaderCircleSVG = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { "data-testid": "geist-icon", height: "16", strokeLinejoin: "round", viewBox: "0 0 16 16", width: "16", children: [(0, jsx_runtime_1.jsxs)("g", { clipPath: "url(#clip0_2393_1490)", children: [(0, jsx_runtime_1.jsx)("path", { d: "M8 0V4", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.5", d: "M8 16V12", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.9", d: "M3.29773 1.52783L5.64887 4.7639", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.1", d: "M12.7023 1.52783L10.3511 4.7639", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.4", d: "M12.7023 14.472L10.3511 11.236", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.6", d: "M3.29773 14.472L5.64887 11.236", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.2", d: "M15.6085 5.52783L11.8043 6.7639", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.7", d: "M0.391602 10.472L4.19583 9.23598", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.3", d: "M15.6085 10.4722L11.8043 9.2361", stroke: "currentColor", strokeWidth: "1.5" }), (0, jsx_runtime_1.jsx)("path", { opacity: "0.8", d: "M0.391602 5.52783L4.19583 6.7639", stroke: "currentColor", strokeWidth: "1.5" })] }), (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsx)("clipPath", { id: "clip0_2393_1490", children: (0, jsx_runtime_1.jsx)("rect", { width: "16", height: "16", fill: "white" }) }) })] }));
};
exports.LoaderCircleSVG = LoaderCircleSVG;
const AttachmentIconSVG = () => {
    return ((0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "25", height: "25", viewBox: "0 0 100 100", id: "attachment", children: [(0, jsx_runtime_1.jsx)("g", { children: (0, jsx_runtime_1.jsx)("path", { d: "M18.8 85.1c-7.8-7.8-7.8-20.5 0-28.3L63.1 13c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8L38.6 76.7c-3.1 3.1-8.2 3.1-11.3 0-3.1-3.1-3.1-8.2 0-11.3l22.3-21.8c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8L30.2 68.2c-1.5 1.5-1.5 4.1 0 5.6 1.6 1.6 4.1 1.6 5.7 0L80.2 30c3.9-3.9 3.9-10.2 0-14.1-3.9-3.9-10.2-3.9-14.1 0L21.7 59.7c-6.2 6.2-6.2 16.4 0 22.6 6.3 6.2 16.4 6.2 22.6 0l38.3-37.8c.8-.8 2.1-.8 2.8 0 .8.8.8 2.1 0 2.8L47.1 85.2c-7.8 7.7-20.4 7.8-28.3-.1z" }) }), (0, jsx_runtime_1.jsx)("g", { children: (0, jsx_runtime_1.jsx)("path", { fill: "#00F", d: "M664-510v1684h-1784V-510H664m8-8h-1800v1700H672V-518z" }) })] }));
};
exports.AttachmentIconSVG = AttachmentIconSVG;
const CustomIconFromImage = ({ imageName, height = 6, width = 6, }) => {
    // Asegúrate de que el nombre de la imagen incluya la extensión adecuada (por ejemplo, .png)
    const imagePath = `/icons/${imageName}`;
    return ((0, jsx_runtime_1.jsx)("img", { src: imagePath, alt: imageName, className: `h-${height} w-${width} inline mr-1 pb-1`, style: {
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            fill: "none",
            backgroundColor: "transparent",
        } }));
};
exports.CustomIconFromImage = CustomIconFromImage;
