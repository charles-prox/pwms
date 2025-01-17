import React from "react";
import {
    BoxDispose,
    BoxReturn,
    BoxSearch,
    BoxStore,
    DashboardIcon,
    LocationIcon,
    OfficesIcon,
    RdsIcon,
    ReportsIcon,
    UsersIcon,
} from "../icons";
import { NavItem } from "@/Utils/types";

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
        type: "title",
        key: "requests",
        label: "Make Requests",
    },
    {
        type: "link",
        key: "storage",
        label: "Request Storage",
        icon: (size) => <BoxStore width={size} height={size} />,
        url: "/request-storage",
    },
    {
        type: "link",
        key: "withdrawal",
        label: "Request Withdrawal",
        icon: (size) => <BoxSearch width={size} height={size} />,
        url: "/request-withdrawal",
    },
    {
        type: "link",
        key: "return",
        label: "Request Return",
        icon: (size) => <BoxReturn width={size} height={size} />,
        url: "/request-return",
    },
    {
        type: "link",
        key: "disposal",
        label: "Request Disposal",
        icon: (size) => <BoxDispose width={size} height={size} />,
        url: "/request-disposal",
    },
    {
        type: "title",
        key: "admin-tools",
        label: "Admin Tools",
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
];
