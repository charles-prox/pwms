import React from "react";
import { Input as NextInput } from "@heroui/react";
import { getTailwindWidthClass } from "@/Utils/helpers";

const Input = <T,>({
    value,
    onChange,
    startContent,
    endContent,
    isRequired,
    isReadOnly,
    name,
    label,
    labelPlacement = "inside",
    placeholder,
    color = "default",
    errorMessage,
    maxWidthClass,
    variant,
    type = "text", // Default type is text, can be changed as needed
    description,
}: InputProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(event); // Call onChange with the dynamic type
    };

    return (
        <NextInput
            type={type}
            label={label}
            name={name}
            id={name}
            placeholder={placeholder}
            labelPlacement={labelPlacement}
            variant={variant}
            autoComplete={name}
            value={value}
            onChange={handleChange}
            color={!!errorMessage ? "danger" : color}
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
            classNames={{
                label: "text-black dark:text-white/90 font-bold",
                inputWrapper: "border-slate-400",
                base: maxWidthClass ? getTailwindWidthClass(maxWidthClass) : "", // pass maxWidth if provided
                description: "text-default-500/50",
            }}
            startContent={startContent}
            endContent={endContent}
            isRequired={isRequired}
            isReadOnly={isReadOnly}
            description={description}
        />
    );
};

export default Input;
