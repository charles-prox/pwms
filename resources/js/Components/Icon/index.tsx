import React, { useEffect, useState } from "react";

// Import all SVGs under ./svg folder automatically
const modules = import.meta.glob("./svg/*.svg", {
    query: "?react",
    eager: true,
});

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: string; // icon name corresponds to the SVG filename without extension
    size?: number | string;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 24,
    className,
    ...rest
}) => {
    const [SvgIcon, setSvgIcon] = useState<React.FC<
        React.SVGProps<SVGSVGElement>
    > | null>(null);

    useEffect(() => {
        const mod = modules[`./svg/${name}.svg`];
        if (!mod) {
            console.warn(`Icon "${name}" does not exist in /svg folder.`);
            setSvgIcon(null);
            return;
        }

        // Since eager: true, mod is already the module, not a function
        const imported = mod as {
            default: React.FC<React.SVGProps<SVGSVGElement>>;
        };

        setSvgIcon(() => imported.default);
    }, [name]);

    if (!SvgIcon) {
        return null; // You could return a fallback or placeholder icon here
    }

    return (
        <SvgIcon
            width={size}
            height={size}
            fill="currentColor"
            className={className}
            {...rest}
        />
    );
};

export default Icon;
