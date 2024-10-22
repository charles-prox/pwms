import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Skeleton,
} from "@nextui-org/react";
import { useTheme } from "@/ThemeProvider";
import { router, useForm } from "@inertiajs/react";
import { CloseIcon } from "../Alert/icons";

const GeneratedQR = ({ svgString }) => {
    return (
        <div
            className="border-5 border-white"
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
};

export const ConfirmTwoFactorAuthForm = ({ isOpen, onSuccess, onClose }) => {
    const { theme } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        code: "",
    });

    const [qrCode, setQrCode] = React.useState(null);
    const [setupKey, setSetupKey] = React.useState(null);

    const enableTwoFactorAuthentication = () => {
        router.post(
            route("two-factor.enable"),
            {},
            {
                preserveScroll: true,
                onSuccess: () => Promise.all([showQrCode(), showSetupKey()]),
            }
        );
    };

    const showQrCode = () => {
        return axios.get(route("two-factor.qr-code")).then((response) => {
            setQrCode(response.data.svg);
        });
    };

    const showSetupKey = () => {
        return axios.get(route("two-factor.secret-key")).then((response) => {
            setSetupKey(response.data.secretKey);
        });
    };

    React.useEffect(() => {
        isOpen && enableTwoFactorAuthentication();
    }, [isOpen]);

    const submit = (e) => {
        e.preventDefault();
        post(route("two-factor.confirm"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setQrCode(null);
                setSetupKey(null);
                reset();
                onSuccess();
            },
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            placement={"top"}
            size="xl"
            className={`${theme} text-foreground`}
            closeButton={
                <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    color={"default"}
                    className="hover:bg-neutral-100/5"
                    onPress={() => {
                        onClose();
                    }}
                >
                    <CloseIcon />
                </Button>
            }
        >
            <ModalContent>
                <form onSubmit={submit}>
                    <ModalHeader className="flex flex-col gap-1">
                        Finish enabling two factor authentication.
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-8">
                            <p className="text-sm">
                                When two factor authentication is enabled, you
                                will be prompted for a secure, random token
                                during authentication. You may retrieve this
                                token from your phone's Google Authenticator
                                application.
                            </p>
                            <p className="font-semibold text-sm">
                                To finish enabling two factor authentication,
                                scan the following QR code using your phone's
                                authenticator application or enter the setup key
                                and provide the generated OTP code.
                            </p>
                            <div className="flex flex-col gap-3 items-center">
                                <Skeleton
                                    // isLoaded={false}
                                    isLoaded={!!qrCode}
                                    className="rounded-md w-[202px] h-[200px]"
                                >
                                    <GeneratedQR svgString={qrCode} />
                                </Skeleton>

                                <Skeleton
                                    // isLoaded={false}
                                    isLoaded={!!setupKey}
                                    className="rounded-md"
                                >
                                    <p className="font-bold">{`Setup Key: ${setupKey}`}</p>
                                </Skeleton>
                            </div>
                            <Input
                                type="text"
                                name="code"
                                id="code"
                                placeholder="Enter code from authenticator"
                                label="Code"
                                labelPlacement="outside"
                                value={data.code}
                                isInvalid={
                                    !!errors.confirmTwoFactorAuthentication
                                        ?.code
                                }
                                errorMessage={
                                    errors.confirmTwoFactorAuthentication?.code
                                }
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                classNames={{
                                    label: "text-black dark:text-white/90 font-bold",
                                    inputWrapper: "border-slate-400",
                                }}
                            />
                        </div>
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
