import { UIObject } from "./UIObject";
import { RUIEventEmitter, RUIMouseEvent, RUIEvent } from "./RUIEventSys";
import { RUICursorType } from "./RUICursor";
import { RUIDrawCall } from "./RUIDrawCall";
import { RUIStyle } from "./RUIStyle";


export class UIButton extends UIObject{

    public EvtMouseDown: RUIEventEmitter = new RUIEventEmitter();
    public EvtMouseUp: RUIEventEmitter;
    public EvtMouseClick:RUIEventEmitter = new RUIEventEmitter();

    public label:string;

    public constructor(label:string){
        super();
        this.label =label;
    }

    public onBuild(){
        this.visible = true;
        this.width = 100;
        this.height = 23;

        this.color = RUIStyle.Default.background1;
    }

    public onMouseEnter(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.pointer);
        this.color = RUIStyle.Default.background2;
        this.setDirty(true);
    }

    public onMouseLeave(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.default);
        this.color = RUIStyle.Default.background1;
        this.setDirty(true);
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
    }
    public onDraw(drawcall:RUIDrawCall) {
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
    }
}