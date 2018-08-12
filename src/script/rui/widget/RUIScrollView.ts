import { RUIContainer } from "../RUIContainer";
import { RUIScrollType, RUIScrollBar } from "./RUIScrollBar";
import { RUIOrientation, RUIPosition, RUIObject, ROUND } from "../RUIObject";
import { RUIStyle } from "../RUIStyle";
import { RUI } from "../RUI";
import { RUIEvent } from "../RUIEvent";

// import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
// import { RUIPosition, RUIObject, RUIOrientation, RUIAuto, CLAMP, ROUND } from "../RUIObject";
// import { RUISlider } from "./RUISlider";
// import { RUIBind } from "../RUIBinder";
// import { RUIScrollBar } from "./RUIScrollBar";
// import { RUIWheelEvent } from "../RUIEvent";
// import { RUIStyle } from "../RUIStyle";



// export enum RUIScrollType{
//     Enabled,
//     Disabled,
//     Always
// }

// export class RUIScrollView extends RUIContainer{

//     private m_scrollVertical: RUIScrollType;
//     private m_scrollHorizontal :RUIScrollType;

//     private m_content: RUIContainer;

//     private m_scrollBarV: RUIScrollBar;
//     private m_scrollBarH :RUIScrollBar;

//     private m_maxscrollV :number = 0;
//     private m_maxscrollH :number = 0;

//     private m_offsetValV:number = 0;
//     private m_offsetValH:number = 0;

//     public wheelScroolPriority: RUIOrientation = RUIOrientation.Vertical;

//     public constructor(scrollVertical: RUIScrollType =RUIScrollType.Enabled,scrollHorizontal: RUIScrollType = RUIScrollType.Enabled){
//         super();

//         this.m_scrollHorizontal = scrollHorizontal;
//         this.m_scrollVertical = scrollVertical;
//         this.boxBorder = RUIStyle.Default.border0;

//         //add container
//         let content = new RUIContainer();
//         content.visible =true;
//         content.position = RUIPosition.Offset;
//         super.addChild(content);
//         this.m_content = content;

//         //add scrollbar
//         this.addScrollBar();
//     }

//     private addScrollBar(){

//         let hasVerticalBar = false;

//         let scrollVertical = this.m_scrollVertical;
//         if(scrollVertical != RUIScrollType.Disabled){
//             let slider = new RUIScrollBar(RUIOrientation.Vertical,scrollVertical);
//             slider.width = RUIScrollBar.BAR_SIZE;
//             slider.position = RUIPosition.Relative;
//             slider.right = 0;
//             slider.top = 0;
//             slider.bottom = 0;
//             this.m_scrollBarV = slider;
//             super.addChild(slider);

//             var self = this;
//             slider.EventOnScroll.on((val)=>{
//                 self.setContentScrollPosVal(null,val.object);
//             });

//             hasVerticalBar = true;
//         }

//         let scrollHorizontal = this.m_scrollHorizontal;
//         if(scrollHorizontal != RUIScrollType.Disabled){
//             let slider = new RUIScrollBar(RUIOrientation.Horizontal,scrollHorizontal);
//             slider.height = RUIScrollBar.BAR_SIZE;
//             slider.position = RUIPosition.Relative;
//             slider.left = 0;
//             slider.right = hasVerticalBar ? RUIScrollBar.BAR_SIZE : 0;
//             slider.bottom = 0;
//             this.m_scrollBarH = slider;
//             super.addChild(slider);

//             var self = this;
//             slider.EventOnScroll.on((val)=>{
//                 self.setContentScrollPosVal(val.object,null);
//             })
//         }

//     }

//     private setContentScrollPosVal(xval?:number,yval?:number){
//         this.setContentScrollPos(xval?(ROUND(-xval * this.m_content._calwidth)):null,yval?(-yval * this.m_content._calheight):null);
//     }

//     private setContentScrollPos(x?:number,y?:number){
//         let changed = false;
//         let content = this.m_content;
//         if(x != null){
//             let xpx = CLAMP(x,this.m_maxscrollH,0)
//             if(!isNaN(xpx) && xpx != content.left){
//                 content.left = xpx;
//                 changed = true;

//                 this.m_offsetValH = -xpx / content._calwidth;
//                 this.m_scrollBarH.setBarPosVal(this.m_offsetValH);
//             }

//         }
//         if(y != null){
//             let ypx = CLAMP(y,this.m_maxscrollV,0)
//             if(!isNaN(ypx) && ypx != content.top){
//                 content.top = ypx;
//                 changed= true;

//                 this.m_offsetValV = -ypx / content._calheight;
//                 this.m_scrollBarV.setBarPosVal(this.m_offsetValV);
//             }
//         }

//         if(changed){
//             this.setDirty();
//         }
//     }

//     public onLayoutPost(){


//         if(this.m_scrollVertical != RUIScrollType.Disabled){
//             let maxScrollV = this._calheight -  this.m_content._calheight;
//             if(maxScrollV >=0 ){
//                 this.m_scrollBarV.setEnable(false);
//             }
//             else{
//                 this.m_scrollBarV.setEnable(true);
//                 this.m_maxscrollV = maxScrollV;
//                 let val = this._calheight / this.m_content._calheight;
//                 this.m_scrollBarV.setBarSizeVal(val);
//             }
//         }

//         if(this.m_scrollHorizontal != RUIScrollType.Disabled){

