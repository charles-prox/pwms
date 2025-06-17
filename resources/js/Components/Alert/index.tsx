"use client";
import { Button, Card } from "@heroui/react";
import React, { useEffect, useState, memo } from "react";
import {
    CloseIcon,
    DangerIcon,
    InfoIcon,
    SuccessIcon,
    WarningIcon,
} from "./icons";

type AlertType = "error" | "warning" | "info" | "success";
type AlertVariant = "solid" | "flat" | "bordered";
type AllowedColors =
    | "warning"
    | "success"
    | "primary"
    | "danger"
    | "secondary"
    | "default"
    | undefined;

interface AlertProps {
    show: boolean;
    title: string;
    type: AlertType;
    variant: AlertVariant;
    message: string | React.ReactNode;
    isCloseable?: boolean;
}

const iconMap: Record<AlertType, JSX.Element> = {
    error: <DangerIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />,
    success: <SuccessIcon />,
};

const colorMap: Record<AlertType, AllowedColors> = {
    error: "danger",
    warning: "warning",
    info: "secondary",
    success: "success",
};

const changeColor = (type: AlertType): AllowedColors => {
    return colorMap[type] ?? "primary"; // Ensures a valid fallback
};

const Alert = memo(
    ({
        show,
        title,
        type,
        variant,
        message,
        isCloseable = true,
    }: AlertProps) => {
        const [isVisible, setIsVisible] = useState(show);
        const [isClosing, setIsClosing] = useState(false);

        useEffect(() => {
            setIsVisible(show);
        }, [show]);

        const handleClose = () => {
            setIsClosing(true);
            setTimeout(() => setIsVisible(false), 300);
        };

        const classes = () => {
            const baseColor = changeColor(type); // Explicitly pass type
            return {
                solid: `text-slate-100 bg-${baseColor}/90`,
                flat: `text-${baseColor} bg-${baseColor}/20`,
                bordered: `text-${baseColor} border-2 border-${baseColor} bg-transparent`,
            }[variant];
        };

        return (
            <div
                role="alert"
                aria-live="assertive"
                className={`w-full mb-4 transition duration-300 ease-out ${
                    isVisible ? "opacity-100" : "hidden"
                } ${isClosing ? "opacity-0" : ""}`}
            >
                <Card shadow="none" className={`p-2 ${classes()}`}>
                    <div className="flex items-center">
                        <div className="pr-2 pt-1">{iconMap[type]}</div>
                        <div className="flex-grow">
                            {title && (
                                <p className="text-sm font-bold">{title}</p>
                            )}
                            {typeof message === "string" ? (
                                <p className="text-xs">{message}</p>
                            ) : (
                                <>{message}</>
                            )}
                        </div>
                        {isCloseable && (
                            <div className="self-start pl-1">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    radius="full"
                                    color={changeColor(type)} // Explicitly pass type
                                    size="sm"
                                    className="hover:bg-neutral-100/5"
                                    onPress={handleClose}
                                >
                                    <CloseIcon />
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        );
    }
);

export default Alert;
