import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { UIUtil } from "../UIUtil";

// import { UIObject } from "../UIObject";
// import { RUIDrawCall } from "../RUIDrawCall";


// export class UILable  extends UIObject{

//     private m_label :string;
//     public constructor(label:string){
//         super();
//         this.m_label = label;
//     }

//     public onBuild(){
//         this.visibleSelf = true;
//     }

//     public onDraw(cmd:RUIDrawCall){
//         let rect = [this._calculateX,this._calculateY,this._width,this._height];
//         let l = this.m_label;
//         if(l != null && l != ''){
//             cmd.DrawText(l,rect);
//         }
//     }
// }

export class RUILabel extends RUIObject{

    public label:string;
    public constructor(label:string){
        super();
        this.label= label;
    }

    public onDraw(cmd:RUICmdList){
        let rect = [this._calx,this._caly,this._calwidth,this._calheight];

        this._rect = rect;

        cmd.DrawText(this.label,rect);
    }
}