//             let maxScrollH =  this._calwidth - this.m_content._calwidth;
//             if(maxScrollH >= 0){
//                 this.m_scrollBarH.setEnable(false);
//             }
//             else{
//                 this.m_scrollBarH.setEnable(true);
//                 this.m_maxscrollH = maxScrollH;
//                 let val =this._calwidth / this.m_content._calwidth;
//                 this.m_scrollBarH.setBarSizeVal(val);
//             }
//         }
//     }


//     public onMouseWheel(e:RUIWheelEvent){

//         let hasVertical = this.m_scrollVertical != RUIScrollType.Disabled;
//         let hasHorizontal = this.m_scrollHorizontal != RUIScrollType.Disabled;

//         let wheelVertical = true;
//         if(hasVertical){
//             if(hasHorizontal){
//                 wheelVertical = this.wheelScroolPriority == RUIOrientation.Vertical;
//             }
//         }
//         else{
//             if(hasHorizontal){
//                 wheelVertical = false;
//             }
//             else{
//                 return;
//             }
//         }



//         let delta = e.delta *0.5;
//         let content = this.m_content;
//         let newoffset = (wheelVertical ? content.top : content.left) - delta;

//         if(wheelVertical){
//             this.setContentScrollPos(null,newoffset);
//         }
//         else{
//             this.setContentScrollPos(newoffset,null);
//         }
//         e.Use();
//     }



//     public addChild(ui:RUIObject){

//         this.m_content.addChild(ui);
//     }

//     public removeChild(ui:RUIObject){
//         this.m_content.removeChild(ui);
//     }
// }


export class RUIScrollView extends RUIContainer {


    private m_scrolltypeH: RUIScrollType;
    private m_scrolltypeV: RUIScrollType;

    private m_scrollbarH: RUIScrollBar;
    private m_scrollbarV: RUIScrollBar;

    private m_content: RUIContainer;
    private m_contentvalH?: number;
    private m_contentvalV?: number;


    public constructor(scrollH: RUIScrollType = RUIScrollType.Enabled, scrollV: RUIScrollType = RUIScrollType.Enabled) {
        super();

        this.boxBorder = RUIStyle.Default.border0;
        this.padding = [1,11,11,1];

        let content = new RUIContainer();
        content.position = RUIPosition.Offset;
        super.addChild(content);
        this.m_content = content;


        this.scrollVertical = scrollV;
        this.scrollHorizontal = scrollH;
    }

    public set scrollVertical(type: RUIScrollType) {

        let bar = this.m_scrollbarV;
        if (bar == null) {
            bar = new RUIScrollBar(RUIOrientation.Vertical, type);
            bar.EventOnScroll.on(this.onBarScrollVertical.bind(this));
            bar.position = RUIPosition.Relative;
            bar.top = 0;
            bar.bottom = 0;
            bar.right = 0;
            super.addChild(bar);
            this.m_scrollbarV = bar;
        }
        this.m_scrolltypeV = type;
    }
    public get scrollVertical(): RUIScrollType {
        return this.m_scrolltypeV;
    }

    public set scrollHorizontal(type: RUIScrollType) {
        let bar = this.m_scrollbarH;
        if (bar == null) {
            bar = new RUIScrollBar(RUIOrientation.Horizontal, type);
            bar.EventOnScroll.on(this.onBarScrollHorizontal.bind(this));
            bar.position = RUIPosition.Relative;
            bar.left = 0;
            bar.right = this.m_scrolltypeV == RUIScrollType.Disabled ? 0 : RUIScrollBar.BAR_SIZE;
            bar.bottom = 0;
            super.addChild(bar);
            this.m_scrollbarH = bar;
        }
        this.m_scrolltypeH = type;
    }

    public get scrollHorizontal(): RUIScrollType {
        return this.m_scrolltypeH;
    }

    private onBarScrollVertical(e: RUIEvent<number>) {
        this.m_content.top = -ROUND(e.object * (this.m_content._calheight));
    }

    private onBarScrollHorizontal(e: RUIEvent<number>) {
        this.m_content.left = -ROUND(e.object * (this.m_content._calwidth));
    }

    //can be optimized by check isdirty
    public onLayoutPost() {
        let content = this.m_content;
        //Vertical
        let contenth = content._calheight;
        let contentvalV = 0;
        if(contenth > this._calheight){
            contentvalV = (this._calheight - 12) / contenth;
        }
        if (contentvalV != this.m_contentvalV) {
            this.m_contentvalV = contentvalV;
            if (this.m_scrolltypeV != RUIScrollType.Disabled) {
                this.m_scrollbarV.scrollSize = contentvalV;
            }
            this.FixHorizontalBarSize();
        }

        //Horizontal
        let contentw = content._calwidth;
        let contentvalH = 0;
        if(contentw > this._calwidth){
            contentvalH =(this._calheight - 12) / contenth;
        }

        if (contentvalH != this.m_contentvalH) {
            this.m_contentvalH = contentvalH;
            if (this.m_scrolltypeH != RUIScrollType.Disabled) {
                this.m_scrollbarH.scrollSize = contentvalH;
            }
        }
    }

    private FixHorizontalBarSize(){
        if(this.m_scrollbarV.enabled){
            this.m_scrollbarH.right = RUIScrollBar.BAR_SIZE;
        }
        else{
            this.m_scrollbarH.right = 0;
        }
    }

    public addChild(ui: RUIObject) {
        this.m_content.addChild(ui);
    }

    public removeChild(ui: RUIObject) {
        this.m_content.removeChild(ui);
    }

    public removeChildByIndex(index: number): RUIObject {
        return this.m_content.removeChildByIndex(index);
    }

    public hasChild(ui: RUIObject): boolean {
        return this.m_content.hasChild(ui);
    }

}