import { Button, Card } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
    CloseIcon,
    DangerIcon,
    InfoIcon,
    SuccessIcon,
    WarningIcon,
} from "./icons";

const Alert = ({ title, type, variant, message, isCloseable = true }) => {
    const [show, setShow] = useState(true);
    const [isClosing, setIsClosing] = useState(false); // Track closing state for transition

    // Handle close button click and transition
    const handleClose = () => {
        setIsClosing(true); // Trigger closing animation
        setTimeout(() => setShow(false), 300); // Hide after animation duration
    };

    useEffect(() => {
        // Cleanup function to remove transition classes when component unmounts
        return () => {
            setIsClosing(false); // Reset closing state on unmount
        };
    }, []);

    const startContent = (type) => {
        // Changes icon in alert component depending on type
        if (type === "error") return <DangerIcon />;
        if (type === "warning") return <WarningIcon />;
        if (type === "info") return <InfoIcon />;
        if (type === "success") return <SuccessIcon />;

        return <SuccessIcon />;
    };

    const classes = () => {
        let classnames = "";
        // Changes classes depending on variant

        const changeColor = () => {
            if (type === "error") return "danger";
            if (type === "warning") return "warning";
            if (type === "info") return "secondary";
            if (type === "success") return "success";
            return "primary";
        };

        if (variant === "solid")
            classnames = ` text-slate-100 bg-${changeColor()}/90 `;
        if (variant === "flat")
            classnames = `text-${changeColor()} bg-${changeColor()}/20`;
        if (variant === "bordered")
            classnames = ` text-${changeColor()} border-2 border-${changeColor()} bg-transparent `;

        return classnames;
    };

    return (
        <div
            className={`
            ${show ? "block transition duration-300 ease-out" : "hidden"} 
            ${isClosing ? "opacity-0" : "opacity-100"} 
            w-full mb-4
            `}
        >
            <Card shadow="none" className={`p-2 ${classes()}`}>
                <div className="flex items-center">
                    <div className="pr-2 pt-1">{startContent(type)}</div>
                    <div className="flex-grow">
                        {title && <p className="text-sm font-bold">{title}</p>}
                        <p className="text-xs">{message}</p>
                    </div>
                    <div
                        className={`${
                            !isCloseable ? "hidden" : ""
                        } self-start pl-1`}
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            color={type}
                            size="sm"
                            className="hover:bg-neutral-100/5"
                            onClick={handleClose}
                            hidden={!isCloseable}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Alert;
