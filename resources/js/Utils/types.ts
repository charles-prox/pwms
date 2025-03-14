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
    priority_level: string;
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
    document_date: string | null;
    disposal_date: string | null;
}
