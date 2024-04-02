"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowDimensions = void 0;
const react_1 = require("react");
function getWindowDimensions() {
    if (typeof window !== "undefined") {
        const { innerWidth: width } = window;
        return width;
    }
    // Devolver un valor predeterminado si window no está definido
    return 1000;
}
const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = (0, react_1.useState)(getWindowDimensions);
    (0, react_1.useEffect)(() => {
        if (typeof window !== "undefined") {
            const handleResize = () => {
                setWindowDimensions(getWindowDimensions());
            };
            // Use window load event to ensure accurate window size on initial load
            window.addEventListener("load", handleResize);
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("load", handleResize);
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);
    return windowDimensions;
};
exports.useWindowDimensions = useWindowDimensions;
