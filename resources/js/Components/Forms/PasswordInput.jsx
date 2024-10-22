import React from "react";
import { Input } from "@nextui-org/react";
import { LockIcon } from "./icons";
import { PasswordVisibilityButton } from "../PasswordVisibilityButton";

export default function PasswordInput({
    label,
    labelPlacement,
    name,
    error,
    placeholder,
    value,
    setValue,
}) {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <Input
            name={name}
            id={name}
            type={isVisible ? "text" : "password"}
            label={label}
            labelPlacement={labelPlacement}
            placeholder={placeholder}
            variant="bordered"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            color={!!error ? "danger" : "default"}
            isInvalid={!!error}
            errorMessage={error}
            classNames={{
                label: "text-black dark:text-white/90 font-bold",
                inputWrapper: "border-slate-400",
            }}
            startContent={<LockIcon />}
            endContent={
                <PasswordVisibilityButton
                    handleState={(state) => setIsVisible(state)}
                />
            }
            isRequired
        />
    );
}
