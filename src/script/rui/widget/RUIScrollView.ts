import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIPosition, RUIObject, RUIOrientation, RUIAuto } from "../RUIObject";
import { RUISlider } from "./RUISlider";
import { RUIBind } from "../RUIBinder";
import { RUIScrollBar } from "./RUIScrollBar";


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

    }

    public onMouseEnter(){
        
    }
    

    private applyScrollBar(){
        let val =  this._calheight / this.m_content._calheight;
        this.m_scrollBarV.value = val;
    }

    public addChild(ui:RUIObject){

        this.m_content.addChild(ui);
    }

    public removeChild(ui:RUIObject){
        this.m_content.removeChild(ui);
    }
}