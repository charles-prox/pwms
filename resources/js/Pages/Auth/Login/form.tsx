import React from "react";
import { Button, Checkbox } from "@heroui/react";
import Input from "@/Components/Shared/Input";
import Alert from "@/Components/Shared/Alert";
import { useForm } from "@inertiajs/react";
import { UserIdIcon } from "./icons";
import PasswordInput from "@/Components/Shared/PasswordInput";

const LoginForm = () => {
    const { data, setData, post, processing, errors, reset } = useForm<{
        hris_id: string;
        password: string;
        remember: boolean;
    }>({
        hris_id: "",
        password: "",
        remember: false,
    });

    React.useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            {errors.hris_id && (
                <Alert
                    title="Login failed."
                    type="error"
                    message={errors.hris_id}
                    variant={"flat"}
                    isCloseable={false}
                />
            )}
            <form onSubmit={submit}>
                <div className="flex flex-col gap-3">
                    <Input
                        label="HRIS ID "
                        name="hris_id"
                        placeholder="Enter your HRIS ID"
                        value={data.hris_id}
                        onChange={(e) => {
                            setData("hris_id", e.target.value);
                        }}
                        startContent={<UserIdIcon />}
                        isRequired
                    />

                    <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <Checkbox
                        isSelected={data.remember}
                        name="remember"
                        onValueChange={(isSelected) =>
                            setData("remember", isSelected)
                        }
                        size="sm"
                    >
                        Remember me
                    </Checkbox>

                    <Button
                        color="primary"
                        isLoading={processing}
                        type="submit"
                        fullWidth
                    >
                        Log in
                    </Button>
                </div>
            </form>
        </>
    );
};

export default LoginForm;
