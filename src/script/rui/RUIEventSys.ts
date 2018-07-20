import { UIObject } from "./UIObject";



export class RUIEvent{
    public eventType:string;
    public target:UIObject;

    public isUsed:boolean = false;
    private _isPrevented: boolean = false;

    public constructor(tar:UIObject,type:string){
        this.target= tar;
        this.eventType = type;
    }

    public prevent(){
        this._isPrevented = true;
    }

    public Use(){
        this.isUsed = true;
    }

    public static readonly MOUSE_DOWN:string = "EvtMouseDown";
    public static readonly MOUSE_UP:string = "EvtMouseUp";
    public static readonly MOUSE_CLICK:string = "EvtMouseClick";
}

export class RUIMouseEvent extends RUIEvent{

    public mousex:number;
    public mousey:number;
    public constructor(tar:UIObject,type:string,x:number,y:number){
        super(tar,type);

        this.mousex = x;
        this.mousey = y;
    }
}

export type RUIEventFunc = (RUIEvent)=>void;


export class RUIEventEmitter{

    private m_listener:RUIEventFunc[] = [];

    public on(listener:RUIEventFunc){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0) return;
        l.push(listener);
    }


    public removeListener(listener:RUIEventFunc){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0){
            l.splice(index,1);
        }
    }

    public removeAllListener(){
        this.m_listener = [];
    }

    public emit(e:RUIEvent){
        let l = this.m_listener;
        let lc =l.length;
        for(var i=0;i<lc;i++){
            let li = l[i];
            li(e);
            if(e['_isPrevented']) return;
        }
    }
}