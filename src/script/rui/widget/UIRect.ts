import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";

export class UIRect extends UIObject{

    public onBuild(){
        this.visibleSelf= true;
    }
    public onDraw(drawcall:RUIDrawCall) {
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
    }
}