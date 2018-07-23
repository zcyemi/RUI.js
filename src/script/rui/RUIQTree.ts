import { UIObject } from "./UIObject";
import { RUIEventEmitter, RUIEvent, RUIMouseEvent } from "./RUIEventSys";
import { RUICanvas } from "./RUICanvas";



if(Array.prototype['includes'] == null){
    Array.prototype['includes'] = function(o){
        if(o==null) return false; 
        let index= this.indexOf(o);
        if(index < 0) return false;
        return true;
    }
}


export class RUIQTree{

    private m_ui :UIObject;
    private m_tar:RUICanvas;
    constructor(canvas:RUICanvas){
        this.m_tar = canvas;
        this.m_ui = canvas.rootui;
    }


    public DispatchEvtMouseEvent(x:number,y:number,type:string): UIObject{
        let target = this.TraversalTree(x,y);
        if(target == null) return null;
        
        let f = target[type];


        if(f) f(new RUIMouseEvent(target,type,x,y));

        // let d = target[type];
        // if(d){
        //     (<RUIEventEmitter>d).emit(new RUIMouseEvent(target,type,x,y));
        // }
        return target;
    }


    private m_listHovered: UIObject[] = [];
    public DispatchEvtMouseMove(x:number,y:number){
        let curlist = this.TraversalNormalAll(x,y);
        let hovlist= this.m_listHovered;


        for(var i=hovlist.length-1;i>=0;i--){
            let c= hovlist[i];
            if(curlist.indexOf(c) == -1){
                c.onMouseLeave(new RUIEvent(c,RUIEvent.MOUSE_LEAVE,this.m_tar));
                hovlist.splice(i,1);
            }
        }

        for(var i=0,len = curlist.length;i<len;i++){
            let c = curlist[i];
            if(hovlist.indexOf(c)>=0) continue;
            c.onMouseEnter(new RUIEvent(c,RUIEvent.MOUSE_ENTER,this.m_tar));
            hovlist.push(c);
        }
    }



    public TraversalTree(x:number,y:number) : UIObject{
        return this.TraversalNoraml(x,y);
    }

    private TraversalNormalAll(x:number,y:number):UIObject[]{
        var list:UIObject[] = [];

        this.m_ui.execRecursive((ui)=>{
            if(ui.rectContains(x,y)){
                list.push(ui);
            }
        })

        return list;

    }

    private TraversalNoraml(x:number,y:number):UIObject{
        var tarNode: UIObject = null;
        this.m_ui.execRecursive((ui)=>{
            if(ui.rectContains(x,y)){
                if(tarNode == null){
                    tarNode = ui;
                }
                else{
                    if(ui._level >= tarNode._level) tarNode = ui;
                }
            }
        });

        return tarNode;
    }

    private TraversalQuadTree(x:number,y:number):UIObject{
        throw new Error('not implemented.');
    }
}