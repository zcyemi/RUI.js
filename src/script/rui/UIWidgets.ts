import { UIObject } from "./UIObject";
import { RUIEventEmitter, RUIMouseEvent, RUIEvent } from "./RUIEventSys";
import { RUICursorType } from "./RUICursor";
import { RUIDrawCall } from "./RUIDrawCall";


export class UIButton extends UIObject{

    public EvtMouseDown: RUIEventEmitter = new RUIEventEmitter();
    public EvtMouseUp: RUIEventEmitter;
    public EvtMouseClick:RUIEventEmitter = new RUIEventEmitter();

    public onBuild(){
        this.visible = true;
        this.width = 100;
        this.height = 23;
    }

    public onMouseEnter(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.pointer);
    }

    public onMouseLeave(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.default);
    }

    public onMouseClick(e:RUIMouseEvent){
        this.EvtMouseClick.emit(e);
    }

    public onDraw(drawcall:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
        drawcall.DrawText('Button1',rect,null);
    }
}

export class UIRect extends UIObject{

    public onBuild(){
        this.visible= true;
        this.width = 50;
        this.height = 50;
    }
    public onDraw(drawcall:RUIDrawCall) {
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
    }
}