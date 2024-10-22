import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { WarningIcon, DangerIcon, InfoIcon, SuccessIcon } from "./icons";
import { CloseIcon } from "../Alert/icons";
import { useTheme } from "@/ThemeProvider";

export default function ModalAlert({
    isOpen,
    setIsAlertOpen,
    type,
    title,
    message,
    autoClose = false,
}) {
    const { theme } = useTheme();
    const icon = () => {
        const size = 90;
        // Changes icon in alert component depending on type
        if (type === "error") return <DangerIcon width={size} height={size} />;
        if (type === "warning")
            return <WarningIcon width={size} height={size} />;
        if (type === "info") return <InfoIcon width={size} height={size} />;
        if (type === "success")
            return <SuccessIcon width={size} height={size} />;

        return <SuccessIcon width={size} height={size} />;
    };

    const defaults = () => {
        if (type === "error")
            return {
                title: "Error!",
                message:
                    "An error occurred. Please try again or contact support if the problem persists.",
            };
        if (type === "warning")
            return {
                title: "Warning!",
                message:
                    "Proceed with caution. Please check the details before continuing.",
            };
        if (type === "info")
            return {
                title: "Information!",
                message: "Here is some information that you might find useful.",
            };
        if (type === "success")
            return {
                title: "Success!",
                message: "Your changes have been successfully saved!",
            };

        return {
            title: "Success!",
            message: "Your changes have been successfully saved!",
        };
    };

    React.useEffect(() => {
        if (autoClose) {
            // Set timeout to close the alert
            const timer = setTimeout(() => {
                setIsAlertOpen(false);
            }, 5000);

            // Cleanup the timer if the component unmounts or if autoClose changes
            return () => {
                clearTimeout(timer);
            };
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            placement={"top"}
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
}
