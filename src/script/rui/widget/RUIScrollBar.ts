import { RUIObject, RUIOrientation, CLAMP, RUIPosition, RUIAuto } from "../RUIObject";
import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage, RUIEventEmitter } from "../RUIEvent";
import { RUI, RUIColor, SATURATE, RUILayoutData } from "../RUI";

export enum RUIScrollType{
    Enabled,
    Disabled,
    Always
}

class RUIScrollBarThumb extends RUIRectangle{

    private m_scrollbar:RUIScrollBar = null;

    private m_dragStartOffset:number;

    private m_onHover:boolean = false;
    private m_onDrag:boolean = false;

    public constructor(scrollbar:RUIScrollBar){
        super();
        this.m_scrollbar = scrollbar;
        this.m_debugColor = RUIStyle.Default.background2;
    }


    public onMouseDrag(e:RUIMouseDragEvent){

        // let isvertical = this.m_scrollbar.isVertical;
        // if(e.stage == RUIMouseDragStage.Begin){
        //     this.m_dragStartOffset = (isvertical ? e.mousey - this.top: e.mousex - this.left);
        //     this.m_onDrag = true;
        // }
        // else if(e.stage == RUIMouseDragStage.Update){
        //     let pos = (isvertical ? e.mousey : e.mousex) - this.m_dragStartOffset;
        //     let bar = this.m_scrollbar;
        //     let barsize = isvertical ? bar._calheight : bar._calwidth;
        //     let off = isvertical? this.top : this.left;
        //     pos = CLAMP(pos,0,barsize - (isvertical? this._calheight :this._calwidth));
        //     if(off == pos) return;
        //     pos = pos / barsize;
        //     bar.onThumbDrag(pos);
        //     this.m_onDrag = true;
        // }
        // else{
        //     this.m_onDrag = false;
        // }
        // this.setDirty();
    }

    public onMouseEnter(){
        this.m_onHover= true;
        this.setDirty();
    }

    public onMouseLeave(){
        this.m_onHover = false;
        this.setDirty();
    }

    public onLayoutPost(){
        if(this.m_onDrag){
            this.m_debugColor = RUIStyle.Default.primary0;
        }
        else if(this.m_onHover){
            this.m_debugColor = RUIStyle.Default.primary;
        }
        else{
            this.m_debugColor = RUIStyle.Default.background3;
        }
        
    }
}

export class RUIScrollBar extends RUIContainer{

    public static readonly BAR_SIZE:number = 10;

    private m_scrolltype :RUIScrollType;

    private m_size: number;
    private m_position:number;
    private m_show:boolean = true;

    private m_thumb :RUIScrollBarThumb;

    public EventOnScroll: RUIEventEmitter<number> = new RUIEventEmitter();

    public constructor(orit:RUIOrientation = RUIOrientation.Horizontal,type:RUIScrollType = RUIScrollType.Enabled){
        super();
        this.boxOrientation = orit;
        this.m_scrolltype = type;

        this.m_size = 0.5;
        this.m_position = 0.0;


        let thumb = new RUIScrollBarThumb(this);
        thumb.width =10;
        thumb.height = 10;
        thumb.position = RUIPosition.Offset;
        this.m_thumb = thumb;
        this.addChild(thumb);

        this.setOrientation(this.boxOrientation);

        this.scrollSize = 0.5;
    }

    public get scrollSize():number{
        return this.m_size;
    }

    public get scrollPos():number{
        return this.m_position;
    }

    public set scrollSize(val:number){
        let v = CLAMP(val,0,1.0);
        
        if(this.m_size != v){
            this.m_show = true;
            if(v == 0 || v == 1.0){
                this.scrollPos = 0;
                this.EventOnScroll.emitRaw(0);

                if(!this.isAlwayShow){
                    this.m_show = false;
                }
            }
            this.m_size = v;
            this.setDirty(true);
        }
    }

    private get isAlwayShow():boolean{
        return this.m_scrolltype == RUIScrollType.Always;
    }

