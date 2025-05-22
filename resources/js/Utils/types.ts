import { DateValue, RangeValue } from "@heroui/react";

// ========================
// NAVIGATION TYPES
// ========================
export type SideNavState = "collapse" | "expand";

// Define the type for the animation options
export type AnimationOptions = {
    delay: number;
    duration: number;
};

type NavItemType = "title" | "link";

export type NavItem = {
    type: NavItemType;
    key: string;
    label: string;
    url?: string;
    icon?: (size: number | string) => JSX.Element;
};

// ========================
// CONTEXT TYPES
// ========================
export interface SelectedRequestView {
    pageId: string;
    view: string;
}

// ========================
// COMPONENT TYPES
// ========================
export interface Filter {
    column: string;
    value: string;
}

// ========================
// FORM TYPES
// ========================
export interface BoxFormState {
    id: number;
    box_code: string;
    priority_level: { value: string; label: string } | null;
    remarks: string;
    disposal_date: string;
    office: { id: number; name: string } | null;
    box_details: BoxDetails[];
}

export interface BoxDetails {
    id: number | null;
    document_title: string | null;
    rds_number: string;
    retention_period: string;
    document_date: {
        raw: string | null; // e.g., '2025-03-17T10:00:00Z'
        formatted: string | null; // e.g., 'March 17, 2025'
    };
    disposal_date: {
        raw: string | null; // e.g., '2025-06-01T00:00:00Z'
        formatted: string | null; // e.g., 'June 1, 2025'
    };
}

// ========================
// PROP TYPES
// ========================
export type FormProp = {
    number: string;
    last_update: string;
    type: string;
};

export interface ProfileFormData {
    hris_id: string;
    user_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    position: string;
    contact_no: string;
    employment_status: string;
    office_id: string;
    account_status: string;
    photo: File | null;
    [key: string]: any;
}

export type AlertType = "success" | "error" | "warning" | "info";
export type AlertMode = "alert" | "confirm";
export interface AlertOptions {
    type?: AlertType;
    title?: string;
    message?: string;
    autoClose?: boolean;
    autoCloseDuration?: number;
    mode?: AlertMode;
    onConfirm?: () => void;
    onCancel?: () => void;
}
export interface ModalAlertProps {
    isOpen: boolean;
    onClose: () => void;
    type?: AlertType;
    title?: string;
    message?: string;
    autoClose?: boolean;
    autoCloseDuration?: number;
    mode?: "alert" | "confirm";
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}
