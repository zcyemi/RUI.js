import { RUIRoot } from "./RUI";

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

    public static CmdText(text: string, cliprect: number[], color?: number[]) {
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


    public draw(root: RUIRoot){

        this.drawList = [];
        root.root.onDraw(this);
        
        this.isDirty = true;
    }


    public DrawRect(x: number, y: number, w: number, h: number) {
        let cmd = new RUIDrawCmd([x, y, w, h]);
        this.drawList.push();
    }

    public DrawRectWithColor(pos: number[], color: number[]) {
        let cmd = new RUIDrawCmd(pos);
        cmd.Color = color;
        this.drawList.push(cmd);
    }

    public DrawText(text: string, clirect: number[], color?: number[]) {
        let cmd = RUIDrawCmd.CmdText(text, clirect, color);
        this.drawList.push(cmd);
    }

    public DrawBorder(rect: number[], color: number[]) {
        let cmd = RUIDrawCmd.CmdBorder(rect, color);
        this.drawList.push(cmd);
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
        let cmd = RUIDrawCmd.CmdLine(x1,y1,x2,y2,color);
        this.drawList.push(cmd);
    }
}