    public set scrollPos(val:number){
        let v = CLAMP(val,0,1.0 - this.m_size);
        if(this.m_position != v){
            this.m_position = v;
            this.setDirty();
        }
    }

    public onThumbDrag(val:number){
        this.scrollPos = val;
        this.EventOnScroll.emitRaw(val);
    }

    public onScrollBarClick(val:number){
        this.scrollPos = val;
        this.EventOnScroll.emitRaw(val);
    }


    public onLayoutPost(){
        // let isvertical = this.isVertical;
        // let barsize = (isvertical? this._calheight : this._calwidth) ;
        // let thumbsize = barsize * this.m_size;
        // let thumbpos = barsize * this.m_position;

        // let thumb =this.m_thumb;
        // if(isvertical){
        //     if(thumb.height != thumbsize){
        //         thumb.height = thumbsize;
        //         thumb.setDirty(true);
        //     }

        //     if(thumb.top != thumbpos){
        //         thumb.top = thumbpos;
        //         thumb.setDirty();
        //     }
        // }
        // else{
        //     if(thumb.width != thumbsize){
        //         thumb.width = thumbsize;
        //         thumb.setDirty(true);
        //     }

        //     if(thumb.left != thumbpos){
        //         thumb.left = thumbpos;
        //         thumb.setDirty();
        //     }
        // }
    }

    public onMouseDown(e:RUIMouseEvent){
        // if(this.scrollSize == 0) return;
        // let isvertical = this.isVertical;
        // if(isvertical){
        //     let pos = (e.mousey - this.rCaly) / this._calheight;
        //     if(pos < this.m_position){
        //         this.onScrollBarClick(pos);
        //     }
        //     else{
        //         let posend = this.scrollPos + this.scrollSize;
        //         if(pos > posend){
        //             this.onScrollBarClick( pos - this.scrollSize);
        //         }
        //     }
        // }
        // else{
        //     let pos = (e.mousex - this.rCalx) / this._calwidth;
        //     if(pos < this.m_position){
        //         this.onScrollBarClick(pos);
        //     }
        //     else{
        //         let posend = this.scrollPos + this.scrollSize;
        //         if(pos> posend){
        //             this.onScrollBarClick(pos - this.scrollSize);
        //         }
        //     }
        // }
    }

    private setOrientation(orit:RUIOrientation){
        if(this.isVertical){
            this.width = RUIScrollBar.BAR_SIZE;
        }
        else{
            this.height = RUIScrollBar.BAR_SIZE;
        }
    }

    public onDrawPre(cmd:RUICmdList){
        super.onDrawPre(cmd);
        if(this.m_show)
        {
            cmd.DrawRectWithColor(this._rect,RUIStyle.Default.background0);
        }
    }
}

export class ScrollBarThumb extends RUIRectangle{

    private m_hoverColor:RUIColor = RUIStyle.Default.primary0;
    private m_defaultColor:RUIColor = RUIStyle.Default.background3;

    private m_scrollbar:ScrollBar;
    private m_dragStartOffset:number;
    private m_onDrag:boolean = false;
    private m_onHover:boolean = false;

    public constructor(scrollbar:ScrollBar){
        super();
        this.m_scrollbar = scrollbar;
        this.m_debugColor = this.m_defaultColor;
        this.position = RUIPosition.Offset;
        this.left = 0;
        this.top = 0;

        this.width = 10;
        this.height = 10;
    }

    public onMouseEnter(){
        this.m_onHover = true;
        this.setDirty();
    }

    public onMouseLeave(){
        this.m_onHover = false;
        this.setDirty();
    }

    public Layout(){
        super.Layout();
        if(this.m_onHover || this.m_onDrag){
            this.m_debugColor = this.m_hoverColor;
        }
        else{
            this.m_debugColor = this.m_defaultColor;
        }
    }

    public onDraw(cmd:RUICmdList){

        let noclip = !this.isClip;

        let rect = this.calculateRect();
        if(noclip){
            cmd.PushClip(rect,null, RUIContainerClipType.NoClip);
        }
        else{
            if(cmd.isSkipDraw) return;
        }
        
        this._rectclip = RUI.RectClip(rect,cmd.clipRect);
        this._rect = this._rectclip;
        cmd.DrawRectWithColor(rect,this.m_debugColor);

        if(noclip) cmd.PopClipRect();
    }


