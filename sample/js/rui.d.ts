/// <reference types="webgl2" />
declare module "rui/RUIEvent" {
    export enum RUIMouseButton {
        Left = 0,
        Middle = 1,
        Right = 2,
    }
    export enum RUIEventType {
        MouseDown = 0,
        MouseUp = 1,
        MouseClick = 2,
        MouseEnter = 3,
        MouseLeave = 4,
        MouseDrag = 5,
        MouseDrop = 6,
        MouseMove = 7,
        MouseWheel = 8,
    }
    export class RUIEvent<T> {
        object: T;
        isUsed: boolean;
        private m_isPrevented;
        constructor(object: T);
        prevent(): void;
        Use(): void;
    }
    export type RUIEventFunc<T> = (e: RUIEvent<T>) => void;
    export class RUIEventEmitter<T> {
        private m_listener;
        on(listener: RUIEventFunc<T>): void;
        removeListener(listener: RUIEventFunc<T>): void;
        removeAllListener(): void;
        emit(e: RUIEvent<T>): void;
        emitRaw(e: T): void;
    }
    export abstract class RUIObjEvent extends RUIEvent<RUIObjEvent> {
        constructor();
    }
    export class RUIResizeEvent extends RUIEvent<RUIResizeEvent> {
        width: number;
        height: number;
        constructor(w: number, h: number);
    }
    export class RUIKeyboardEvent extends RUIObjEvent {
        raw: KeyboardEvent;
        constructor(e: KeyboardEvent);
    }
    export class RUIMouseEvent extends RUIObjEvent {
        m_eventtype: RUIEventType;
        mousex: number;
        mousey: number;
        private m_button;
        raw: MouseEvent;
        constructor(e: MouseEvent, type: RUIEventType);
        readonly type: RUIEventType;
        readonly button: RUIMouseButton;
    }
    export enum RUIMouseDragStage {
        Begin = 0,
        Update = 1,
        End = 2,
    }
    export class RUIMouseDragEvent extends RUIMouseEvent {
        /** false when drag end. */
        stage: RUIMouseDragStage;
        constructor(e: RUIMouseEvent, stage: RUIMouseDragStage);
    }
    export class RUIWheelEvent extends RUIObjEvent {
        delta: number;
        constructor(e: WheelEvent);
    }
}
declare module "rui/RUIInput" {
    import { RUIDOMCanvas } from "rui/RUIDOMCanvas";
    import { RUIKeyboardEvent } from "rui/RUIEvent";
    export class IInputUI {
        onKeyPress(e: KeyboardEvent): void;
        onKeyDown(e: KeyboardEvent): void;
    }
    export class RUIInput {
        private m_target;
        static readonly MOUSE_DOWN: string;
        static readonly MOUSE_UP: string;
        static readonly MOUSE_CLICK: string;
        static readonly MOUSE_ENTER: string;
        static readonly MOUSE_LEAVE: string;
        static readonly MOUSE_DRAG: string;
        static readonly MOUSE_DROP: string;
        constructor(uicanvas: RUIDOMCanvas);
        private RegisterEvent();
        static ProcessTextKeyDown(text: string, e: RUIKeyboardEvent): string;
    }
}
declare module "rui/RUICursor" {
    import { RUIDOMCanvas } from "rui/RUIDOMCanvas";
    export enum RUICursorType {
        default = "default",
        crosshair = "crosshair",
        move = "move",
        none = "none",
        pointer = "pointer",
        text = "text",
        col_resize = "col-resize",
        row_resize = "row-resize",
        n_resize = "n-resize",
        e_resize = "e-resize",
        s_resize = "s-resize",
        w_resize = "w-resize",
        ne_resize = "ne-resize",
        se_resize = "se-resize",
        ns_resize = "ns-resize",
        sw_resize = "sw-resize",
        nesw_resize = "nesw-resize",
        nwse_resize = "nwse-resize",
    }
    export class RUICursor {
        Cursor: RUICursorType;
        private m_input;
        private m_canvas;
        constructor(canvas: RUIDOMCanvas);
        private onMouseEnter(e);
        private onMouseLeave(e);
        SetCursor(type: RUICursorType): void;
    }
}
declare module "rui/RUIShaderLib" {
    export const GLSL_FRAG_COLOR = "#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = vColor;\n}";
    export const GLSL_VERT_DEF = "#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\n\nvoid main(){\nvec2 pos =aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\n}";
    export const GLSL_FRAG_TEXT = "#version 300 es\nprecision lowp float;\n\nin vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nvec4 col = texture(uSampler,vUV);\nfragColor = col;\n}";
    export const GLSL_VERT_TEXT = "#version 300 es\nprecision mediump float;\nin vec3 aPosition;\nin vec4 aColor;\nin vec2 aUV;\nin vec4 aClip;\n\nuniform vec4 uProj;\nout vec4 vColor;\nout vec2 vUV;\n\nvoid main(){\nvec2 pos = aPosition.xy;\npos = clamp(pos,aClip.xy,aClip.zw);\n\nvec2 offset = aPosition.xy - pos;\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\nvColor = aColor;\nvUV =aUV - offset / 128.0;\n}";
    export const GLSL_FRAG_IMAGE = "#version 300 es\nprecision lowp float;\n\n//in vec4 vColor;\nin vec2 vUV;\n\nuniform sampler2D uSampler;\n\nout vec4 fragColor;\n\nvoid main(){\nfragColor = texture(uSampler,vUV);\n}";
    export const GLSL_VERT_IMAGE = "#version 300 es\nprecision mediump float;\nin vec3 aPosition;\n//in vec4 aColor;\n//in vec4 aClip;\nin vec2 aUV;\n\nuniform vec4 uProj;\n//out vec4 vColor;\nout vec2 vUV;\n\n\nvoid main(){\nvec2 pos =aPosition.xy;\n//pos = clamp(pos,aClip.xy,aClip.zw);\npos = pos * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,aPosition.z,1);\n//vColor = aColor;\nvUV = aUV;\n}\n";
}
declare module "rui/RUIBinder" {
    export function BIND_EMITTER(property: string): string;
    export function RUIBind(tar: any, property: string, f: (t: any) => void): void;
}
declare module "rui/RUIColor" {
    export class RUIColor {
        static readonly RED: number[];
        static readonly BLACK: number[];
        static readonly WHITE: number[];
        static readonly GREEN: number[];
        static readonly BLUE: number[];
        static readonly YELLOW: number[];
        static readonly GREY: number[];
        static readonly COLOR_ERROR: number[];
    }
}
declare module "rui/widget/RUIImage" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    export enum RUIImageSize {
        Initial = 0,
        Cover = 1,
        Contain = 2,
        ScaleToFit = 3,
    }
    export class RUIImage extends RUIObject {
        private m_image;
        private m_valid;
        private m_size;
        imageBackground?: number[];
        constructor(url: string, width?: number, height?: number, size?: RUIImageSize);
        readonly src: string;
        isvalid: boolean;
        imageSize: RUIImageSize;
        static Create(ruiimg: RUIImage, width?: number, height?: number, size?: RUIImageSize): RUIImage;
        private loadImage(url);
        private onImageLoaded(image, e);
        private updateImageSize();
        onDraw(cmd: RUICmdList): void;
    }
}
declare module "rui/RUICmdList" {
    import { RUIRect, RUIRectP } from "rui/RUIObject";
    import { RUIRoot } from "rui/RUIRoot";
    import { RUIImageSize } from "rui/widget/RUIImage";
    export enum RUIDrawCmdType {
        rect = 0,
        text = 1,
        border = 2,
        line = 3,
        image = 4,
    }
    export class RUIDrawCmd {
        Rect: number[];
        Color: number[];
        Text: string;
        clip: RUIRectP;
        object?: any;
        param?: any;
        Index: number;
        type: RUIDrawCmdType;
        constructor(rect?: number[]);
        static CmdRect(rect: number[], color: number[]): RUIDrawCmd;
        static CmdText(text: string, cliprect: RUIRectP, color?: number[]): RUIDrawCmd;
        static CmdBorder(rect: number[], color: number[]): RUIDrawCmd;
        static CmdLine(x1: number, y1: number, x2: number, y2: number, color: number[]): RUIDrawCmd;
        static CmdImage(image: HTMLImageElement, rect: RUIRect): RUIDrawCmd;
    }
    export class RUICmdList {
        drawList: RUIDrawCmd[];
        MaxDrawCount: number;
        isDirty: boolean;
        currentOrder: number;
        draw(root: RUIRoot): void;
        DrawRectWithColor(pos: number[], color: number[], clip?: RUIRect, order?: number): void;
        DrawImage(image: HTMLImageElement, r: RUIRect, clip?: RUIRect, order?: number, size?: RUIImageSize): void;
        DrawText(text: string, rect: RUIRect, color?: number[], cliprect?: RUIRect, order?: number): void;
        DrawBorder(rect: number[], color: number[], cliprect?: RUIRect, order?: number): void;
        /** TODO */
        DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[], order?: number): void;
    }
}
declare module "rui/RUIContainer" {
    import { RUIObject, RUIOverflow, RUIOrientation, RUIRect, RUILayouter, RUILayoutData } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIRoot } from "rui/RUIRoot";
    import { RUIWheelEvent } from "rui/RUIEvent";
    export enum RUIContainerUpdateMode {
        None = 0,
        LayoutUpdate = 1,
        LayoutFull = 2,
    }
    export enum RUIContainerClipType {
        NoClip = 0,
        Clip = 1,
        ClipSelf = 2,
    }
    export class RUIContainer extends RUIObject {
        boxClip: RUIContainerClipType;
        boxOverflow: RUIOverflow;
        boxOrientation: RUIOrientation;
        boxBorder?: number[];
        boxBackground?: number[];
        boxSideExtens: boolean;
        boxMatchWidth: boolean;
        boxMatchHeight: boolean;
        children: RUIObject[];
        layoutSideChildMax?: number;
        layoutSkipDraw: boolean;
        layoutClipRect: RUIRect;
        layoutClipRectPadded: RUIRect;
        /** mark execute for children ui of @function traversal */
        skipChildTraversal: boolean;
        constructor(orit?: RUIOrientation);
        readonly isVertical: boolean;
        addChild(ui: RUIObject): void;
        hasChild(ui: RUIObject): boolean;
        removeChild(ui: RUIObject): void;
        removeChildByIndex(index: number): RUIObject;
        protected containerUpdateCheck(): RUIContainerUpdateMode;
        LayoutRelativeUI(container: RUIContainer, children: RUIObject[]): void;
        onDraw(cmd: RUICmdList): void;
        onDrawPre(cmd: RUICmdList): void;
        onDrawPost(cmd: RUICmdList): void;
        protected RectMinusePadding(recta: RUIRect, offset: number[]): RUIRect;
        setRoot(root: RUIRoot): void;
        onMouseWheel(e: RUIWheelEvent): void;
        traversal(f: (c: RUIObject) => void): void;
    }
    export class RUIContainerLayouter implements RUILayouter {
        private static s_layouter;
        static readonly Layouter: RUIContainerLayouter;
        Layout(ui: RUIObject): void;
        LayoutPost(ui: RUIObject, data: RUILayoutData): void;
    }
}
declare module "rui/RUIRoot" {
    import { RUIObject, RUIRect } from "rui/RUIObject";
    import { RUIObjEvent } from "rui/RUIEvent";
    export class RUIRoot {
        root: RUIObject;
        isdirty: boolean;
        expandSize: boolean;
        private m_onMouseDown;
        private m_activeUI;
        private m_activeUIonDrag;
        private m_hoverUI;
        private m_rootSizeWidth;
        private m_rootSizeHeight;
        private m_rootRect;
        constructor(ui: RUIObject, expandSize?: boolean);
        readonly rootRect: RUIRect;
        resizeRoot(width: number, height: number): void;
        dispatchEvent(event: RUIObjEvent): void;
        private dispatchMouseEvent(e);
        layout(): void;
        private calculateFinalOffset(cui, order?);
        private dispatchMouseMove(x, y);
        private traversalAll(x, y);
        private traversalNormal(x, y);
    }
}
declare module "rui/RUIObject" {
    import { RUIRoot } from "rui/RUIRoot";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIMouseEvent, RUIMouseDragEvent, RUIKeyboardEvent } from "rui/RUIEvent";
    import { RUIContainer } from "rui/RUIContainer";
    export const RUIAuto: number;
    export type RUIRect = number[];
    export type RUIRectP = number[];
    export const RUICLIP_MAX: number[];
    export const RUICLIP_NULL: any;
    export function ROUND(x: number): number;
    export function CLAMP(val: number, min: number, max: number): number;
    export class RUIConst {
        static readonly TOP: number;
        static readonly RIGHT: number;
        static readonly BOTTOM: number;
        static readonly LEFT: number;
    }
    export enum RUIPosition {
        Default = 0,
        Relative = 1,
        Absolute = 2,
        Offset = 3,
    }
    export enum RUIBoxFlow {
        Flow = 0,
        Flex = 1,
    }
    export enum RUIOverflow {
        Clip = 0,
        Scroll = 1,
    }
    export enum RUIOrientation {
        Vertical = 0,
        Horizontal = 1,
    }
    export class RUIObject {
        maxwidth: number;
        maxheight: number;
        minwidth: number;
        minheight: number;
        margin: number[];
        padding: number[];
        position: RUIPosition;
        left: number;
        right: number;
        top: number;
        bottom: number;
        visible: boolean;
        zorder: number;
        flex?: number;
        parent: RUIContainer;
        id: string;
        isdirty: boolean;
        isClip: boolean;
        private _enable;
        _level: number;
        _order: number;
        protected _rect: RUIRect;
        _drawClipRect: RUIRect;
        _root: RUIRoot;
        _resized: boolean;
        _debugname: string;
        rWidth?: number;
        rHeight?: number;
        layouter: RUILayouter;
        layoutWidth?: number;
        layoutHeight?: number;
        rCalWidth: number;
        rCalHeight: number;
        rOffx: number;
        rOffy: number;
        rCalx: number;
        rCaly: number;
        clipMask: RUIRect;
        responseToMouseEvent: boolean;
        Layout(): void;
        LayoutPost(data: RUILayoutData): void;
        Update(): void;
        onDraw(cmd: RUICmdList): void;
        width: number;
        height: number;
        readonly isRoot: boolean;
        readonly isOnFlow: boolean;
        readonly isPositionOffset: boolean;
        readonly positionOffsetX: number;
        readonly positionOffsetY: number;
        setRoot(root: RUIRoot): void;
        enable: boolean;
        setDirty(resize?: boolean): void;
        private popupDirty();
        onMouseDown(e: RUIMouseEvent): void;
        onMouseUp(e: RUIMouseEvent): void;
        onActive(): void;
        onInactive(): void;
        onMouseLeave(): void;
        onMouseEnter(): void;
        onMouseClick(e: RUIMouseEvent): void;
        onMouseDrag(e: RUIMouseDragEvent): void;
        onKeyPress(e: RUIKeyboardEvent): void;
        calculateRect(cliprect?: RUIRect): RUIRect;
        rectContains(x: number, y: number): boolean;
    }
    export class RUIDefaultLayouter implements RUILayouter {
        private static s_layouter;
        static readonly Layouter: RUIDefaultLayouter;
        Layout(ui: RUIObject): void;
        LayoutPost(ui: RUIObject, data: RUILayoutData): void;
        static LayoutRelative(c: RUIObject, cpw: number, cph: number): void;
    }
    export interface RUILayouter {
        /**
         * calculate ui.LayoutWidth ui.LayoutHeight
         * @param ui Target UI object.
         */
        Layout(ui: RUIObject): any;
        LayoutPost(ui: RUIObject, data: RUILayoutData): any;
    }
    export class RUILayoutData {
        /** should not be RUIAuto */
        containerWidth: number;
        /** should not be RUIAuto */
        containerHeight: number;
        containerPadding: number[];
        flexWidth?: number;
        flexHeight?: number;
        verify(): void;
    }
}
declare module "rui/RUIUtil" {
    import { RUIRect, RUIRectP } from "rui/RUIObject";
    export function ROUND(x: number): number;
    export function CLAMP(val: number, min: number, max: number): number;
    export function SATURATE(val: number): number;
    export function SIZE(val: number): number;
    export type RUISizePair = {
        width: number;
        height: number;
    };
    export type RUIAlign = number;
    export class RUIUtil {
        static readonly ALIGN_CENTER: RUIAlign;
        static readonly ALIGN_LEFT: RUIAlign;
        static readonly ALIGN_RIGHT: RUIAlign;
        static readonly LINE_HEIGHT_DEFAULT: number;
        static RectClip(content: RUIRect, clip: RUIRect): RUIRect | null;
        static RectClipP(content: RUIRectP, clip: RUIRectP): RUIRectP | null;
        static toRect(rect: RUIRectP): RUIRect;
        static toRectP(rect: RUIRect): RUIRectP;
        static Vector(v: number): number[];
        static ColorUNorm(r: number, g: number, b: number, a?: number): number[];
        static RandomColor(): number[];
        static RectContains(rect: number[], x: number, y: number): boolean;
        static IntersectNull(a: RUIRect, b: RUIRect): boolean;
        static RectIndent(r: RUIRect, off: number): number[];
    }
}
declare module "rui/RUIContext" {
    export type RUIInitConfig = {
        fontPath?: string;
        fontSize?: number;
    };
    export var RUI_CONFIG: RUIInitConfig;
    export function RUIInitContext(config: RUIInitConfig): void;
}
declare module "rui/RUIFontTexture" {
    import { GLContext } from 'wglut';
    import { RUIEventEmitter } from "rui/RUIEvent";
    export class RUIGlyph {
        width: number;
        height: number;
        advancex: number;
        offsetY: number;
        uv: number[];
    }
    export class RUIFontTexture {
        private static s_inited;
        private static s_gl;
        static ASIICTexture: RUIFontTexture;
        private m_font;
        private m_ctx2d;
        private m_textureWidth;
        private m_textureHeight;
        m_glTexture: WebGLTexture;
        private m_textureValid;
        glyphs: {
            [key: number]: RUIGlyph;
        };
        glyphsWidth: number[];
        m_isDirty: boolean;
        fontSize: number;
        static EventOnTextureLoaded: RUIEventEmitter<RUIFontTexture>;
        constructor();
        readonly isTextureValid: boolean;
        isDirty: boolean;
        static Init(gl: GLContext): void;
        private LoadFont();
        MeasureTextWith(content: string): number;
        private FillTexture();
        private createTextureImage(glctx, internalFmt, format, src, linear, mipmap, callback);
        private CrateTexture();
    }
}
declare module "rui/RUIDrawCallBuffer" {
    import { GLProgram, GLContext } from "wglut";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUITextureStorage } from "rui/RUIRenderer";
    export class RUITextureDrawData {
        texture: WebGLTexture;
        data: number[];
        uv: number[];
        count: number;
    }
    export class RUIDrawCallBuffer {
        vaoRect: WebGLVertexArrayObject;
        vaoText: WebGLVertexArrayObject;
        vaoImage: WebGLVertexArrayObject;
        vertexBufferRect: WebGLBuffer;
        colorBufferRect: WebGLBuffer;
        clipBufferRect: WebGLBuffer;
        drawCountRect: number;
        vertexBufferText: WebGLBuffer;
        colorBufferText: WebGLBuffer;
        uvBufferText: WebGLBuffer;
        clipBufferText: WebGLBuffer;
        drawCountText: number;
        vertexBufferImage: WebGLBuffer;
        uvBufferImage: WebGLBuffer;
        indicesBuffer: WebGLBuffer;
        private m_drawcall;
        isDirty: boolean;
        programRect: GLProgram;
        programText: GLProgram;
        programImage: GLProgram;
        private m_indicesBufferArray;
        private m_aryBufferRectColor;
        private m_aryBufferRectPos;
        private m_aryBufferRectClip;
        private m_aryBufferTextPos;
        private m_aryBufferTextUV;
        private m_aryBufferTextClip;
        textureDrawData: RUITextureDrawData[];
        constructor(glctx: GLContext, drawcall: RUICmdList);
        SyncBuffer(gl: WebGL2RenderingContext, textureStorage: RUITextureStorage): void;
    }
}
declare module "rui/RUIStyle" {
    export class RUIStyle {
        static Default: RUIStyle;
        background0: number[];
        background1: number[];
        background2: number[];
        background3: number[];
        primary: number[];
        primary0: number[];
        inactive: number[];
        border0: number[];
    }
}
declare module "rui/RUIRenderer" {
    import { RUIDOMCanvas } from "rui/RUIDOMCanvas";
    import { RUICmdList } from "rui/RUICmdList";
    import wglut = require('wglut');
    export class RUIRenderer {
        private gl;
        private glctx;
        private m_drawcallBuffer;
        private m_projectParam;
        private m_programRect;
        private m_isvalid;
        private m_isResized;
        private m_uicanvas;
        private m_needRedraw;
        private m_textureStorage;
        constructor(uicanvas: RUIDOMCanvas);
        resizeCanvas(w: number, h: number): void;
        readonly isResized: boolean;
        readonly needRedraw: boolean;
        useResized(): void;
        isValid(): boolean;
        private SetupGL();
        DrawCmdList(cmdlist: RUICmdList): void;
    }
    export class RUITextureStorage {
        private m_glctx;
        private m_map;
        constructor(glctx: wglut.GLContext);
        getTexture(image: HTMLImageElement): WebGLTexture;
    }
}
declare module "rui/RUIDOMCanvas" {
    import { RUIInput } from "rui/RUIInput";
    import { RUICursor } from "rui/RUICursor";
    import { RUIRenderer } from "rui/RUIRenderer";
    import { RUIEventEmitter, RUIResizeEvent, RUIObjEvent } from "rui/RUIEvent";
    export class RUIDOMCanvas {
        private m_canvas;
        private m_renderer;
        private m_input;
        private m_cursor;
        m_width: number;
        m_height: number;
        private m_isResized;
        EventOnResize: RUIEventEmitter<RUIResizeEvent>;
        EventOnUIEvent: RUIEventEmitter<RUIObjEvent>;
        constructor(canvas: HTMLCanvasElement);
        private registerEvent();
        private onResizeCanvas(width, height);
        readonly canvas: HTMLCanvasElement;
        readonly renderer: RUIRenderer;
        readonly input: RUIInput;
        readonly cursor: RUICursor;
        readonly canvasRect: number[];
        setSize(w: number, h: number): void;
    }
}
declare module "rui/RUIRectangle" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIMouseEvent, RUIMouseDragEvent } from "rui/RUIEvent";
    export class RUIRectangle extends RUIObject {
        protected m_debugColor: number[];
        constructor(w?: number, h?: number);
        static create(color: number[]): RUIRectangle;
        onDraw(cmd: RUICmdList): void;
        onMouseUp(): void;
        onMouseDown(): void;
        onActive(): void;
        onInactive(): void;
        onMouseEnter(): void;
        onMouseLeave(): void;
        onMouseClick(e: RUIMouseEvent): void;
        onMouseDrag(e: RUIMouseDragEvent): void;
    }
}
declare module "rui/RUIFlexContainer" {
    import { RUIObject, RUILayouter, RUILayoutData } from "rui/RUIObject";
    import { RUIContainer } from "rui/RUIContainer";
    export class RUIFlexContainer extends RUIContainer {
        layoutFlexAccu: number;
        layoutFixedAccu: number;
        constructor();
    }
    export class RUIFlexLayouter implements RUILayouter {
        private static s_default;
        static readonly Default: RUIFlexLayouter;
        private constructor();
        private AccuFlex(flex, ui, isvertical);
        Layout(ui: RUIObject): void;
        LayoutPost(ui: RUIObject, data: RUILayoutData): void;
    }
}
declare module "rui/widget/RUIButton" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIMouseEvent } from "rui/RUIEvent";
    export type RUIButtonFunc = (btn: RUIButton) => void;
    export class RUIButton extends RUIObject {
        label: string;
        private m_color;
        private m_onhover;
        clickFunction?: RUIButtonFunc;
        constructor(label: string, f?: RUIButtonFunc);
        onDraw(cmd: RUICmdList): void;
        onMouseEnter(): void;
        onMouseLeave(): void;
        onMouseClick(e: RUIMouseEvent): void;
        onMouseDown(): void;
        onMouseUp(): void;
    }
}
declare module "rui/widget/RUIButtonGroup" {
    import { RUIContainer } from "rui/RUIContainer";
    import { RUIButton } from "rui/widget/RUIButton";
    import { RUIOrientation, RUILayoutData } from "rui/RUIObject";
    export class RUIButtonGroup extends RUIContainer {
        private m_buttons;
        constructor(buttons: RUIButton[], orientation: RUIOrientation);
        getButtonIndex(btn: RUIButton): number;
        LayoutPost(data: RUILayoutData): void;
    }
}
declare module "rui/widget/RUILabel" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    export class RUILabel extends RUIObject {
        m_label: string;
        constructor(label: string);
        label: string;
        Layout(): void;
        onDraw(cmd: RUICmdList): void;
    }
}
declare module "rui/widget/RUICanvas" {
    import { RUIContainer } from "rui/RUIContainer";
    import { RUIMouseDragEvent } from "rui/RUIEvent";
    export class RUICanvas extends RUIContainer {
        constructor();
    }
    export class RUICanvasNode extends RUIContainer {
        private m_dragStartPosX;
        private m_dragStartPosY;
        protected m_draggable: boolean;
        constructor();
        onMouseDrag(e: RUIMouseDragEvent): void;
    }
    export class RUICanvasContainerNode extends RUICanvasNode {
        private m_onactive;
        constructor(title: string);
        onActive(): void;
        onInactive(): void;
    }
}
declare module "rui/widget/RUICheckBox" {
    import { RUIAlign } from "rui/RUIUtil";
    import { RUIContainer } from "rui/RUIContainer";
    import { RUIEventEmitter } from "rui/RUIEvent";
    export class RUICheckBox extends RUIContainer {
        private m_align;
        private m_inner;
        readonly EventOnClick: RUIEventEmitter<boolean>;
        isChecked: boolean;
        constructor(checked: boolean, align?: RUIAlign);
        private updateAlign(align);
    }
}
declare module "rui/widget/RUICollapsibleContainer" {
    import { RUIContainer } from "rui/RUIContainer";
    import { RUIObject, RUIOrientation } from "rui/RUIObject";
    export class RUICollapsibleContainer extends RUIContainer {
        private m_show;
        private m_button;
        private m_container;
        constructor(label: string, show: boolean, orientation?: RUIOrientation);
        private onButtonClick(b);
        addChild(ui: RUIObject): void;
        removeChild(ui: RUIObject): void;
    }
}
declare module "rui/widget/RUITextInput" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIKeyboardEvent, RUIEventEmitter } from "rui/RUIEvent";
    export class RUITextInputFormat {
        private m_regexp;
        constructor(r: RegExp);
        static NUMBER: RUITextInputFormat;
        static DEFAULT: RUITextInputFormat;
        static EMAIL: RUITextInputFormat;
        verify(text: string): boolean;
    }
    export class RUITextInput extends RUIObject {
        private m_content;
        private m_isError;
        private m_onActive;
        EventOnTextChange: RUIEventEmitter<string>;
        inputFormat: RUITextInputFormat;
        constructor(content?: string, format?: RUITextInputFormat);
        content: string;
        onActive(): void;
        onInactive(): void;
        onDraw(cmd: RUICmdList): void;
        onKeyPress(e: RUIKeyboardEvent): void;
    }
}
declare module "rui/widget/RUISlider" {
    import { RUIObject } from "rui/RUIObject";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIMouseEvent, RUIMouseDragEvent, RUIEventEmitter } from "rui/RUIEvent";
    export class RUISlider extends RUIObject {
        static readonly SLIDER_HEIGHT: number;
        private m_value;
        EventOnValue: RUIEventEmitter<number>;
        constructor(val: number, height?: number);
        value: number;
        setValue(val: number): void;
        onMouseDown(e: RUIMouseEvent): void;
        onMouseDrag(e: RUIMouseDragEvent): void;
        onDraw(cmd: RUICmdList): void;
    }
}
declare module "rui/widget/RUISliderInput" {
    import { RUIFlexContainer } from "rui/RUIFlexContainer";
    export class RUISliderInput extends RUIFlexContainer {
        private m_slider;
        private m_input;
        private m_isinteger;
        private m_min;
        private m_max;
        constructor(val: number, min?: number, max?: number, isInteger?: boolean);
        readonly value: number;
        private onInputChange(e);
        private onValue(e);
    }
}
declare module "rui/widget/RUIField" {
    import { RUIObject } from "rui/RUIObject";
    import { RUIFlexContainer } from "rui/RUIFlexContainer";
    import { RUILabel } from "rui/widget/RUILabel";
    import { RUITextInput, RUITextInputFormat } from "rui/widget/RUITextInput";
    import { RUICheckBox } from "rui/widget/RUICheckBox";
    import { RUIAlign } from "rui/RUIUtil";
    import { RUIEventEmitter } from "rui/RUIEvent";
    import { RUISliderInput } from "rui/widget/RUISliderInput";
    export class RUIField<T extends RUIObject> extends RUIFlexContainer {
        protected m_label: RUILabel;
        protected m_widget: T;
        constructor(label: string, t: T);
    }
    export class RUITextField extends RUIField<RUITextInput> {
        constructor(label: string, content: string, format?: RUITextInputFormat);
        label: string;
        content: string;
    }
    export class RUICheckBoxField extends RUIField<RUICheckBox> {
        constructor(label: string, checked: boolean, align?: RUIAlign);
        isChecked: boolean;
        readonly EventOnClick: RUIEventEmitter<boolean>;
    }
    export class RUIIntegerField extends RUIField<RUISliderInput> {
        constructor(label: string, value: number, min?: number, max?: number);
    }
    export class RUIFloatField extends RUIField<RUISliderInput> {
        constructor(label: string, value: number, min?: number, max?: number);
    }
}
declare module "rui/widget/RUIOverlay" {
    import { RUIContainer } from "rui/RUIContainer";
    export class RUIOverlay extends RUIContainer {
        constructor();
    }
}
declare module "rui/widget/RUIScrollBar" {
    import { RUIOrientation, RUILayoutData } from "rui/RUIObject";
    import { RUIContainer } from "rui/RUIContainer";
    import { RUICmdList } from "rui/RUICmdList";
    import { RUIRectangle } from "rui/RUIRectangle";
    import { RUIMouseDragEvent, RUIEventEmitter } from "rui/RUIEvent";
    export class RUIScrollBarThumb extends RUIRectangle {
        private m_hoverColor;
        private m_defaultColor;
        private m_scrollbar;
        private m_dragStartOffset;
        private m_onDrag;
        private m_onHover;
        constructor(scrollbar: RUIScrollBar);
        onMouseEnter(): void;
        onMouseLeave(): void;
        Layout(): void;
        onDraw(cmd: RUICmdList): void;
        onMouseDrag(e: RUIMouseDragEvent): void;
    }
    export class RUIScrollBar extends RUIContainer {
        private m_thumb;
        private m_scrollPosVal;
        private m_sizeVal;
        private m_size;
        private m_scrollOrientation;
        EventOnScroll: RUIEventEmitter<number>;
        constructor(orientation?: RUIOrientation);
        readonly isVerticalScroll: boolean;
        Layout(): void;
        LayoutPost(data: RUILayoutData): void;
        scrollPosVal: number;
        sizeVal: number;
        onThumbDrag(pos: number): void;
        scrollOrientation: RUIOrientation;
    }
}
declare module "rui/widget/RUIScrollView" {
    import { RUIContainer } from "rui/RUIContainer";
    import { RUIObject, RUILayoutData } from "rui/RUIObject";
    import { RUIWheelEvent } from "rui/RUIEvent";
    export class RUIScrollView extends RUIContainer {
        scrollVertical: boolean;
        scrollHorizontal: boolean;
        private m_contentWrap;
        private m_sliderVertical;
        private m_sliderHorizontal;
        private m_scrollbarVShow;
        private m_scrollbarHShow;
        private m_overflowH;
        private m_overflowV;
        private m_contentH;
        private m_contentV;
        private m_viewH;
        private m_viewV;
        constructor();
        private onScrollHorizontal(e);
        private onScrollVertical(e);
        private setScrollV(pos);
        private setScrollH(pos);
        Layout(): void;
        LayoutPost(data: RUILayoutData): void;
        onMouseWheel(e: RUIWheelEvent): void;
        addChild(ui: RUIObject): void;
        removeChild(ui: RUIObject): void;
        removeChildByIndex(index: number): RUIObject;
        scrollBarShowV(show: boolean): void;
        scrollBarShowH(show: boolean): void;
    }
}
declare module "rui/widget/RUITabView" {
    import { RUIObject } from "rui/RUIObject";
    import { RUIFlexContainer } from "rui/RUIFlexContainer";
    export interface RUITabPage {
        label: string;
        ui: RUIObject;
    }
    export class RUITabView extends RUIFlexContainer {
        private m_pages;
        private m_menu;
        private m_pageWrap;
        private m_pageIndex?;
        constructor(pages?: RUITabPage[], tabpos?: number);
        private onMenuClick(b);
        private setPageIndex(index);
        addChild(ui: RUIObject): void;
        removeChild(ui: RUIObject): void;
    }
}
declare module "rui/widget/RUIToolTip" {
    import { RUIRectangle } from "rui/RUIRectangle";
    import { RUICmdList } from "rui/RUICmdList";
    export class RUIToolTip extends RUIRectangle {
        private m_onHover;
        constructor();
        onMouseEnter(): void;
        onMouseLeave(): void;
        onDraw(cmd: RUICmdList): void;
    }
}
declare module "rui" {
    export * from "rui/RUIDOMCanvas";
    export * from "rui/RUIUtil";
    export * from "rui/RUIBinder";
    export * from "rui/RUICmdList";
    export * from "rui/RUIRoot";
    export * from "rui/RUICursor";
    export * from "rui/RUIDrawCallBuffer";
    export * from "rui/RUIEvent";
    export * from "rui/RUIFontTexture";
    export * from "rui/RUIInput";
    export * from "rui/RUIRectangle";
    export * from "rui/RUIRenderer";
    export * from "rui/RUIStyle";
    export * from "rui/RUIContainer";
    export * from "rui/RUIFlexContainer";
    export * from "rui/widget/RUIButton";
    export * from "rui/widget/RUIButtonGroup";
    export * from "rui/widget/RUICanvas";
    export * from "rui/widget/RUICheckBox";
    export * from "rui/widget/RUICollapsibleContainer";
    export * from "rui/widget/RUIField";
    export * from "rui/widget/RUIImage";
    export * from "rui/widget/RUILabel";
    export * from "rui/widget/RUIOverlay";
    export * from "rui/widget/RUIScrollBar";
    export * from "rui/widget/RUIScrollView";
    export * from "rui/widget/RUISlider";
    export * from "rui/widget/RUISliderInput";
    export * from "rui/widget/RUITabView";
    export * from "rui/widget/RUITextInput";
    export * from "rui/widget/RUIToolTip";
    export * from "rui/RUIShaderLib";
}
