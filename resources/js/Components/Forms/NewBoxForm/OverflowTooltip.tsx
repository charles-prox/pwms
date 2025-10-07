import { Tooltip } from "@heroui/react";
import React from "react";

type OverlayPlacement =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

interface OverflowTooltipProps {
    value: string;
    children: React.ReactNode;
    tooltipClassName?: string;
    placement?: OverlayPlacement;
    /** Character count before truncating / showing tooltip */
    maxChars?: number;
}

/**
 * Shows a tooltip only when the given text exceeds `maxChars`.
 * Works reliably with any Input, label, or text component.
 */
const OverflowTooltip: React.FC<OverflowTooltipProps> = ({
    value,
    children,
    tooltipClassName,
    placement = "top",
    maxChars = 50, // default cutoff
}) => {
    const isOverflowing = value?.length > maxChars;

    return isOverflowing ? (
        <Tooltip
            content={value}
            placement={placement}
            className={tooltipClassName}
        >
            <div className="truncate w-full">{children}</div>
        </Tooltip>
    ) : (
        <div className="truncate w-full">{children}</div>
    );
};

export default OverflowTooltip;
