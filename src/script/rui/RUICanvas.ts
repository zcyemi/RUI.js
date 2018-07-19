import { RUIDrawCall } from "./RUIDrawCall";
import { UIObject } from "./UIObject"
import { WGLContext } from "../gl/wglctx";
import { DebugUI } from "./DebugUI";

export class RUICanvas{
    private m_canvas : HTMLCanvasElement;
    private m_drawcall: RUIDrawCall;
    private m_gl: WGLContext;

    private m_rootUI: UIObject;

    private m_valid :boolean = false;
    
    constructor(canvas:HTMLCanvasElement,UIClass?:any){
        this.m_canvas =canvas;
        this.m_gl = WGLContext.InitWidthCanvas(canvas);

        this.m_drawcall = new RUIDrawCall();
        this.m_rootUI = new DebugUI();

        if(this.m_gl){
            this.m_valid = true;
        }

        this.OnBuild();
    }

    public OnBuild(){
        this.m_rootUI._dispatchOnBuild();
        this.m_drawcall.Rebuild(this.m_rootUI);

        console.log(this.m_rootUI);
    }

    public OnFrame(ts:number){
        if(this.m_rootUI.isDirty){
            this.m_drawcall.Rebuild(this.m_rootUI);
        }

        this.OnRender();
    }

    public OnRender(){
        if(this.m_gl) this.m_gl.Draw(this.m_drawcall);
    }


}