import { Officer } from "./types";

export const asset = (path: string): string => `/${path}`;
export const url = (path: string): string => `/storage/${path}`;
export const toTitleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const getCurrentDate = (): string => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, "0")}/${String(
        now.getDate()
    ).padStart(2, "0")}/${now.getFullYear()}`;
};

export const getTailwindWidthClass = (maxWidth?: string | number) => {
    return typeof maxWidth === "number" ? `w-[${maxWidth}]` : maxWidth;
};

export const simulateInputEvent = (
    value: string
): React.ChangeEvent<HTMLInputElement> => {
    return {
        target: { value } as HTMLInputElement,
    } as React.ChangeEvent<HTMLInputElement>;
};

export const formatName = (gsuHead: Officer) => {
    const { first_name, middle_initial, last_name } = gsuHead;
    return `${first_name} ${
        middle_initial ? middle_initial + "." : ""
    } ${last_name}`
        .replace(/\s+/g, " ")
        .trim();
};
