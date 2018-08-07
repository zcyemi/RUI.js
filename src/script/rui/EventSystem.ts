import { RUIButton, RUIEventType } from "./RUIInput";

export class REvent<T>{
    
    public object:T;

    public isUsed:boolean = false;
    private m_isPrevented: boolean = false;

    public constructor(object:T){
        this.object = object;
    }

    public prevent(){
        this.m_isPrevented = true;
    }

    public Use(){
        this.isUsed = true;
    }
}

export type REventFunc<T> = (e:REvent<T>)=>void; 


export class REventEmitter<T>{

    private m_listener:REventFunc<T>[] = [];

    public on(listener: REventFunc<T>){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0) return;
        l.push(listener);
    }

    public removeListener(listener: REventFunc<T>){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0){
            l.splice(index,1);
        }
    }

    public removeAllListener(){
        this.m_listener = [];
    }

    public emit(e:REvent<T>){
        let l = this.m_listener;
        let lc =l.length;
        for(var i=0;i<lc;i++){
            let li = l[i];
            li(e);
            if(e['_isPrevented']) return;
        }
    }

    public emitRaw(e:T){
        this.emit(new REvent<T>(e));
    }
}

export abstract class RUIObjEvent extends REvent<RUIObjEvent>{

    public constructor(){
        super(null);
    }
}

export class RUIResizeEvent extends REvent<RUIResizeEvent>{

    public width:number;
    public height:number;
    public constructor(w:number,h:number){
        super(null);
        this.object = this;

        this.width= w;
        this.height = h;
    }
}

export class RUIKeyboardEvent extends RUIObjEvent{

    private m_keyboardEvent: KeyboardEvent;
    public constructor(e: KeyboardEvent){
        super();
        this.object = this;
    }
}

export class RUIMouseEvent extends RUIObjEvent{

    public m_eventtype : RUIEventType;
    public mousex: number;
    public mousey:number;
    public constructor(e:MouseEvent,type:RUIEventType){
        super();
        this.object = this;

        this.object,this.m_eventtype = type;
        this.mousex = e.offsetX;
        this.mousey = e.offsetY;

    }
    public get type(): RUIEventType{
        return this.m_eventtype;
    }
}