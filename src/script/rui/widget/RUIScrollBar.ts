import { RUISlider } from "./RUISlider";
import { RUIOrientation, RUIPosition, RUIObject } from "../RUIObject";
import { RUIScrollType } from "./RUIScrollView";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { RUIContainer } from "../RUIContainer";
import { RUIRectangle } from "../RUIRectangle";


export class RUIScrollBar extends RUIContainer{

    public scrollType: RUIScrollType;
    private m_show : boolean= false;
    private m_onHover:boolean = false;
    private m_offset: number = 0;
    private m_value:number = 0;

    private m_thumb: RUIObject;


    public constructor(orientation: RUIOrientation,scrollType: RUIScrollType){
        super();
        this.boxOrientation = orientation;
        this.scrollType = scrollType;

        //add thumb
        let rect = RUIRectangle.create(RUIStyle.Default.primary);
        rect.position = RUIPosition.Offset;
        rect.left = 1;
        rect.width = 13;
        rect.height = 0;
        this.m_thumb = rect;
        this.addChild(rect);

    }

    public get value(){
        return this.m_value;
    }
    public set value(val:number){
        
        // this.m_value = val;
        // let h = val * this._calheight;
        // this.m_thumb.height = h;

        // this.m_thumb.setDirty(true);
    }

    public onMouseLeave(){
        console.log('leave');
        this.m_onHover= false;
        if(this.scrollType == RUIScrollType.Enabled){
            var self = this;
            setTimeout(() => {
                self.doHide();
            }, 1000);
        }
    }

    public onLayout(){
        super.onLayout();
    }

    public onMouseEnter(){
        this.m_onHover = true;
        this.m_show = true;
        this.setDirty();
    }

    private doHide(){
        if(!this.m_onHover){
            this.m_show = false;
            this.setDirty();
        }
    }

    public show(){
        if(this.scrollType == RUIScrollType.Enabled){
            var self = this;
            setTimeout(() => {
                self.doHide();
            }, 1000);
        }
    }

    public setOffset(offset:number){
        this.m_offset = offset;
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

        console.log(this);
    }
}