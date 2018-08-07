import { RUIObject } from "./RUIObject";
import { RUIObjEvent, RUIKeyboardEvent, RUIMouseEvent } from "./EventSystem";
import { RUIContainer } from "./RUIContainer";
import { RUIEventType } from "./RUIInput";

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = false;

    public expandSize: boolean = false;

    private m_activeUI:RUIObject;

    private m_hoverUI: RUIObject[] = [];

    public constructor(ui:RUIObject,expandSize:boolean = false){
        if(ui.parent != null) throw new Error("root ui must have no parent.");

        this.expandSize = expandSize;
        this.root = ui;
        ui._root = this;
    }

    public resizeRoot(width:number,height:number){
        this.isdirty =true;
        
        if(this.expandSize){
            this.root.width = width;
            this.root.height = height;
        }
        
    }

    public dispatchEvent(event:RUIObjEvent){

        let target = event.object;
        if(event instanceof RUIKeyboardEvent){

        }
        else if(event instanceof RUIMouseEvent){
            this.dispatchMouseEvent(event);   
        }
        
    }

    private dispatchMouseEvent(e: RUIMouseEvent){
        let etype = e.type;
        if(etype == RUIEventType.MouseMove){
            this.dispatchMouseMove(e.mousex,e.mousey);
        }
        else{
            let newActiveUI = this.traversalNormal(e.mousex,e.mousey);
            if(newActiveUI != null){
                switch(etype){
                    case RUIEventType.MouseDown:
                    newActiveUI.onMouseDown(e);
                    break;
                    case RUIEventType.MouseUp:
                    newActiveUI.onMouseUp(e);
                    break;
                }
            }

            let curActiveUI = this.m_activeUI;
            if(curActiveUI != null){
                curActiveUI.onInactive();
            }
            if(newActiveUI != null){
                newActiveUI.onActive();
                this.m_activeUI = newActiveUI;
            }
            
        }
    }


    private dispatchMouseMove(x:number,y:number){
        let newList = this.traversalAll(x,y);
        let curList = this.m_hoverUI;

        for(var i= curList.length-1;i>=0;i--){
            let c = curList[i];
            if(newList.indexOf(c) ==-1){
                c.onMouseLeave();
                curList.splice(i,1);
            }
        }
        
        for(var i=0,len = newList.length;i<len;i++){
            let c = newList[i];
            if(curList.indexOf(c)>=0) continue;
            c.onMouseEnter();
            curList.push(c);
        }
    }

    private traversalAll(x:number,y:number):RUIObject[]{
        var list:RUIObject[] = [];

        let f = (ui:RUIObject)=>{
            if(ui.rectContains(x,y)){
                list.push(ui);
            }
        }

        let root = this.root;
        if(root instanceof RUIContainer){
            root.traversal(f);
        }
        else{
            f(root);
        }
        return list;
    }

    private traversalNormal(x:number,y:number):RUIObject{
        var target:RUIObject = null;

        let f = (ui:RUIObject)=>{
            if(ui.rectContains(x,y)){
                if(target == null) {
                    target = ui;
                }
                else{
                    if(ui._level >= target._level) target = ui;
                }
            }
        };

        let root = this.root;
        if(root instanceof RUIContainer){
            root.traversal(f);
        }
        else{
            f(root);
        }

        
        return target;
    }

}
