import { RUIObject, RUIOrientation, CLAMP, RUIPosition, RUIAuto, RUILayoutData } from "../RUIObject";
import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage, RUIEventEmitter } from "../RUIEvent";
import { RUIUtil, SATURATE } from "../RUIUtil";

export class RUIScrollBarThumb extends RUIRectangle {
    private m_hoverColor: number[] = RUIStyle.Default.primary0;
    private m_defaultColor: number[] = RUIStyle.Default.background3;

    private m_scrollbar: RUIScrollBar;
    private m_dragStartOffset: number;
    private m_onDrag: boolean = false;
    private m_onHover: boolean = false;

    public constructor(scrollbar: RUIScrollBar) {
        super();
        this.m_scrollbar = scrollbar;
        this.m_debugColor = this.m_defaultColor;
        this.position = RUIPosition.Offset;
        this.responseToMouseEvent =true;
        this.left = 0;
        this.top = 0;

        this.width = 10;
        this.height = 10;
    }

    public onMouseEnter() {
        this.m_onHover = true;
        this.setDirty();
    }

    public onMouseLeave() {
        this.m_onHover = false;
        this.setDirty();
    }

    public Layout() {
        super.Layout();
        if (this.m_onHover || this.m_onDrag) {
            this.m_debugColor = this.m_hoverColor;
        }
        else {
            this.m_debugColor = this.m_defaultColor;
        }
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);
    }

    public onMouseDrag(e: RUIMouseDragEvent) {
        let isvertical = this.m_scrollbar.isVerticalScroll;
        if (e.stage == RUIMouseDragStage.Begin) {
            this.m_dragStartOffset = (isvertical ? e.mousey - this.top : e.mousex - this.left);
            this.m_onDrag = true;
        }
        else if (e.stage == RUIMouseDragStage.Update) {
            let pos = (isvertical ? e.mousey : e.mousex) - this.m_dragStartOffset;
            let bar = this.m_scrollbar;
            let off = isvertical ? this.top : this.left;
            if (pos == off) return;
            bar.onThumbDrag(pos);
            this.m_onDrag = true;
        }
        else {
            this.m_onDrag = false;
        }
        e.Use();
    }
}

export class RUIScrollBar extends RUIContainer {
    private m_thumb: RUIScrollBarThumb;
    private m_scrollPosVal: number = 0;
    private m_sizeVal: number = 0;
    private m_size: number;
    private m_scrollOrientation: RUIOrientation;

    public EventOnScroll: RUIEventEmitter<number> = new RUIEventEmitter();

    public constructor(orientation: RUIOrientation = RUIOrientation.Horizontal) {
        super();

        let thumb = new RUIScrollBarThumb(this);
        this.addChild(thumb);
        this.m_thumb = thumb;
        this.m_scrollOrientation = orientation;
        this.boxOrientation = this.isVerticalScroll ? RUIOrientation.Horizontal : RUIOrientation.Vertical;
        this.boxBackground = RUIStyle.Default.background0;
        this.boxSideExtens = true;

        if (orientation == RUIOrientation.Horizontal) {
            thumb.height = 10;
        }
        else {
            thumb.width = 10;
        }
    }

    public get isVerticalScroll(): boolean {
        return this.m_scrollOrientation == RUIOrientation.Vertical;
    }

    public Layout() {
        super.Layout();

        if (this.isVerticalScroll) {
            this.layoutWidth = 10;
        }
        else {
            this.layoutHeight = 10;
        }
    }

    public LayoutPost(data: RUILayoutData) {
        super.LayoutPost(data);
        let size = this.isVerticalScroll ? this.rCalHeight : this.rCalWidth;
        this.m_size = size;
        //set thumb size
        let thumbsize = this.m_sizeVal * size;

        let thumb = this.m_thumb;
        if (this.isVerticalScroll) {
            thumb.rCalWidth = this.rCalWidth;
            thumb.rCalHeight = thumbsize;
            thumb.rOffx = 0;
            thumb.rOffy = this.m_scrollPosVal * size;
            thumb.left = 0;
            thumb.top = thumb.rOffy;
        }
        else {
            thumb.rCalWidth = thumbsize;
            thumb.rCalHeight = this.rCalHeight;
            thumb.rOffx = this.m_scrollPosVal * size;
            thumb.rOffy = 0;
            thumb.top = 0;
            thumb.left = thumb.rOffx;
        }
        thumb.width = thumb.rCalWidth;
        thumb.height = thumb.rCalHeight;
    }

    public set scrollPosVal(val: number) {
        if (val === NaN) return;
        val = CLAMP(val, 0, 1.0 - this.m_sizeVal);
        if (val == this.m_scrollPosVal) return;
        this.m_scrollPosVal = val;
        this.setDirty();
    }

    public get scrollPosVal(): number {
        return this.m_scrollPosVal;
    }

    public set sizeVal(val: number) {
        if (val === NaN) return;
        val = SATURATE(val);
        if (val == this.sizeVal) return;
        this.m_sizeVal = val;
        this.setDirty();
    }

    public get sizeVal(): number {
        return this.m_sizeVal;
    }

    public onThumbDrag(pos: number) {
        
        let val = pos / this.m_size;
        
        let prev = this.scrollPosVal;
        this.scrollPosVal = val;
        val = this.scrollPosVal;
        if(prev != val){
            this.EventOnScroll.emitRaw(val);
        }
    }

    public get scrollOrientation(): RUIOrientation {
        return this.m_scrollOrientation;
    }

    public set scrollOrientation(orientation: RUIOrientation) {
        if (this.m_scrollOrientation == orientation) {
            return;
        }
        this.m_scrollOrientation = orientation;
        this.setDirty(true);
    }
}