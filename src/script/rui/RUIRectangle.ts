import { RUIObject } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { UIUtil } from "./UIUtil";

export class RUIRectangle extends RUIObject{

    private m_debugColor : number[] = UIUtil.RandomColor();

    public onLayout(){
        this.m_debugColor = UIUtil.RandomColor();
        super.onLayout();
    }

    public onDraw(cmd:RUICmdList){

        let noclip = !this.isClip;

        if(noclip) cmd.PushClipRect();
        
        let rect = [this._calx,this._caly,this._calwidth,this._calheight];
        cmd.DrawRectWithColor(rect,this.m_debugColor);

        if(noclip) cmd.PopClipRect();
    }
}