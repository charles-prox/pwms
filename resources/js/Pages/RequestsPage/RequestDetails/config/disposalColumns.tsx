import { Column } from "@/Layouts/BaseListView";
import { BoxFormState } from "@/Utils/types";
import { toTitleCase } from "@/Utils/helpers";
import BoxDetailsPopover from "../components/BoxDetailsPopover";
import { Chip } from "@heroui/react";

export const disposalColumns: Column<BoxFormState>[] = [
    { label: "BOX CODE", key: "box_code" },
    {
        label: "PRIORITY LEVEL",
        key: "priority_level",
        render: (item: BoxFormState) => {
            const value = item.priority_level?.value ?? null;
            if (!value) return "N/A";

            const colorMap: Record<any, any> = {
                black: "default",
                green: "success",
                red: "danger",
            };

            return (
                <Chip size="sm" color={colorMap[value] ?? "primary"}>
                    {toTitleCase(value)}
                </Chip>
            );
        },
    },
    {
        label: "DATE STORED",
        key: "completed_at",
        render: (item: BoxFormState) => {
            const disp = item.completed_at;
            if (typeof disp === "string") return disp; // e.g. "Permanent"
            return disp?.formatted ?? "N/A";
        },
    },
    {
        label: "DISPOSAL DATE",
        key: "disposal_date",
        render: (item: BoxFormState) => {
            const disp = item.disposal_date;
            if (typeof disp === "string") return disp; // e.g. "Permanent"
            return disp?.formatted ?? "N/A";
        },
    },
    {
        label: "BOX CONTENTS",
        key: "box_details",
        render: (item: BoxFormState) => (
            <BoxDetailsPopover documents={item.box_details} />
        ),
    },
    {
        label: "REMARKS",
        key: "remarks",
        render: (item: BoxFormState) => (
            <p className="whitespace-pre-line">{item.remarks ?? ""}</p>
        ),
    },
];
