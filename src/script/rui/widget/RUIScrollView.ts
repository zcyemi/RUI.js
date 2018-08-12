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