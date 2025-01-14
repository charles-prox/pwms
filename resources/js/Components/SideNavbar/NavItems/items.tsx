import React from "react";
import {
    BoxDispose,
    BoxReturn,
    BoxSearch,
    BoxStore,
    DashboardIcon,
    UsersIcon,
} from "../icons";
import { NavItem } from "@/Utils/types";

// Define the items array with the NavItem type
export const items: NavItem[] = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: (w, h) => <DashboardIcon width={w} height={h} />,
        url: "/",
    },
    {
        key: "storage",
        label: "Request Storage",
        icon: (w, h) => <BoxStore width={w} height={h} />,
        url: "/request-storage",
    },
    {
        key: "withdrawal",
        label: "Request Withdrawal",
        icon: (w, h) => <BoxSearch width={w} height={h} />,
        url: "/request-withdrawal",
    },
    {
        key: "return",
        label: "Request Return",
        icon: (w, h) => <BoxReturn width={w} height={h} />,
        url: "/request-return",
    },
    {
        key: "disposal",
        label: "Request Disposal",
        icon: (w, h) => <BoxDispose width={w} height={h} />,
        url: "/request-disposal",
    },
    {
        key: "users",
        label: "Users",
        icon: (w, h) => <UsersIcon width={w} height={h} />,
        url: "/users",
    },
];
