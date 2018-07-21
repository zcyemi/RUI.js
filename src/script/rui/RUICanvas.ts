import { RUIDrawCall } from "./RUIDrawCall";
import { UIObject } from "./UIObject"
import { WGLContext } from "../gl/wglctx";
import { DebugUI } from "./DebugUI";
import { RUIInput } from "./RUIInput";
import { RUIQTree } from "./RUIQTree";
import { RUICursor } from "./RUICursor";

export class RUICanvas{
    private m_canvas : HTMLCanvasElement;
    private m_drawcall: RUIDrawCall;
    private m_gl: WGLContext;

    private m_rootUI: UIObject;
    private m_input : RUIInput;
    private m_qtree: RUIQTree;

    private m_cursor:RUICursor;

    private m_valid :boolean = false;
    
    
    constructor(canvas:HTMLCanvasElement,UIClass?:any){
        this.m_canvas =canvas;
        this.m_gl = WGLContext.InitWidthCanvas(canvas);

        this.m_drawcall = new RUIDrawCall();
        this.m_rootUI = new DebugUI();
        this.m_qtree = new RUIQTree(this);
        this.m_input = new RUIInput(this);
        this.m_cursor= new RUICursor(this);
        

        if(this.m_gl){
            this.m_valid = true;
        }

        this.OnBuild();
    }

    public get canvas():HTMLCanvasElement{
        return this.m_canvas;
    }
    public get rootui():UIObject{
        return this.m_rootUI;
    }
    public get qtree():RUIQTree{
        return this.m_qtree;
    }
    public get input():RUIInput{
        return this.m_input;
    }
    public get cursor():RUICursor{
        return this.m_cursor;
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