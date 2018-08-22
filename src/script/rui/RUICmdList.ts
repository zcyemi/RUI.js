import { RUIRect, RUICLIP_MAX, RUIRectP, RUICLIP_NULL } from "./RUIObject";
import { RUIRoot } from "./RUIRoot";
import { RUI } from "./RUI";
import { RUIContainerClipType } from "./RUIContainer";

export enum RUIDrawCmdType {
    rect,
    text,
    border,
    line
}

export class RUIDrawCmd{
    public Rect: number[] = [];
    public Color: number[];
    public Text: string;
    public clip: RUIRectP;

    public Index:number = 0;

    public type: RUIDrawCmdType = RUIDrawCmdType.rect;
    
    public constructor(rect?: number[]) {
        this.Rect = rect;
    }

    public static CmdRect(rect: number[], color: number[]): RUIDrawCmd {
        let cmd = new RUIDrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        return cmd;
    }

    public static CmdText(text: string, cliprect: RUIRectP, color?: number[]) {
        let cmd = new RUIDrawCmd();
        cmd.Text = text;
        cmd.Rect = cliprect;
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.text;
        return cmd;
    }

    public static CmdBorder(rect: number[], color: number[]): RUIDrawCmd {
        let cmd = new RUIDrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.border;
        return cmd;
    }

    public static CmdLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
        let cmd = new RUIDrawCmd();
        cmd.Rect = [x1, y1, x2, y2];
        cmd.Color = color;
        cmd.type = RUIDrawCmdType.line;
        return cmd;
    }
}

export class RUICmdList{
    public drawList: RUIDrawCmd[] = [];
    public MaxDrawCount:number = 1000;
    public isDirty:boolean = false;

    public currentOrder:number = 0;

    public draw(root: RUIRoot){

        this.drawList = [];
        root.root.onDraw(this);
        
        this.isDirty = true;
    }

    public DrawRectWithColor(pos: number[], color: number[],clip?:RUIRect,order?:number) {
        let cmd = new RUIDrawCmd(pos);
        cmd.clip = RUI.toRectP(clip == null? pos:clip);
        cmd.Color = color;
        if(order!=null){
            cmd.Index = order;
        }
        else{
            cmd.Index = this.currentOrder;
        }
        this.drawList.push(cmd);
    }

    public DrawText(text: string, rect:RUIRect, color?: number[],cliprect?:RUIRect,order?:number) {
        let cmd = RUIDrawCmd.CmdText(text, rect, color);
        cmd.clip = RUI.toRectP(cliprect == null? rect:cliprect);
        if(order!=null){
            cmd.Index = order;
        }
        else{
            cmd.Index = this.currentOrder;
        }
        this.drawList.push(cmd);
    }

    public DrawBorder(rect: number[], color: number[],cliprect?:RUIRect,order?:number) {
        if(rect == null) throw new Error();

        let cmd = RUIDrawCmd.CmdBorder(rect, color);
        cmd.clip = RUI.toRectP(cliprect == null? rect:cliprect);
        if(order!=null){
            cmd.Index = order;
        }
        else{
            cmd.Index = this.currentOrder;
        }
        this.drawList.push(cmd);
    }

    /** TODO */
    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[],order:number= 0) {
        // if(this.m_clipRectP == RUICLIP_NULL) return;

        // let cmd = RUIDrawCmd.CmdLine(x1,y1,x2,y2,color);
        // cmd.clip = this.m_clipRectP;
        // this.drawList.push(cmd);
    }
}