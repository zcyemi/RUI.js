import { UIObject } from "./UIObject";
import { RUICanvas } from "./RUICanvas";
import { RUIEvent } from "./RUIEventSys";


export class RUIInput{

    private m_target : RUICanvas;

    public constructor(uicanvas:RUICanvas){

        this.m_target = uicanvas;

        this.RegisterEvent();
    }

    private RegisterEvent(){
        let c = this.m_target.canvas;

        c.addEventListener('mousedown',(e)=>{
            let tar = this.m_target;
            tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_DOWN);
        });
        c.addEventListener('mouseup',(e)=>{
            let tar = this.m_target;
            tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_UP);
        });
        c.addEventListener('mousemove',(e)=>{
            
        })
    }
}