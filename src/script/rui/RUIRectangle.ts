import { RUIObject } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { UIUtil } from "./UIUtil";

export class RUIRectangle extends RUIObject{


    public onDraw(cmd:RUICmdList){

        let noclip = !this.isClip;

        if(noclip) cmd.PushClipRect();
        
        let rect = [this._calx,this._caly,this._calwidth,this._calheight];
        cmd.DrawRectWithColor(rect,UIUtil.RandomColor());

        if(noclip) cmd.PopClipRect();
    }
}