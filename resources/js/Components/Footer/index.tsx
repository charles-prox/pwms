import { Spacer } from "@heroui/react";
import React from "react";

const Footer = () => {
    return (
        <div className="w-full flex justify-between px-10">
            <p className="text-xs">Copyright &copy; 2025 PhilHealth | PRO-X</p>
            <Spacer x={5} />
            <p className="text-xs">Made with ❤️ by ArgusX</p>
        </div>
    );
};

export default Footer;