    public onMouseDrag(e:RUIMouseDragEvent){
        let isvertical = this.m_scrollbar.isVerticalScroll;
        if(e.stage == RUIMouseDragStage.Begin){
            this.m_dragStartOffset = (isvertical ? e.mousey - this.top: e.mousex - this.left);
            this.m_onDrag = true;
        }
        else if(e.stage == RUIMouseDragStage.Update){
            let pos = (isvertical ? e.mousey : e.mousex) - this.m_dragStartOffset;
            let bar = this.m_scrollbar;
            let off = isvertical? this.top : this.left;
            if(pos == off) return;
            bar.onThumbDrag(pos);
            this.m_onDrag = true;
        }
        else{
            this.m_onDrag = false;
        }

        e.Use();
    }

    
}

export class ScrollBar extends RUIContainer{

    private m_thumb: ScrollBarThumb;

    private m_scrollPosVal:number = 0;
    private m_sizeVal:number =0;

    private m_size:number;

    private m_scrollOrientation: RUIOrientation;


    public EventOnScroll: RUIEventEmitter<number> = new RUIEventEmitter();


    public constructor(orientation:RUIOrientation = RUIOrientation.Horizontal){
        super();

        let thumb = new ScrollBarThumb(this);
        this.addChild(thumb);
        
        this.m_thumb = thumb;

        this.m_scrollOrientation = orientation;
        this.boxOrientation = this.isVerticalScroll? RUIOrientation.Horizontal : RUIOrientation.Vertical;
        this.boxBackground = RUIStyle.Default.background1;
        this.boxSideExtens =true;


        if(orientation == RUIOrientation.Horizontal){
            thumb.height = 10;
        }
        else{
            thumb.width = 10;
        }
    }

    public get isVerticalScroll():boolean{
        return this.m_scrollOrientation == RUIOrientation.Vertical;
    }


    public Layout(){
        super.Layout();

        if(this.isVerticalScroll){
            this.layoutWidth = 10;
        }
        else{
            this.layoutHeight =10;
        }
    }
    



    public LayoutPost(data:RUILayoutData){
        
        super.LayoutPost(data);
        let size = this.isVerticalScroll ? this.rCalHeight : this.rCalWidth;
        this.m_size = size;
        //set thumb size
        let thumbsize = this.m_sizeVal * size;

        let thumb = this.m_thumb;
        if(this.isVerticalScroll){
            thumb.rCalWidth = this.rCalWidth;
            thumb.rCalHeight = thumbsize;
            thumb.rOffx = 0;
            thumb.rOffy = this.m_scrollPosVal * size;
            thumb.left =0;
            thumb.top = thumb.rOffy;
        }
        else{
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

    public set scrollPosVal(val:number){
        if(val === NaN) return;
        val = CLAMP(val,0,1.0 - this.m_sizeVal);
        if(val == this.m_scrollPosVal) return;
        this.m_scrollPosVal = val;
        this.setDirty();
    }

    public get scrollPosVal():number{
        return this.m_scrollPosVal;
    }

    public set sizeVal(val:number){
        if(val === NaN) return;
        val = SATURATE(val);
        if(val ==  this.sizeVal) return;
        this.m_sizeVal = val;
        this.setDirty();
    }

    public get sizeVal():number{
        return this.m_sizeVal;
    }

    public onThumbDrag(pos:number){
        this.scrollPosVal = pos/ this.m_size;
        this.EventOnScroll.emitRaw(this.m_scrollPosVal);
    }

    public get scrollOrientation():RUIOrientation{
        return this.m_scrollOrientation;
    }

    public set scrollOrientation(orientation:RUIOrientation){
        if(this.m_scrollOrientation == orientation){
            return;
        }

        this.m_scrollOrientation= orientation;
        this.setDirty(true);
    }


}