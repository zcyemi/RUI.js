
export enum RUIMouseButton{
    Left = 0,
    Middle = 1,
    Right = 2
}

export enum RUIEventType{
    MouseDown,
    MouseUp,
    MouseClick,
    MouseEnter,
    MouseLeave,
    MouseDrag,
    MouseDrop,
    MouseMove,
    MouseWheel,
}

export class RUIEvent<T>{
    
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

export type RUIEventFunc<T> = (e:RUIEvent<T>)=>void; 

export class RUIEventEmitter<T>{

    private m_listener:RUIEventFunc<T>[] = [];

    public on(listener: RUIEventFunc<T>){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0) return;
        l.push(listener);
    }

    public removeListener(listener: RUIEventFunc<T>){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0){
            l.splice(index,1);
        }
    }

    public removeAllListener(){
        this.m_listener = [];
    }

    public emit(e:RUIEvent<T>){
        let l = this.m_listener;
        let lc =l.length;
        for(var i=0;i<lc;i++){
            let li = l[i];
            li(e);
            if(e['_isPrevented']) return;
        }
    }

    public emitRaw(e:T){
        this.emit(new RUIEvent<T>(e));
    }
}

export abstract class RUIObjEvent extends RUIEvent<RUIObjEvent>{

    public constructor(){
        super(null);
    }
}

export class RUIResizeEvent extends RUIEvent<RUIResizeEvent>{

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

    public raw:KeyboardEvent;
    public constructor(e: KeyboardEvent){
        super();
        this.object = this;
        this.raw = e;
    }
}

export class RUIMouseEvent extends RUIObjEvent{

    public m_eventtype : RUIEventType;
    public mousex: number;
    public mousey:number;
    private m_button:RUIMouseButton;
    public raw:MouseEvent;
    public constructor(e:MouseEvent,type:RUIEventType){
        super();
        this.raw = e;
        this.object = this;
        this.m_eventtype = type;
        this.mousex = e.offsetX;
        this.mousey = e.offsetY;
        this.m_button = <RUIMouseButton>(e.button);

    }
    public get type(): RUIEventType{
        return this.m_eventtype;
    }

    public get button():RUIMouseButton{
        return this.m_button;
    }
}


export enum RUIMouseDragStage{
    Begin,
    Update,
    End,
}

export class RUIMouseDragEvent extends RUIMouseEvent{
    /** false when drag end. */
    public stage:RUIMouseDragStage;
    public constructor(e:RUIMouseEvent,stage:RUIMouseDragStage){
        super(e.raw,RUIEventType.MouseDrag);
        this.stage = stage; 
    }
}

export class RUIWheelEvent extends RUIObjEvent{
    public delta: number;
    public constructor(e:WheelEvent){
        super();
        this.object = this;
        this.delta = e.deltaY;
    }
}