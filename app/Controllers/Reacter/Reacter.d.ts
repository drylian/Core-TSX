declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

    const src: string;
    export default src;
}

declare module "*.module.css" {
    const css: { [key: string]: string };
    export default css;
}

declare module "*.css" {
    export default any;
}

type ModuleNamespace = Record<string, any> & {
    [Symbol.toStringTag]: "Module";
};

interface ImportMetaHot {
    accept(cb: (mod: ModuleNamespace) => void): void;
}

interface ImportMeta {
    hot: ImportMetaHot | undefined;
}
