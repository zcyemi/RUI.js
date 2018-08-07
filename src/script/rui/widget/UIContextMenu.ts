// import { UIObject, UIDisplayMode, UIPosition } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIStyle } from "../RUIStyle";
// import { UIButton } from "./UIButton";


// type UIMenuItemFunc = ()=>void;
// type UIMenuItemList = {[key:string]:UIMenuItemFunc};

// export class UIContextMenu extends UIObject{
    
//     private m_isshow:boolean =false;
//     private m_attatchUI:UIObject;

//     public constructor(items?:UIMenuItemList){
//         super();

//         if(items) this.setMenuItems(items);
//     }

//     public onBuild(){
//         this.visibleSelf =false;
//         this.position = UIPosition.Absolute;
//         this.floatLeft = 0;
//         this.floatTop = 0;
//         this.zorder = RUIDrawCall.LAYER_OVERLAY;

//         this.displayMode= UIDisplayMode.None;
//     }

//     public onActive(){
//     }

//     public onInactive(){
//         this.m_isshow =false;
//         this.visibleSelf =false;
//         this.displayMode = UIDisplayMode.None;
//         this.setDirty(true);
//     }

//     public setMenuItems(items:UIMenuItemList){
//         this.children = [];
//         for (const key in items) {
//             if (items.hasOwnProperty(key)) {
//                 const item = items[key];

//                 let btn = new UIButton(key);
//                 if(item != null)
//                     btn.EvtMouseClick.on((f)=>item());
//                 this.addChild(btn);
//             }
//         }

//         this.setDirty(true);
//     }

//     public show(e:UIObject){
//         this.m_isshow = true;
//         this.m_attatchUI = e;
//         this.floatLeft = e._calculateX;
//         this.floatTop = e._calculateY+ e._height;


//         this.visibleSelf =true;
//         this.displayMode = UIDisplayMode.Default;
//         //this._canvas.setActiveUI(this);

//         this.setDirty(true);
//     }



//     public onDraw(cmd:RUIDrawCall){
//         if(this.m_isshow){
//             let attui = this.m_attatchUI;
//             let rect = [this._calculateX,this._calculateY,this._width,this._height];
//             cmd.DrawBorder(rect,RUIStyle.Default.primary0);
//         }
//     }
// }