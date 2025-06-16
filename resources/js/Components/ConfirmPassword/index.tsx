import React, { useEffect, FormEvent } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { useTheme } from "@/Contexts/ThemeContext";
import { axiosInstance } from "@/Utils/axios";
import PasswordInput from "../Shared/PasswordInput";

// Define types for the props
interface ConfirmPasswordProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (password: string) => void;
    title?: string;
    content?: string;
    onSuccess?: (success: boolean) => void;
    errors?: { password?: string };
    processing?: boolean;
}

export const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    content,
    onSuccess,
    errors: outsideError,
    processing: outsideProcessing,
}) => {
    const [password, setPassword] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [processing, setProcessing] = React.useState<boolean>(false);
    const { theme } = useTheme();

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        if (typeof onSubmit === "function") {
            onSubmit(password);
        } else {
            axiosInstance
                .post(route("password.confirm"), {
                    password: password,
                })
                .then(() => {
                    setProcessing(false);
                    setPassword("");
                    if (onSuccess) {
                        onSuccess(true); // Call onSuccess only if it's defined
                    }
                    onClose();
                })
                .catch((error) => {
                    setProcessing(false);
                    setError(
                        error.response?.data.message || "An error occurred."
                    );
                });
        }
    };

    useEffect(() => {
        if (outsideError) setError(outsideError.password || "");
        setProcessing(outsideProcessing ?? false);
    }, [outsideError, outsideProcessing]);

    return (
        <Modal
            isOpen={isOpen}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            placement="top"
            className={`${theme} text-foreground`}
        >
            <ModalContent>
                <form onSubmit={submit}>
                    <ModalHeader className="flex flex-col gap-1">
                        {title || "Confirm Password"}
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            {content ||
                                "For your security, please confirm your password to continue."}
                        </p>

                        <PasswordInput
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            errorMessage={error}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            isLoading={processing}
                        >
                            Confirm
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmPassword;
