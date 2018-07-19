import { UIObject } from "./UIObject";


export class RUIEvent{
    public eventType:string;
    public target:UIObject;

    public isUsed:boolean = false;
    private _isPrevented: boolean = false;
    public prevent(){
        this._isPrevented = true;
    }

    public Use(){
        this.isUsed = true;
    }
}



export class RUIEventEmitter{

    private m_listener:((e:RUIEvent)=>void)[] = [];

    public on(listener:(e:RUIEvent)=>void){
        let l = this.m_listener;

        let index = l.indexOf(listener);
        if(index >=0) return;
        l.push(listener);
    }


    public removeListener(listener:(e:RUIEvent)=>void){
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