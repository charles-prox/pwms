import React from "react";
import { UserIdIcon } from "./icons";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Alert from "../Alert";
import PasswordInput from "./PasswordInput";
import { useForm } from "@inertiajs/react";

export const LoginForm = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        hris_id: "",
        password: "",
        remember: false,
    });

    React.useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        errors.message = null;
        post(route("login"), { replace: true });
    };

    return (
        <>
            {errors.hris_id && (
                <Alert
                    title="Login failed."
                    type="error"
                    message={errors.hris_id}
                    variant={"flat"}
                />
            )}
            <form onSubmit={submit}>
                <div className="flex flex-col gap-3">
                    <Input
                        label="HRIS ID "
                        name="hris_id"
                        id="hris_id"
                        placeholder="Enter your HRIS ID"
                        variant="bordered"
                        autoComplete="hris_id"
                        value={data.id}
                        onChange={(e) => setData("hris_id", e.target.value)}
                        // color={!!errors.message ? "danger" : "default"}
                        // isInvalid={!!errors.message}
                        classNames={{
                            label: "text-black dark:text-white/90 font-bold",
                            inputWrapper: "border-slate-400",
                        }}
                        startContent={<UserIdIcon />}
                        isRequired
                    />

                    <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={data.password}
                        setValue={(val) => setData("password", val)}
                        error={errors.password}
                    />

                    <Checkbox
                        defaultValue={data.remember}
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
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
