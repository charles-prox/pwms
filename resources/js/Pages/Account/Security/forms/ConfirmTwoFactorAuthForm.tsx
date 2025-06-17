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
} from "@heroui/react";
import { router, useForm } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import { axiosInstance } from "@/Utils/axios";
import { CloseIcon } from "@/Components/Alert/icons";

interface ConfirmTwoFactorAuthFormProps {
    isOpen: boolean;
    onSuccess: () => void;
    onClose: () => void;
}

interface GeneratedQRProps {
    svgString: string;
}

const GeneratedQR: React.FC<GeneratedQRProps> = ({ svgString }) => {
    return (
        <div
            className="border-5 border-white"
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
};

export const ConfirmTwoFactorAuthForm: React.FC<
    ConfirmTwoFactorAuthFormProps
> = ({ isOpen, onSuccess, onClose }) => {
    const { theme } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm<any>({
        code: "",
    });

    const [qrCode, setQrCode] = React.useState<string | null>(null);
    const [setupKey, setSetupKey] = React.useState<string | null>(null);

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
        return axiosInstance
            .get(route("two-factor.qr-code"))
            .then((response) => {
                setQrCode(response.data.svg);
            });
    };

    const showSetupKey = () => {
        return axiosInstance
            .get(route("two-factor.secret-key"))
            .then((response) => {
                setSetupKey(response.data.secretKey);
            });
    };

    React.useEffect(() => {
        if (isOpen) enableTwoFactorAuthentication();
    }, [isOpen]);

    const submit = (e: React.FormEvent) => {
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
                                    isLoaded={!!qrCode}
                                    className="rounded-md w-[202px] h-[200px]"
                                >
                                    <GeneratedQR svgString={qrCode || ""} />
                                </Skeleton>

                                <Skeleton
                                    isLoaded={!!setupKey}
                                    className="rounded-md"
                                >
                                    <p className="font-bold">{`Setup Key: ${setupKey}`}</p>
                                </Skeleton>
                            </div>
                            <Input
                                name={"code"}
                                label={"Code"}
                                labelPlacement="outside"
                                placeholder="Enter code from authenticator"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                errorMessage={
                                    (
                                        errors.confirmTwoFactorAuthentication as
                                            | {
                                                  code: string;
                                              }
                                            | undefined
                                    )?.code
                                }
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
