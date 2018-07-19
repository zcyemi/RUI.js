import { UIObject } from "./UIObject";
import { RUICanvas } from "./RUICanvas";


export class RUIInput{

    private m_target : RUICanvas;

    public constructor(uicanvas:RUICanvas){

        this.m_target = uicanvas;

        this.RegisterEvent();
    }

    private RegisterEvent(){
        let c = this.m_target.canvas;

        c.addEventListener('mousedown',(e)=>{
            
        });
        c.addEventListener('mouseup',(e)=>{

        });
        c.addEventListener('mousemove',(e)=>{

        })
    }
}