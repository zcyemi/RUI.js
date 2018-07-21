import { UIObject } from "./UIObject";
import { RUIEventEmitter, RUIMouseEvent, RUIEvent } from "./RUIEventSys";
import { RUICursorType } from "./RUICursor";


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
}

export class UIRect extends UIObject{
    public onBuild(){
        this.visible= true;
        this.width = 50;
        this.height = 50;
    }
}