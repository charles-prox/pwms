import React, { useEffect, useState } from "react";

// Import all SVGs under ./svg folder automatically
const modules = import.meta.glob("./svg/*.svg");

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
        const importIcon = async () => {
            const importFn = modules[`./svg/${name}.svg`];
            if (!importFn) {
                console.warn(`Icon "${name}" does not exist in /svg folder.`);
                setSvgIcon(null);
                return;
            }
            const imported = (await importFn()) as {
                default: React.FC<React.SVGProps<SVGSVGElement>>;
            };
            setSvgIcon(() => imported.default);
        };

        importIcon();
    }, [name]);

    if (!SvgIcon) {
        return null; // Or return some placeholder / empty element
    }

    return (
        <SvgIcon width={size} height={size} className={className} {...rest} />
    );
};

export default Icon;
