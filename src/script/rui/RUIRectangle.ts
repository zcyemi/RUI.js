import { RUIObject, RUIAuto } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { UIUtil } from "./UIUtil";
import { RUIStyle } from "./RUIStyle";
import { RUIMouseEvent, RUIMouseDragEvent } from "./EventSystem";

export class RUIRectangle extends RUIObject{

    protected m_debugColor : number[] = UIUtil.RandomColor();


    public static create(color:number[]):RUIRectangle{
        let rect= new RUIRectangle();
        rect.m_debugColor = color;
        return rect;
    }

    public onLayout(){
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
        //console.log('mouseup');
    }

    public onMouseDown(){
        //console.log('mousedown');
    }

    public onActive(){
        //console.log('onactive');
    }

    public onInactive(){
        //console.log('inactive');
    }

    public onMouseEnter(){
        //console.log('enter');
    }

    public onMouseLeave(){
        //console.log('leave');
    }

    public onMouseClick(e:RUIMouseEvent){
        //console.log('click');
    }

    public onMouseDrag(e:RUIMouseDragEvent){
        //console.log('ondrag:' + e.ondrag);
    }

}