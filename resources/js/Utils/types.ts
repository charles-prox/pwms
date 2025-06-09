import { ReactNode } from "react";

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

export type Officer = {
    id?: number;
    first_name: string;
    middle_initial?: string | null;
    last_name: string;
    extension?: string | null;
    office_id?: number;
    created_at?: string;
    updated_at?: string;
    positions: Position[];
};

// ========================
// FORM TYPES
// ========================
export type BoxDate = {
    raw: string | null; // e.g., '2025-03-17T10:00:00Z'
    formatted: string | null; // e.g., 'March 17, 2025'}
};
export type BoxDateRange = {
    start: BoxDate | null;
    end: BoxDate | null;
    readable: string | null; // e.g., 'March 17, 2025 - March 31, 2025'
};

export interface PriorityLevel {
    value: string;
    label: string;
}

export interface BoxFormState {
    id: number;
    box_code: string;
    priority_level: PriorityLevel | null;
    remarks: string;
    disposal_date: BoxDate | null | "Permanent"; // e.g., { raw: '2025-12-31T23:59:59Z', formatted: 'December 31, 2025' } or "Permanent"
    office: { id: number; name: string } | null;
    box_details: BoxDetails[];
}

export interface BoxDetails {
    id: number | null;
    document_code: string;
    document_title: string | null;
    rds_number: string;
    retention_period: string;
    document_date: BoxDateRange | null; // e.g., { start: { raw: '2025-01-01T00:00:00Z', formatted: 'January 1, 2025' }, end: { raw: '2025-12-31T23:59:59Z', formatted: 'December 31, 2025' } }
    disposal_date: BoxDate | null | "Permanent"; // e.g., { raw: '2025-12-31T23:59:59Z', formatted: 'December 31, 2025' }
}

// ========================
// PROP TYPES
// ========================
export type FormProp = {
    id: number;
    form_number: string;
    request_type: RequestType;
    status: string;
    is_draft: boolean;
    request_date: string | null; // nullable date string
    office_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
    approved_at: string | null;
    creator: string;
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

// Helper types
type DateFormatted = {
    raw: string;
    formatted: string;
};

type DocumentDate = {
    start: DateFormatted;
    end: DateFormatted;
    readable: string;
};

type Position = {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
    pivot: {
        officer_id: number;
        position_id: number;
    };
};

export type Office = {
    id: number;
    name: string;
    address?: string;
    acronym?: string;
    type?: string;
    pro_code?: number;
    parent_id?: number | null;
    created_at?: string;
    updated_at?: string;
};

type Creator = {
    id: number;
    hris_id: string;
    user_id: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    position: string;
    contact_no: string;
    employment_status: string;
    office_id: number;
    account_status: string;
    avatar: string | null;
    email_verified_at: string | null;
    current_team_id: number | null;
    profile_photo_path: string | null;
    created_at: string;
    updated_at: string;
    two_factor_confirmed_at: string | null;
    profile_photo_url: string;
    office: Office;
};

type BoxDetail = {
    id: number;
    document_code: string;
    document_title: string;
    rds_number: string;
    retention_period: number | "Permanent";
    document_date: DocumentDate;
    disposal_date: DateFormatted | string; // sometimes it's "Permanent"
};

type Box = {
    id: number;
    box_code: string;
    priority_level: PriorityLevel;
    remarks: string | null;
    disposal_date: DateFormatted | string; // sometimes "Permanent"
    office: Office;
    box_details: BoxDetail[];
};

export type RequestType = "storage" | "withdrawal" | "return" | "disposal";

type Request = {
    type: RequestType;
    form_number: string;
    boxes: Box[];
    creator: Creator;
};

export interface FormDetails {
    request: Request;
    creator_office_head: Officer;
    gsu_head: Officer;
    msd_head: Officer;
    rdc_officer: Officer;
    [key: string]: any;
}

export interface PDFDocumentProps {
    children: ReactNode;
    requestType: RequestType;
    formNumber?: string;
    preparedBy: { name: string; position: string };
    office: Office;
    officeHead?: Officer;
    regionDC?: Officer;
    msdHead?: Officer;
    gsuHead: Officer;
}
