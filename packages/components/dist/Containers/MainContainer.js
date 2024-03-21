import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
export const MainContainer = (props) => {
    const { children } = props;
    return (_jsx(_Fragment, { children: _jsx("div", { className: "md:p-10 p-0 mt-10 ml-2 mr-2 mb-10 md:mt-0 md:ml-0 md:mr-0 md:mb-0", children: children }) }));
};
