import React from "react";
import { DashboardIcon, UsersIcon } from "../icons";

export const items = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: (w, h) => <DashboardIcon width={w} height={h} />,
        url: "/",
    },
    {
        key: "users",
        label: "Users",
        icon: (w, h) => <UsersIcon width={w} height={h} />,
        url: "/users",
    },
];
