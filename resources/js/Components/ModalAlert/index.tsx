import React, { ReactNode, useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useTheme } from "@/Contexts/ThemeContext";
import { AlertType, ModalAlertProps } from "@/Utils/types";
import Icon from "../Icon";

const ModalAlert: React.FC<ModalAlertProps> = ({
    isOpen,
    onClose,
    type = "success",
    title,
    message,
    autoClose = false,
    autoCloseDuration = 5000,
    mode = "alert",
    onConfirm,
    onCancel,
}) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    const icons: Record<AlertType, ReactNode> = {
        error: <Icon name={"error-alert"} size={90} />,
        warning: <Icon name={"warning-alert"} size={90} />,
        info: <Icon name={"info-alert"} size={90} />,
        success: <Icon name={"success-alert"} size={90} />,
    };

    const defaults: Record<AlertType, { title: string; message: string }> = {
        error: { title: "Error!", message: "Something went wrong!" },
        warning: { title: "Warning!", message: "Be cautious!" },
        info: { title: "Information!", message: "Here’s some info!" },
        success: { title: "Success!", message: "Operation completed!" },
    };

    useEffect(() => {
        if (mode === "alert" && autoClose && isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDuration, onClose, isOpen, mode]);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm?.();
        } finally {
            setLoading(false);
            // onClose();
        }
    };

    const handleCancel = () => {
        onCancel?.();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            placement="top"
            backdrop="transparent"
            shadow="lg"
            className={theme}
            closeButton={
                <Button
                    variant="flat"
                    isIconOnly
                    onPress={onClose}
                    disabled={loading}
                >
                    <Icon
                        name={"close"}
                        size={18}
                        className="dark:text-white"
                    />
                </Button>
            }
            hideCloseButton={mode === "confirm"}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.3, ease: "easeOut" },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: { duration: 0.2, ease: "easeIn" },
                    },
                },
            }}
        >
            <ModalContent>
                <ModalBody>
                    <div className="flex gap-3 p-3">
                        {mode === "alert" && <div>{icons[type]}</div>}
                        <div>
                            <h3 className="text-lg font-bold text-foreground">
                                {title || defaults[type].title}
                            </h3>
                            <p className="text-sm text-default-500">
                                {message || defaults[type].message}
                            </p>
                        </div>
                    </div>
                </ModalBody>

                {mode === "confirm" && (
                    <ModalFooter className="flex justify-end gap-2 pr-4 pb-4">
                        <Button
                            variant="light"
                            onPress={handleCancel}
                            isDisabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleConfirm}
                            isLoading={loading}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalAlert;
