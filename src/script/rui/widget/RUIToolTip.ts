import { RUIRectangle } from "../RUIRectangle";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";


export class RUIToolTip extends RUIRectangle{

    private m_onHover:boolean =false;

    public constructor(){
        super(10,10);
    }

    public onMouseEnter(){
        this.m_onHover =true;
        this.setDirty();
    }

    public onMouseLeave(){
        this.m_onHover = false;
        this.setDirty();
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);

        let cliprect= this._drawClipRect;
        if(cliprect == null) return;

        if(this.m_onHover)
        {
            let rect = this._rect.slice(0);
            rect[1]-= 20;
            cmd.DrawRectWithColor(rect,RUI.RED,null,500);
        }
    }
}