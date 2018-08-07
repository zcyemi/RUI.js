import { RUIObject, RUIAuto } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { UIUtil } from "./UIUtil";
import { RUIStyle } from "./RUIStyle";

export class RUIRectangle extends RUIObject{

    private m_debugColor : number[] = UIUtil.RandomColor();

    public onLayout(){
        //this.m_debugColor = UIUtil.RandomColor();
        super.onLayout();
    }

    public onDraw(cmd:RUICmdList){

        let noclip = !this.isClip;

        if(noclip) cmd.PushClipRect();
        
        let rect = [this._calx,this._caly,this._calwidth,this._calheight];
        this._rect = rect;
        cmd.DrawRectWithColor(rect,this.m_debugColor);

        if(noclip) cmd.PopClipRect();
    }

    public onMouseUp(){
        this.m_debugColor = UIUtil.RandomColor();
        this.setDirty();
    }

    public onMouseDown(){
        this.m_debugColor = RUIStyle.Default.primary;
        this.setDirty();
    }


}