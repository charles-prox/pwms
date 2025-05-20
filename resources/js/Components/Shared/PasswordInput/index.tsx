import React from "react";
import { LockIcon } from "./icons";
import { PasswordVisibilityButton } from "../PasswordVisibilityButton";
import Input from "@/Components/Shared/Input";

const PasswordInput: React.FC<InputProps> = ({
    label,
    labelPlacement, // default value
    name,
    errorMessage,
    placeholder,
    value,
    onChange,
    isRequired = true,
    color,
    maxWidthClass,
    variant,
}) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <Input
            type={isVisible ? "text" : "password"}
            label={label}
            name={name}
            errorMessage={errorMessage}
            placeholder={placeholder}
            labelPlacement={labelPlacement}
            value={value}
            onChange={onChange}
            color={color}
            startContent={<LockIcon />}
            endContent={
                <PasswordVisibilityButton
                    handleState={(state: boolean) => setIsVisible(state)}
                />
            }
            isRequired={isRequired}
            maxWidthClass={maxWidthClass}
            variant={variant}
        />
    );
};

export default PasswordInput;
