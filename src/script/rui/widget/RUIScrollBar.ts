import { RUIObject, RUIOrientation, CLAMP, RUIPosition } from "../RUIObject";
import { RUIContainer } from "../RUIContainer";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage, RUIEventEmitter } from "../RUIEvent";

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