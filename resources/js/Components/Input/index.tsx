import React from "react";
import { Input as NextInput } from "@nextui-org/react";
import { getTailwindWidthClass } from "@/Utils/helpers";

const Input = <T,>({
    value,
    onChange,
    startContent,
    endContent,
    isRequired,
    name,
    label,
    labelPlacement = "inside",
    placeholder,
    color = "default",
    errorMessage,
    maxWidthClass,
    type = "text", // Default type is text, can be changed as needed
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
            variant="bordered"
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
            }}
            startContent={startContent}
            endContent={endContent}
            isRequired={isRequired}
        />
    );
};

export default Input;
