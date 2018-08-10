import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIPosition, RUIObject, RUIOrientation, RUIAuto, CLAMP, ROUND } from "../RUIObject";
import { RUISlider } from "./RUISlider";
import { RUIBind } from "../RUIBinder";
import { RUIScrollBar } from "./RUIScrollBar";
import { RUIWheelEvent } from "../EventSystem";



export enum RUIScrollType{
    Enabled,
    Disabled,
    Always
}

export class RUIScrollView extends RUIContainer{

    public scrollVertical: RUIScrollType;
    public scrollHorizontal :RUIScrollType;

    private m_content: RUIContainer;

    private m_scrollBarV: RUIScrollBar;

    private m_maxscrollV :number = 0;
    private m_maxscrollH :number = 0;

    private m_offsetValV:number = 0;

    public constructor(scrollVertical: RUIScrollType =RUIScrollType.Enabled,scrollHorizontal: RUIScrollType = RUIScrollType.Enabled){
        super();

        this.scrollHorizontal = scrollHorizontal;
        this.scrollVertical = scrollVertical;

        let content = new RUIContainer();
        content.position = RUIPosition.Offset;
        super.addChild(content);
        this.m_content = content;
        this.processScrollBar();
    }

    private processScrollBar(){

        let slider = new RUIScrollBar(RUIOrientation.Vertical,this.scrollVertical);
        slider.width = 15;
        slider.position = RUIPosition.Relative;
        slider.right = 0;
        slider.top = 0;
        slider.bottom = 0;
        this.m_scrollBarV = slider;
        super.addChild(slider);

        
    }

    public onLayoutPost(){

        this.m_maxscrollV = this._calheight -  this.m_content._calheight;
        let val = this._calheight / this.m_content._calheight;
        this.m_scrollBarV.setBarSizeVal(val);
    }


    public onMouseWheel(e:RUIWheelEvent){

        let delta = e.delta *0.5;
        let curTop = this.m_content.top;
        let newTop = ROUND(CLAMP(curTop - delta,this.m_maxscrollV,0));
        if(newTop != curTop && !isNaN(newTop)){

            this.m_offsetValV = -newTop / this.m_content._calheight;
            this.m_content.top = newTop;
            this.m_content.setDirty(true);
            e.Use();

            this.applyScrollBar();
        }
    }



    private applyScrollBar(){
        this.m_scrollBarV.setBarPosVal(this.m_offsetValV);
        
    }

    public addChild(ui:RUIObject){

        this.m_content.addChild(ui);
    }

    public removeChild(ui:RUIObject){
        this.m_content.removeChild(ui);
    }
}