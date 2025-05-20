interface ImportMeta {
    glob: (pattern: string) => Record<string, () => Promise<unknown>>;
}

declare module "*.svg" {
    import * as React from "react";
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}
