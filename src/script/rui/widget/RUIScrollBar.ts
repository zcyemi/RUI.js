import { RUISlider } from "./RUISlider";
import { RUIOrientation, RUIPosition, RUIObject, ROUND, CLAMP } from "../RUIObject";
import { RUIScrollType } from "./RUIScrollView";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIContainer } from "../RUIContainer";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseDragEvent, RUIMouseDragStage, RUIMouseEvent } from "../EventSystem";



class RUIScrollBarThumb extends RUIRectangle{

    private m_scrollBar: RUIScrollBar;
    private m_dragStart: number;
    private m_dragStartTop:number;

    public position: number;
    public constructor(scrollbar: RUIScrollBar){
        super();
        this.m_scrollBar = scrollbar;
        this.m_debugColor = RUIStyle.Default.primary;
    }


    public onMouseDrag(e:RUIMouseDragEvent){

        let stage = e.stage;
        if(stage == RUIMouseDragStage.Begin){
            this.m_dragStart = e.mousey;
            this.m_dragStartTop = this.top;
        }
        else if(stage == RUIMouseDragStage.Update){
            this.position = (e.mousey - this.m_dragStart + this.m_dragStartTop);
            this.m_scrollBar.setBarPos(this.position);

            
        }
    }
}

export class RUIScrollBar extends RUIContainer{

    public scrollType: RUIScrollType;
    private m_show : boolean= false;
    private m_onHover:boolean = false;
    private m_thumb: RUIScrollBarThumb;


    private m_thumbMaxSize: number;

    public static readonly BAR_SIZE:number = 10;
    public static readonly THUMB_SIZE:number = 10;


    public constructor(orientation: RUIOrientation,scrollType: RUIScrollType){
        super();
        this.boxOrientation = orientation;
        this.scrollType = scrollType;

        //add thumb
        let rect = new RUIScrollBarThumb(this);
        rect.position = RUIPosition.Offset;
        rect.left = 0;
        rect.width = RUIScrollBar.THUMB_SIZE;
        rect.height = 0;
        this.m_thumb = rect;
        this.addChild(rect);

    }


    public onMouseLeave(){
        this.m_onHover= false;
        if(this.scrollType == RUIScrollType.Enabled){
            var self = this;
            setTimeout(() => {
                self.doHide();
            }, 1000);
        }
    }

    public onMouseDown(e:RUIMouseEvent){
        let offset = e.mousey - this._caly;

        let thumb = this.m_thumb;
        if(offset < thumb.top){
            this.setBarPos(offset);
        }
        else{
            let pos = offset - thumb.height;
            this.setBarPos(pos);
        }
        this.setDirty();
    }

    public onLayout(){
        super.onLayout();
    }

    public onMouseEnter(){
        this.m_onHover = true;
        this.show();
    }

    private doHide(){
        if(!this.m_onHover){
            this.m_show = false;
            this.m_thumb.visible= false;
            this.m_thumb.setDirty();
            this.setDirty();
        }
    }

    public show(){

        if(this.m_show) return;
        if(this.scrollType == RUIScrollType.Enabled){

            this.m_show=true;
            this.m_thumb.visible= true;
            this.setDirty();

            var self = this;
            setTimeout(() => {
                self.doHide();
            }, 1000);
        }
    }

    public setBarSize(px:number){
        if(isNaN(px)) return;
        let thumb= this.m_thumb;
        if(thumb.height != px){
            this.m_thumbMaxSize = this._calheight - px;
            thumb.height = px;
            thumb.setDirty(true);
        }
    }

    public setBarPos(px:number){
        if(isNaN(px)) return;

        px = CLAMP(px,0,this.m_thumbMaxSize);
        let thumb = this.m_thumb;

      
        if(thumb.top != px){
            this.show();
            thumb.top = px;
            thumb.setDirty();
            this.setDirty();
        }
    }

    public setBarSizeVal(v:number){
        this.setBarSize(ROUND(v * this._calheight));
    }

    public setBarPosVal(v:number){
        this.setBarPos(ROUND(v * this._calheight));
    }

    public onDrawPre(cmd:RUICmdList){
        super.onDrawPre(cmd);

        let scrolltype = this.scrollType;
        if(scrolltype == RUIScrollType.Disabled) return;
        if(scrolltype == RUIScrollType.Always || this.m_show){
            cmd.DrawRectWithColor(this._rect,RUIStyle.Default.primary0);
            //draw thumb
        }
    }

    public onDrawPost(cmd:RUICmdList){
        super.onDrawPost(cmd);
    }
}