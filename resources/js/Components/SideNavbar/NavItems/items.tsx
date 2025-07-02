import React from "react";
import {
    BoxStore,
    DashboardIcon,
    LocationIcon,
    OfficesIcon,
    RdsIcon,
    ReportsIcon,
    StorageEntryIcon,
    UsersIcon,
} from "../icons";
import { NavItem } from "@/Utils/types";
import Icon from "@/Components/Icon";

// Define the items array with the NavItem type
export const items: NavItem[] = [
    {
        type: "link",
        key: "dashboard",
        label: "Dashboard",
        icon: (size) => <DashboardIcon width={size} height={size} />,
        url: "/",
    },
    {
        type: "link",
        key: "requests",
        label: "Make Request",
        icon: (size) => <BoxStore width={size} height={size} />,
        url: "/request",
    },
    {
        type: "title",
        key: "admin-tools",
        label: "Admin Tools",
    },
    {
        type: "link",
        key: "manage-requests",
        label: "Manage Requests",
        icon: (size) => <Icon name="manage-files" size={size} />,
        url: "/manage-requests",
    },
    {
        type: "link",
        key: "reports",
        label: "Reports",
        icon: (size) => <ReportsIcon width={size} height={size} />,
        url: "/reports",
    },
    {
        type: "link",
        key: "users",
        label: "Users",
        icon: (size) => <UsersIcon width={size} height={size} />,
        url: "/users",
    },
    {
        type: "link",
        key: "offices",
        label: "Offices",
        icon: (size) => <OfficesIcon width={size} height={size} />,
        url: "/offices",
    },
    {
        type: "link",
        key: "rds",
        label: "RDS",
        icon: (size) => <RdsIcon width={size} height={size} />,
        url: "/rds",
    },
    {
        type: "link",
        key: "locations",
        label: "Locations",
        icon: (size) => <LocationIcon width={size} height={size} />,
        url: "/location",
    },
    {
        type: "link",
        key: "storage-record-entry",
        label: "Storage Record Entry",
        icon: (size) => <StorageEntryIcon width={size} height={size} />,
        url: "/storage-record-entry",
    },
];
