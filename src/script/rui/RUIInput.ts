import { UIObject } from "./UIObject";
import { RUICanvas } from "./RUICanvas";
import { RUIEvent, RUIMouseEvent } from "./RUIEventSys";


export class RUIInput{

    private m_target : RUICanvas;

    private m_activeMouseUI: UIObject = null;

    public constructor(uicanvas:RUICanvas){

        this.m_target = uicanvas;

        this.RegisterEvent();
    }

    private RegisterEvent(){
        let c = this.m_target.canvas;

        c.addEventListener('mousedown',(e)=>{
            let tar = this.m_target;
            this.m_activeMouseUI = tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_DOWN);
        });
        c.addEventListener('mouseup',(e)=>{
            let tar = this.m_target;
            let tarui = tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_UP);
            
            if(tarui && tarui == this.m_activeMouseUI){
                tarui.onMouseClick(new RUIMouseEvent(tarui,RUIEvent.MOUSE_CLICK,e.offsetX,e.offsetY));
            }
        });
        c.addEventListener('mousemove',(e)=>{
            this.m_target.qtree.DispatchEvtMouseMove(e.offsetX,e.offsetY);
        })
    }
}