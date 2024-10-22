import React, { useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
} from "@nextui-org/react";
import { PasswordVisibilityButton } from "../PasswordVisibilityButton";
import { useTheme } from "@/ThemeProvider";

export const ConfirmPassword = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    content,
    onSuccess,
    errors: outsideError,
    processing: outsideProcessing,
}) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [processing, setProcessing] = React.useState(false);
    const { theme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        setProcessing(true);

        if (typeof onSubmit === "function") {
            onSubmit(password);
        } else {
            axios
                .post(route("password.confirm"), {
                    password: password,
                })
                .then(() => {
                    setProcessing(false);
                    setPassword("");
                    onSuccess(true);
                    onClose();
                })
                .catch((error) => {
                    setProcessing(false);
                    setError(error.response?.data.message);
                });
        }
    };

    useEffect(() => {
        if (outsideError) setError(outsideError.password);
        setProcessing(outsideProcessing);
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
                        <Input
                            type={isVisible ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            isInvalid={!!error}
                            errorMessage={error}
                            onChange={(e) => setPassword(e.target.value)}
                            classNames={{
                                label: "text-black dark:text-white/90 font-bold",
                                inputWrapper: "border-slate-400",
                            }}
                            endContent={
                                <PasswordVisibilityButton
                                    handleState={(state) => setIsVisible(state)}
                                />
                            }
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
