import { useState } from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Input,
    Spinner,
} from "@heroui/react";
import { Head, router } from "@inertiajs/react";
import { axiosInstance } from "@/Utils/axios";

export default function TwoFactorPrompt() {
    const [step, setStep] = useState<"start" | "qr" | "enabled">("start");
    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiate2FA = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axiosInstance.post(route("two-factor.initiate"));
            setQrSvg(res.data.qr_svg);
            setSecret(res.data.secret);
            setStep("qr");

            const codesRes = await axiosInstance.get(route("two-factor.codes"));
            setRecoveryCodes(codesRes.data);
        } catch (err: any) {
            if (err.response?.status === 409) {
                setStep("enabled");
                const codesRes = await axiosInstance.get(
                    route("two-factor.codes")
                );
                setRecoveryCodes(codesRes.data);
            } else {
                setError("Failed to start 2FA setup. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const verify2FA = async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.post(route("two-factor.verify"), { code });
            setStep("enabled");
            router.visit("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid code. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <Head title="Two-Factor Authentication" />

            {step === "start" && (
                <Card className="w-full p-4">
                    <CardHeader className="font-semibold text-lg">
                        Enable Two-Factor Authentication
                    </CardHeader>
                    <CardBody>
                        <p className="text-sm text-muted-foreground mb-4">
                            Protect your account by enabling two-factor
                            authentication (2FA). You’ll need to use an
                            authentication app to scan a QR code and enter a
                            6-digit code.
                        </p>

                        <Button
                            variant="solid"
                            color="primary"
                            onPress={initiate2FA}
                            isLoading={loading}
                            size="sm"
                        >
                            Enable 2FA
                        </Button>

                        {error && (
                            <p className="text-xs text-red-500 mt-3">{error}</p>
                        )}
                    </CardBody>
                </Card>
            )}

            {step === "qr" && (
                <Card className="w-full p-4 space-y-4">
                    <CardHeader className="font-semibold text-lg">
                        Scan QR Code
                    </CardHeader>
                    <CardBody className="space-y-4 flex">
                        {qrSvg && (
                            <div
                                className="flex justify-center"
                                dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />
                        )}
                        <p className="text-sm text-gray-500 text-center break-all">
                            Secret Key:{" "}
                            <span className="font-mono">{secret}</span>
                        </p>

                        <Divider />

                        <Input
                            label="Authenticator Code"
                            placeholder="123456"
                            labelPlacement="outside"
                            variant="bordered"
                            description="Enter the 6-digit code from your authentication app"
                            value={code}
                            onValueChange={setCode}
                            disabled={loading}
                        />

                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}

                        <Button
                            variant="solid"
                            color="success"
                            onPress={verify2FA}
                            isLoading={loading}
                            disabled={!code || loading}
                        >
                            Verify & Enable
                        </Button>
                    </CardBody>
                </Card>
            )}

            {step === "enabled" && (
                <Card className="w-full p-4 space-y-4">
                    <CardHeader className="font-semibold text-lg">
                        Two-Factor Authentication Enabled
                    </CardHeader>
                    <CardBody className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Save your recovery codes somewhere safe. You can use
                            these codes to regain access if you lose your
                            device.
                        </p>
                        <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-gray-100 p-4 rounded">
                            {recoveryCodes.map((code) => (
                                <span key={code}>{code}</span>
                            ))}
                        </div>
                        <Button
                            variant="solid"
                            color="primary"
                            onPress={() => router.visit("/")}
                        >
                            Return to Dashboard
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
