import { RUIDrawCall } from "./RUIDrawCall";
import { UIObject } from "./UIObject"
import { TestUI } from "../testui";
import { WGLRender } from "../gl/wglrender";
import { UIBuilder } from "./UIBuilder";

export class RUICanvas{

    private m_canvas : HTMLCanvasElement;
    private m_drawcall: RUIDrawCall;
    private m_gl: WGLRender;

    private m_rootUI: UIObject;

    private m_valid :boolean = false;
    
    constructor(canvas:HTMLCanvasElement,UIClass?:any){
        console.log('create rui canvas');

        this.m_canvas =canvas;
        this.m_gl = WGLRender.InitWidthCanvas(canvas);

        this.m_drawcall = new RUIDrawCall();
        this.m_rootUI = new TestUI();

        if(this.m_gl){
            this.m_valid = true;
        }

        this.OnBuild();
    }

    public OnBuild(){
        this.m_rootUI.onBuild(new UIBuilder(this.m_rootUI));
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