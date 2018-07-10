declare module "rui/RUICanvas" {
    export class RUICanvas {
        private m_canvas;
        constructor(canvas: HTMLCanvasElement);
    }
}
declare module "rui/UIObject" {
    export class UIObject {
    }
}
declare module "rui/UIButton" {
    import { UIObject } from "rui/UIObject";
    export class UIButton extends UIObject {
    }
}
//# sourceMappingURL=rui.d.ts.map