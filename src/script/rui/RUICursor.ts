import { RUIInput } from "./RUIInput";
import { RUICanvas } from "./RUICanvas";


export enum RUICursorType{
    default = "default",
    crosshair = "crosshair",
    move = "move",
    none = "none",
    pointer = "pointer",
    text = "text",
    col_resize = "col-resize",
    row_resize = "row-resize",
    n_resize = "n-resize",
    e_resize = "e-resize",
    s_resize = "s-resize",
    w_resize = "w-resize",
    ne_resize = "ne-resize",
    se_resize = "se-resize",
    ns_resize = "ns-resize",
    sw_resize = "sw-resize",
    nesw_resize = "nesw-resize",
    nwse_resize = "nwse-resize",
}

export class RUICursor{

    public Cursor : RUICursorType = RUICursorType.default;

    private m_input: RUIInput;
    private m_canvas:HTMLCanvasElement;
    public constructor(canvas: RUICanvas){
        this.m_input = canvas.input;
        this.m_canvas = canvas.canvas;
        //this.m_input.EvtMouseEnter.on(this.onMouseEnter.bind(this));
        //this.m_input.EvtMouseLeave.on(this.onMouseLeave.bind(this));
    }

    private onMouseEnter(e){

    }

    private onMouseLeave(e){
    }

    public SetCursor(type:RUICursorType){
        this.Cursor = type;

        this.m_canvas.style.cursor =this.Cursor;
    }
}