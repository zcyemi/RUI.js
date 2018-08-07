import { RUIObject } from "./RUIObject";
import { RUIObjEvent, RUIKeyboardEvent, RUIMouseEvent } from "./EventSystem";
import { RUIContainer } from "./RUIContainer";
import { RUIEventType } from "./RUIInput";

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = false;

    public expandSize: boolean = false;

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
        }
        else{
            let target = this.traversalNormal(e.mousex,e.mousey);
            if(target == null) return;

            switch(etype){
                case RUIEventType.MouseDown:
                target.onMouseDown(e);
                break;
                case RUIEventType.MouseUp:
                target.onMouseUp(e);
                break;
            }
        }
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
