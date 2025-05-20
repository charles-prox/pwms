import React, { ReactNode, useEffect } from "react";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { WarningIcon, DangerIcon, InfoIcon, SuccessIcon } from "./icons";
import { CloseIcon } from "../Shared/Alert/icons";
import { useTheme } from "@/Contexts/ThemeContext";

type ModalAlertProps = {
    isOpen: boolean;
    setIsAlertOpen: (isOpen: boolean) => void;
    type?: "error" | "warning" | "info" | "success";
    title?: string;
    message?: string;
    autoClose?: boolean;
};

const ModalAlert: React.FC<ModalAlertProps> = ({
    isOpen,
    setIsAlertOpen,
    type = "success",
    title,
    message,
    autoClose = false,
}) => {
    const { theme } = useTheme();

    const icon = (): ReactNode => {
        const size = 90;
        switch (type) {
            case "error":
                return <DangerIcon width={size} height={size} />;
            case "warning":
                return <WarningIcon width={size} height={size} />;
            case "info":
                return <InfoIcon width={size} height={size} />;
            case "success":
            default:
                return <SuccessIcon width={size} height={size} />;
        }
    };

    const defaults = () => {
        switch (type) {
            case "error":
                return {
                    title: "Error!",
                    message:
                        "An error occurred. Please try again or contact support if the problem persists.",
                };
            case "warning":
                return {
                    title: "Warning!",
                    message:
                        "Proceed with caution. Please check the details before continuing.",
                };
            case "info":
                return {
                    title: "Information!",
                    message:
                        "Here is some information that you might find useful.",
                };
            case "success":
            default:
                return {
                    title: "Success!",
                    message: "Your changes have been successfully saved!",
                };
        }
    };

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsAlertOpen(false);
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [autoClose, setIsAlertOpen]);

    return (
        <Modal
            isOpen={isOpen}
            placement="top"
            backdrop="transparent"
            shadow="lg"
            isDismissable={true}
            isKeyboardDismissDisabled={true}
            className={`${theme}`}
            closeButton={
                <Button
                    variant="flat"
                    isIconOnly
                    onPress={() => setIsAlertOpen(false)}
                >
                    <CloseIcon />
                </Button>
            }
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                },
            }}
        >
            <ModalContent>
                <ModalBody>
                    <div className="flex gap-3 p-3">
                        {/* Alert Icon */}
                        <div>{icon()}</div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                {title || defaults().title}
                            </h3>
                            <p className="text-default-500 text-sm">
                                {message || defaults().message}
                            </p>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ModalAlert;
