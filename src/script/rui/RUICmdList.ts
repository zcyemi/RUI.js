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

    private m_clipStack :RUIRectP[] = [];
    private m_clipRectP :RUIRectP = null;
    private m_clipRect: RUIRect = null;

    private m_skipdraw:boolean =false;


    public get clipRect():RUIRect{
        return this.m_clipRect;
    }

    public get isSkipDraw():boolean{
        return this.m_skipdraw;
    }

    public draw(root: RUIRoot){

        this.drawList = [];
        this.m_clipStack = [];
        let rootrect=  root.rootRect;
        this.m_clipRectP = rootrect == null ? RUICLIP_MAX : rootrect;
        this.m_clipRect = RUI.toRect(this.m_clipRectP);
        root.root.onDraw(this);
        
        this.isDirty = true;
    }


    public DrawRect(x: number, y: number, w: number, h: number) {
        if(this.m_clipRectP == RUICLIP_NULL) return;

        let cmd = new RUIDrawCmd([x, y, w, h]);
        cmd.clip = this.m_clipRectP;
        this.drawList.push();
    }

    public DrawRectWithColor(pos: number[], color: number[]) {
        if(this.m_clipRectP == RUICLIP_NULL) return;
        let cmd = new RUIDrawCmd(pos);
        cmd.clip = this.m_clipRectP;
        cmd.Color = color;
        this.drawList.push(cmd);
    }

    public DrawText(text: string, clirect:RUIRect, color?: number[]) {
        if(this.m_clipRectP == RUICLIP_NULL) return;

        let clip = clirect.slice(0);
        clip[2] += clip[0];
        clip[3] += clip[1];
        clip = RUI.RectClipP(clip,this.m_clipRectP);

        if(clip != null){
            let cmd = RUIDrawCmd.CmdText(text, clirect, color);
            cmd.clip =clip;
            this.drawList.push(cmd);
        }
        else{
            //skip draw
            return;
        }
        //this.DrawBorder(clirect,RUIColor.Red);
    }

    public DrawBorder(rect: number[], color: number[]) {
        if(this.m_clipRectP == RUICLIP_NULL) return;

        let cmd = RUIDrawCmd.CmdBorder(rect, color);
        cmd.clip = this.m_clipRectP;
        this.drawList.push(cmd);
    }

    public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
        if(this.m_clipRectP == RUICLIP_NULL) return;

        let cmd = RUIDrawCmd.CmdLine(x1,y1,x2,y2,color);
        cmd.clip = this.m_clipRectP;
        this.drawList.push(cmd);
    }


    public PushClip(rect:RUIRect,rectClipped:RUIRect,type:RUIContainerClipType){

        if(rect == null) throw new Error();

        let clipp = null;
        if(type == RUIContainerClipType.NoClip){
            clipp = RUICLIP_MAX;
            this.m_clipRect = RUICLIP_MAX;
        }
        else if(type == RUIContainerClipType.ClipSelf){
            clipp = RUI.toRectP(rect);
            this.m_clipRect = rect;
        }
        else{
            if(rectClipped != RUICLIP_NULL){
                clipp = RUI.toRectP(rectClipped);
                this.m_clipRect = rectClipped;
            }
            else{
                clipp = RUICLIP_NULL;
                this.m_clipRect = null;
                this.m_skipdraw =true;
            }
        }

        this.m_clipStack.push(this.m_clipRectP);
        this.m_clipRectP = clipp;

    }

    public PopClipRect(): RUIRect{
        this.m_clipRectP = this.m_clipStack.pop();
        this.m_skipdraw = this.m_clipRectP == RUICLIP_NULL;
        this.m_clipRect = RUI.toRect(this.m_clipRectP);
        return this.m_clipRectP;
    }
}