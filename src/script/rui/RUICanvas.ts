import { RUIDrawCall } from "./RUIDrawCall";
import { UIObject } from "./UIObject"
import { DebugUI } from "./DebugUI";
import { RUIInput, IInputUI } from "./RUIInput";
import { RUIQTree } from "./RUIQTree";
import { RUICursor } from "./RUICursor";
import { RUIRenderer } from "./RUIRenderer";

export class RUICanvas{
    private m_canvas : HTMLCanvasElement;
    private m_drawcall: RUIDrawCall;

    private m_renderer: RUIRenderer;

    private m_rootUI: UIObject;
    private m_input : RUIInput;
    private m_qtree: RUIQTree;

    private m_cursor:RUICursor;

    private m_valid :boolean = false;

    private m_activeUI:IInputUI = null;
    

    public m_width:number;
    public m_height:number;

    private m_isResized:boolean = false;
    
    constructor(canvas:HTMLCanvasElement,UIClass?:any){
        this.m_canvas =canvas;
        this.m_renderer = new RUIRenderer(this);

        this.m_drawcall = new RUIDrawCall();
        this.m_rootUI = new DebugUI();
        this.m_rootUI._canvas = this;
        this.m_qtree = new RUIQTree(this);
        this.m_input = new RUIInput(this);
        this.m_cursor= new RUICursor(this);
        

        if(this.m_renderer.isValid){
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
    public get activeUI():IInputUI{
        return this.m_activeUI;
    }

    public setSize(w:number,h:number){
        if(this.m_width != w || this.m_height != h){
            this.m_width =w;
            this.m_height = h;

            this.m_isResized = true;

            if(this.m_rootUI != null) this.m_rootUI.isDirty = true;
        }
    }

    public setActiveInputUI(ui:IInputUI){
        this.m_activeUI = ui;
    }
    public setInActiveInputUI(ui:IInputUI){
        if(this.m_activeUI == ui){
            this.m_activeUI = null;
        }
    }

    public OnBuild(){
        this.m_rootUI._dispatchOnBuild();
        this.m_drawcall.Rebuild(this.m_rootUI);

        console.log(this.m_rootUI);
    }

    public OnFrame(ts:number){

        let rootUI = this.m_rootUI;
        let renderer = this.m_renderer;

        if(rootUI.isDirty){
            let startTime = Date.now();
            this.m_drawcall.Rebuild(rootUI,this.m_isResized);
            //console.log('rebuildui: '+(Date.now() -startTime) +'ms');
            this.m_isResized = false;
        }

        this.OnRender();

        
    }

    public OnRender(){
        let render = this.m_renderer;
        if(render) render.Draw(this.m_drawcall);
    }


}