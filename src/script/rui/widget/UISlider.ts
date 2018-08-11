// import { UIObject } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";
// import { RUIStyle } from "../RUIStyle";
// import { RUIMouseEvent, RUIMouseDragEvent } from "../RUIEventSys";


// export class UISlider extends UIObject{

//     private static readonly OFFSET:number = 2;

//     private m_value:number = 0;

//     private m_onDrag:boolean = false;

//     public constructor(value:number){
//         super();
//         this.m_value = value <0 ? 0: (value >1.0? 1.0:value); 

//         this.height = 23;
//     }

//     public get value():number{
//         return this.m_value;
//     }

//     public onBuild(){
//         this.visibleSelf = true;
//     }

//     public onMouseClick(e:RUIMouseEvent){
//         let value = (e.mousex - this._calculateX) / this._width;
//         this.m_value = this.clampValue(value);

//         this.setDirty(true);
//         e.prevent();
//     }

//     public onMouseDrag(e:RUIMouseDragEvent){
        
//         let value = (e.mousex - this._calculateX) / this._width;
//         this.m_value = this.clampValue(value);
//         this.m_onDrag = !e.isDragEnd;
//         this.setDirty(true);
//         e.prevent();
//     }


//     private calculateValue(mouse:number) : number{
//         return (mouse - this._calculateX - UISlider.OFFSET) / (this._width - UISlider.OFFSET * 2);
//     }

//     private clampValue(value:number):number{
//         return  value <0 ? 0: (value >1.0? 1.0:value); 
//     }


//     public onDraw(cmd:RUIDrawCall){

//         let rect = [this._calculateX+UISlider.OFFSET,this._calculateY+UISlider.OFFSET,this._width-2* UISlider.OFFSET,this._height-2 * UISlider.OFFSET];

//         cmd.DrawRectWithColor(rect,RUIStyle.Default.background1);

//         let width = rect[2] * this.m_value;

//         let srect = [rect[0],rect[1],width,rect[3]];

//         cmd.DrawRectWithColor(srect,this.m_onDrag ? RUIStyle.Default.primary: RUIStyle.Default.inactive);
//     }


// }