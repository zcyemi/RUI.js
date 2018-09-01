import { RUIInput, IInputUI } from "./RUIInput";
import { RUICursor } from "./RUICursor";
import { RUIRenderer } from "./RUIRenderer";
import { RUIEventEmitter, RUIResizeEvent, RUIObjEvent } from "./RUIEvent";
import { RUIContainer } from "./RUIContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIObject } from "./RUIObject";
import { RUIEVENT_ONFRAME, RUIEVENT_ONUI } from "./RUIContext";
import { RUICmdList } from "./RUICmdList";

export class RUIDOMCanvas {
    private m_canvas: HTMLCanvasElement;
    private m_renderer: RUIRenderer;

    private m_input: RUIInput;
    private m_cursor: RUICursor;

    private m_width: number;
    private m_height: number;

    private m_isResized: boolean = false;

    public EventOnResize: RUIEventEmitter<RUIResizeEvent> = new RUIEventEmitter();

    public EventOnUIEvent: RUIEventEmitter<RUIObjEvent> = new RUIEventEmitter();

    private m_root: RUIRoot;
    private m_cmdlist:RUICmdList;

    constructor(canvas: HTMLCanvasElement,baseui:RUIObject = new RUIContainer()) {
        this.m_canvas = canvas;
        this.m_renderer = new RUIRenderer(this);

        this.m_input = new RUIInput(this);
        this.m_cursor = new RUICursor(this);

        this.registerEvent();

        if(baseui != null){
            let root = new RUIRoot(baseui,true);
            this.m_root = root;
            this.m_cmdlist = new RUICmdList();
            this.rootInit();
        }

        RUIEVENT_ONFRAME.on(this.onFrame.bind(this));
        RUIEVENT_ONUI.on(this.onUIEvent.bind(this));
    }

    private rootInit(){
        let root = this.root;
        root.resizeRoot(this.canvasWidth,this.canvasHeight);
        this.EventOnResize.on((e)=>{
            root.resizeRoot(e.object.width,e.object.height);
        })
    }

    private registerEvent() {
        //disable context menu
        var ruicanvas=  this;
        this.m_canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); return false });
        window.addEventListener('resize',()=>{
            ruicanvas.onResizeCanvas(window.innerWidth,window.innerHeight);
        })
    }

    private onUIEvent(e:RUIObjEvent){
        let root = this.m_root;
        root.dispatchEvent(e);
    }

    private onFrame(f:number){
        let root = this.root;
        if(this.root == null) return;
        let renderer = this.renderer;
        if(root.isdirty || renderer.needRedraw){
            let start = window.performance.now();
            root.layout();
            console.log('> '+ (window.performance.now() - start).toPrecision(4));
            this.m_cmdlist.draw(root);
            //console.log(root.root);
            renderer.DrawCmdList(this.m_cmdlist);
        }
    }

    private onResizeCanvas(width:number,height:number){
        this.m_renderer.resizeCanvas(width,height);
        this.EventOnResize.emit(new RUIResizeEvent(width,height));
    }


    public get root():RUIRoot{
        return this.m_root;
    }

    public set root(val:RUIRoot){
        if(val == null) return;
        this.m_root =this.root;
        this.rootInit();
    }

    public get canvasWidth():number{
        return this.m_canvas.width;
    }

    public get canvasHeight():number{
        return this.m_canvas.height;
    }

    public get canvas(): HTMLCanvasElement {
        return this.m_canvas;
    }

    public get renderer(): RUIRenderer{
        return this.m_renderer;
    }

    public get input(): RUIInput {
        return this.m_input;
    }
    public get cursor(): RUICursor {
        return this.m_cursor;
    }
    public get canvasRect(): number[] {
        return [0, 0, this.m_width, this.m_height];
    }

    public setSize(w:number,h:number){
        this.m_width = w;
        this.m_height= h;
    }

}