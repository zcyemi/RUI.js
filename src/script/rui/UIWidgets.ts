import { UIObject } from "./UIObject";
import { RUIEventEmitter } from "./RUIEventSys";


export class UIButton extends UIObject{

    public EvtMouseDown: RUIEventEmitter = new RUIEventEmitter();
    public EvtMouseUp: RUIEventEmitter;
    public EvtMouseClick:RUIEventEmitter;

    public onBuild(){
        this.visible = true;
        this.width = 100;
        this.height = 23;
    }
}

export class UIRect extends UIObject{
    public onBuild(){
        this.visible= true;
        this.width = 50;
        this.height = 50;
    }
}