import { RUIObject, RUIRect } from "./RUIObject";
import { RUIObjEvent, RUIKeyboardEvent, RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage, RUIWheelEvent } from "./RUIEvent";
import { RUIContainer } from "./RUIContainer";
import { RUIEventType } from "./RUIInput";

export class RUIRoot {

    public root: RUIObject;

    public isdirty: boolean = true;

    public expandSize: boolean = false;

    private m_onMouseDown:boolean = false;
    private m_activeUI: RUIObject;
    private m_activeUIonDrag:boolean = false;
    private m_hoverUI: RUIObject[] = [];

    private m_rootSizeWidth:number;
    private m_rootSizeHeight:number;

    private m_rootRect:RUIRect;

    public constructor(ui: RUIObject, expandSize: boolean = false) {
        if (ui.parent != null) throw new Error("root ui must have no parent.");

        this.expandSize = expandSize;
        this.root = ui;
        if(ui instanceof RUIContainer){
            ui.setRoot(this);
        }
        else{
            ui._root = this;
        }
    }

    public get rootRect():RUIRect{
        return this.m_rootRect;
    }

    public resizeRoot(width: number, height: number) {

        if(this.m_rootSizeWidth == width && this.m_rootSizeHeight == height) return; 

        this.isdirty = true;

        if (this.expandSize) {
            let rootui =this.root;
            let uiwidth = rootui.width;
            if(uiwidth != width)  rootui.width = width;
            let uiheight = rootui.height;
            if(uiheight != height) rootui.height= height;
        }

        this.m_rootSizeWidth = width;
        this.m_rootSizeHeight = height;

        this.m_rootRect = [0,0,width,height];

    }

    public dispatchEvent(event: RUIObjEvent) {

        let target = event.object;
        if (event instanceof RUIKeyboardEvent) {

        }
        else if(event instanceof RUIWheelEvent){
            let hoverUI = this.m_hoverUI;

            let wheele = <RUIWheelEvent>event;
            for(var i=0,clen = hoverUI.length;i< clen;i++){
                let c = hoverUI[i];
                if(c instanceof RUIContainer){
                    c.onMouseWheel(wheele);
                    if(wheele.isUsed) break;
                }
            }
        }
        else if (event instanceof RUIMouseEvent) {
            this.dispatchMouseEvent(event);
        }

    }

    private dispatchMouseEvent(e: RUIMouseEvent) {
        let etype = e.type;
        if (etype == RUIEventType.MouseMove) {
            this.dispatchMouseMove(e.mousex, e.mousey);

            if(this.m_onMouseDown && this.m_activeUI !=null){
                //drag move
                if(!this.m_activeUIonDrag){
                    this.m_activeUIonDrag = true;
                    this.m_activeUI.onMouseDrag(new RUIMouseDragEvent(e,RUIMouseDragStage.Begin));
                }
                else{
                    this.m_activeUI.onMouseDrag(new RUIMouseDragEvent(e,RUIMouseDragStage.Update));
                }
                
            }
        }else {
            let newActiveUI = this.traversalNormal(e.mousex, e.mousey);
            let curActiveUI = this.m_activeUI;
            switch (etype) {
                case RUIEventType.MouseDown:
                    {
                        this.m_onMouseDown = true;
                        if(curActiveUI != null && curActiveUI != newActiveUI){
                            curActiveUI.onInactive();
                        }
                        if (newActiveUI != null){
                            newActiveUI.onMouseDown(e);
                            if(newActiveUI != curActiveUI) newActiveUI.onActive();
                            
                        }
                        this.m_activeUI = newActiveUI;

                        
                    }
                    break;
                case RUIEventType.MouseUp:
                    {
                        this.m_onMouseDown = false;
                        if(newActiveUI != null) {
                            newActiveUI.onMouseUp(e);
                            if(newActiveUI == curActiveUI){
                                newActiveUI.onMouseClick(e);
                            }
                        }

                        if(curActiveUI != null && this.m_activeUIonDrag){
                            curActiveUI.onMouseDrag(new RUIMouseDragEvent(e,RUIMouseDragStage.End));
                        }

                        this.m_activeUIonDrag = false;
                    }
                    break;
            }


        }
    }


    private dispatchMouseMove(x: number, y: number) {
        let newList = this.traversalAll(x, y);
        let curList = this.m_hoverUI;

        for (var i = curList.length - 1; i >= 0; i--) {
            let c = curList[i];
            if (newList.indexOf(c) == -1) {
                c.onMouseLeave();
                curList.splice(i, 1);
            }
        }

        for (var i = 0, len = newList.length; i < len; i++) {
            let c = newList[i];
            if (curList.indexOf(c) >= 0) continue;
            c.onMouseEnter();
            curList.push(c);
        }
    }

    private traversalAll(x: number, y: number): RUIObject[] {
        var list: RUIObject[] = [];

        let f = (ui: RUIObject) => {
            if (ui.rectContains(x, y)) {
                list.push(ui);
            }
        }

        let root = this.root;
        if (root instanceof RUIContainer) {
            root.traversal(f);
        }
        else {
            f(root);
        }
        return list;
    }

    private traversalNormal(x: number, y: number): RUIObject {
        var target: RUIObject = null;

        let f = (ui: RUIObject) => {
            if (ui.rectContains(x, y)) {
                if (target == null) {
                    target = ui;
                }
                else {
                    if (ui._level >= target._level) target = ui;
                }
            }
        };

        let root = this.root;
        if (root instanceof RUIContainer) {
            root.traversal(f);
        }
        else {
            f(root);
        }


        return target;
    }

}
