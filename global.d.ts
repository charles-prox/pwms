declare function route(name: string, params?: any): string;

interface Icons {
    width?: string;
    height?: string;
    fill?: string;
    classname?: string;
}

type InputColors = "danger" | "default";

interface InputProps {
    type?: "text" | "password" | "email"; // adjust according to your needs
    label: string;
    labelPlacement?: "inside" | "outside" | "outside-left"; // adjust according to your needs
    placeholder?: string;
    maxWidthClass?: string | number; // optional, can be used to style the component
    value: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    startContent?: React.ReactNode | string;
    endContent?: React.ReactNode | string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    name: string;
    variant?: "flat" | "bordered" | "faded" | "underlined" | undefined;
    color?: InputColors; // This is optional
    errorMessage?: string;
    isDisabled?: boolean;
    description?: string;
}

type Key = string | number;
interface SelectProps<T extends object> {
    label: string;
    variant?: "flat" | "bordered" | "faded" | "underlined" | undefined;
    labelPlacement?: "inside" | "outside" | "outside-left"; // adjust according to your needs
    placeholder?: string;
    maxWidthClass?: string | number; // optional, can be used to style the component
    autocomplete?: boolean;
    isClearable?: boolean;
    startContent?: React.ReactNode | string;
    endContent?: React.ReactNode | string;
    isRequired?: boolean;
    name: string;
    color?: InputColors; // This is optional
    errorMessage?: string | undefined | null; // This is optional
    isDisabled?: boolean;
    items: Iterable<T>; //
    keyField: keyof T; // Ensure 'keyField' is a key of 'T'
    labelField: keyof T; // Ensure 'labelField' is a key of 'T'
    valueField?: keyof T; // Ensure 'valueField' is a key of 'T'
    selectedKeys?: any; //
    menuTrigger: "focus" | "input" | "manual";
    section?: keyof T | null; // Section
    onSelectionChange: (keys: any) => void;
    onInputChange?: (keys: any) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    allowsCustomValue?: boolean; //
}

type Column = {
    name: string;
    uid: string;
    sortable?: boolean;
};
