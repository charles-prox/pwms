// ========================
// NAVIGATION TYPES
// ========================
export type SideNavState = "collapse" | "expand";

// Define the type for the animation options
export type AnimationOptions = {
    delay: number;
    duration: number;
};

export type NavItem = {
    key: string;
    label: string;
    url: string;
    icon: (width: number, height: number) => JSX.Element;
};
