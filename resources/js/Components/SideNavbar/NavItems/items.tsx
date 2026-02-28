// @/Data/navItems.ts

import React from "react";
import {
    BoxStore,
    DashboardIcon,
    OfficesIcon,
    RdsIcon,
    ReportsIcon,
    StorageEntryIcon,
    UsersIcon,
} from "../icons";
import { NavItem } from "@/Utils/types";
import Icon from "@/Components/Icon";

export const navItems: NavItem[] = [
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
        label: "My Requests",
        icon: (size) => <BoxStore width={size} height={size} />,
        url: "/request",
    },
    {
        type: "title",
        key: "admin-tools",
        label: "Admin Tools",
        roles: ["utility-administrator"], // Only show title if user is super-admin
    },
    {
        type: "link",
        key: "manage-requests",
        label: "Manage Requests",
        icon: (size) => <Icon name="manage-files" size={size} />,
        url: "/manage-requests",
        roles: ["utility-administrator", "regional-document-custodian"],
    },
    {
        type: "link",
        key: "reports",
        label: "Reports",
        icon: (size) => <ReportsIcon width={size} height={size} />,
        url: "/reports",
        roles: ["utility-administrator"],
    },
    {
        type: "link",
        key: "users",
        label: "Users",
        icon: (size) => <UsersIcon width={size} height={size} />,
        url: "/users",
        roles: ["utility-administrator"],
    },
    {
        type: "link",
        key: "offices",
        label: "Offices",
        icon: (size) => <OfficesIcon width={size} height={size} />,
        url: "/offices",
        roles: ["utility-administrator"],
    },
    {
        type: "link",
        key: "rds",
        label: "RDS",
        icon: (size) => <RdsIcon width={size} height={size} />,
        url: "/rds",
        roles: ["utility-administrator"],
    },
    {
        type: "link",
        key: "storage-record-entry",
        label: "Storage Record Entry",
        icon: (size) => <StorageEntryIcon width={size} height={size} />,
        url: "/storage-record-entry",
        roles: ["utility-administrator"],
    },
];
