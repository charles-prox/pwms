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
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    startContent?: React.ReactNode | string;
    endContent?: React.ReactNode | string;
    isRequired?: boolean;
    name: string;
    color?: InputColors; // This is optional
    errorMessage?: string;
    isDisabled?: boolean;
}

type Key = string | number;
interface SelectProps<T> {
    label: string;
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
    errorMessage?: string;
    isDisabled?: boolean;
    items: Iterable<T>; //
    keyField: string | number; // Dynamic key field
    labelField: string; // Dynamic label field
    valueField?: string | number; // Dynamic value field
    selectedKeys?: "all" | Iterable<Key> | React.Key | Key | undefined | null;
    menuTrigger: "focus" | "input" | "manual";
    onSelectionChange: (
        keys:
            | "all"
            | (Set<React.Key> & { anchorKey?: string; currentKey?: string })
            | React.Key
            | Key
    ) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
}

type AlertType =
    | "error"
    | "warning"
    | "info"
    | "success"
    | "default"
    | undefined;
type AlertVariant = "solid" | "flat" | "bordered";
interface AlertProps {
    title: string;
    type: AlertType;
    variant: AlertVariant;
    message: string | React.ReactNode;
    isCloseable?: boolean;
}
