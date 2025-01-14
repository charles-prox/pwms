import { Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

interface PasswordVisibilityButtonProps {
    handleState: (isVisible: boolean) => void;
}

export const PasswordVisibilityButton: React.FC<
    PasswordVisibilityButtonProps
> = ({ handleState }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        handleState(isVisible);
    }, [isVisible, handleState]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <Button
            isIconOnly
            variant="light"
            radius="full"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
        >
            {isVisible ? (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
        </Button>
    );
};
