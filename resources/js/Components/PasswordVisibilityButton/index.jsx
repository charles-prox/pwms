import { Button } from "@nextui-org/react";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

export const PasswordVisibilityButton = ({ handleState }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        handleState(isVisible);
    }, [isVisible]);

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
