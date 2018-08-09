import { RUIInput, IInputUI } from "./RUIInput";
import { RUICursor } from "./RUICursor";
import { RUIRenderer } from "./RUIRenderer";
import { REventEmitter, RUIResizeEvent, RUIObjEvent } from "./EventSystem";
import { RUIContainer } from "./RUIContainer";


type RUICanvasNodeFunc = (f:RUICanvasNode) =>void;

export class RUICanvasNode extends RUIContainer{

    public constructor(creation: RUICanvasNodeFunc){
        super();
        if(creation !=null) creation.call(this);
    }
}

export class RUICanvas {
    private m_canvas: HTMLCanvasElement;
    private m_renderer: RUIRenderer;

    private m_input: RUIInput;
    private m_cursor: RUICursor;

    public m_width: number;
    public m_height: number;

    private m_isResized: boolean = false;

    public EventOnResize: REventEmitter<RUIResizeEvent> = new REventEmitter();

    public EventOnUIEvent: REventEmitter<RUIObjEvent> = new REventEmitter();

    constructor(canvas: HTMLCanvasElement) {
        this.m_canvas = canvas;
        this.m_renderer = new RUIRenderer(this);

        this.m_input = new RUIInput(this);
        this.m_cursor = new RUICursor(this);

        this.registerEvent();

    }

    private registerEvent() {
        //disable context menu
        var ruicanvas=  this;
        this.m_canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); return false });
        window.addEventListener('resize',()=>{
            ruicanvas.onResizeCanvas(window.innerWidth,window.innerHeight);

        })
    }

    private onResizeCanvas(width:number,height:number){
        this.m_renderer.resizeCanvas(width,height);
        this.EventOnResize.emit(new RUIResizeEvent(width,height));
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

}