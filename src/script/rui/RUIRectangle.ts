import { RUIObject, RUIAuto } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { RUIStyle } from "./RUIStyle";
import { RUIMouseEvent, RUIMouseDragEvent } from "./RUIEvent";
import { RUI } from "./RUI";
import { RUIContainerClipType } from "./RUIContainer";

export class RUIRectangle extends RUIObject{

    protected m_debugColor : number[] = RUI.RandomColor();


    public constructor(w:number = RUIAuto,h:number = RUIAuto){
        super();

        this.width= w;
        this.height =h;
    }

    public static create(color:number[]):RUIRectangle{
        let rect= new RUIRectangle();
        rect.m_debugColor = color;
        return rect;
    }


    public onDraw(cmd:RUICmdList){

        let noclip = !this.isClip;

        let rect = this.calculateRect();
        if(noclip) {
            cmd.PushClip(rect,null, RUIContainerClipType.NoClip);
        }
        else{
            if(cmd.isSkipDraw) return;
        }


        let cr = RUI.RectClip(rect,cmd.clipRect);
        this._rectclip = cr;
        this._rect = cr;

        // if(this._debugname == 'x'){
        //     console.log('>x ' + cr +'- '+ cmd.clipRect);
        // }

        if(cr != null)
            cmd.DrawRectWithColor(cr,this.m_debugColor);

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