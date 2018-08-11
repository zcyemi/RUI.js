import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";

export class RUILabel extends RUIObject{

    public label:string;

    public constructor(label:string){
        super();
        this.label= label;
    }

    public onDraw(cmd:RUICmdList){
        let rect = this.calculateRect();
        this._rect = rect;
        this._rectclip = RUI.RectClip(rect,cmd.clipRect);

        let label = this.label;
        if(label == null || label === '')return;

        cmd.DrawText(this.label,rect);
    }
}