import { RUIRect, RUICLIP_MAX, RUIRectP, RUICLIP_NULL } from "./RUIObject";
import { RUIRoot } from "./RUIRoot";
import { RUIUtil, CLAMP } from "./RUIUtil";
import { RUIContainerClipType } from "./RUIContainer";
import { RUIImageSize } from "./widget/RUIImage";

export enum RUIDrawCmdType {
    rect,
    text,
    border,
    line,
    image,
}

export class RUIDrawCmd{
    public Rect: number[] = [];
    public Color: number[];
    public Text: string;
    public clip: RUIRectP;
    public object?:any;
    public param?:any;

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

    public static CmdImage(image:HTMLImageElement,rect:RUIRect){
        let cmd = new RUIDrawCmd();
        cmd.Rect = rect;
        cmd.type = RUIDrawCmdType.image;
        cmd.object = image;
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
        cmd.clip = RUIUtil.toRectP(clip == null? pos:clip);
        cmd.Color = color;
        if(order!=null){
            cmd.Index = order;
        }
        else{
            cmd.Index = this.currentOrder;
        }
        this.drawList.push(cmd);
    }

    public DrawImage(image:HTMLImageElement,r:RUIRect,clip?:RUIRect,order?:number,size:RUIImageSize = RUIImageSize.Initial){
        let rect = r.slice(0);
        let cmd = RUIDrawCmd.CmdImage(image,rect);
        cmd.clip = RUIUtil.toRectP(clip == null? rect:clip);
        if(order != null){
            cmd.Index = order;
        }
        else{
            cmd.Index = this.currentOrder;
        }

        let uv = null;

        let rectwidth = rect[2];
        let rectheight = rect[3];

        let isCover = size == RUIImageSize.Cover;
        let isContain = size == RUIImageSize.Contain;

        let imgw  =image.width;
        let imgh = image.height;

        if(isCover || isContain){
            let imageRatio = imgw / imgh;
            let rectRatio = rectwidth / rectheight;

            if(imageRatio != rectRatio){
                let stretchWidth = true;
                if(isCover){
                    if(rectRatio > imageRatio){
                        stretchWidth = false;
                    }
                }
                else{
                    if(rectRatio < imageRatio) stretchWidth = false;
                }

                if(stretchWidth){
                    let w = rectheight * imageRatio;
                    rect[0] += (rectwidth - w)/2.0;
                    rect[2] = w;
                }
                else{
                    let h = rectwidth / imageRatio;
                    rect[1] += (rectheight - h) / 2.0;
                    rect[3] = h;
                }
            }
        }

        //doclip

        let cclip = cmd.clip;

        let xmin = cclip[0];
        let xmax = cclip[2];
        let ymin = cclip[1];
        let ymax = cclip[3];

        let rx1 = rect[0];
        let rx2 = rx1 + rect[2];
        let ry1 = rect[1];
        let ry2 = ry1 + rect[3];


        let x1 = CLAMP(rx1,xmin,xmax);
        let x2 = CLAMP(rx2,xmin,xmax);
        let y1 = CLAMP(ry1,ymin,ymax);
        let y2 = CLAMP(ry2,ymin,ymax);

        cmd.Rect = [x1,y1,x2,y2];

        if(size == RUIImageSize.Cover){
            let ux1 = (x1 - rx1) / imgw;
            let ux2 = 1.0+ (x2 - rx2) / imgw;
            let uy1 = (y1 - ry1) / imgh;
            let uy2 = 1.0 + (y2 - ry2) / imgh;

            uv = [ux1,uy1,ux2,uy1,ux2,uy2,ux1,uy2];
        }

        cmd.param = uv;

        this.drawList.push(cmd);
    }

    public DrawText(text: string, rect:RUIRect, color?: number[],cliprect?:RUIRect,order?:number) {
        let cmd = RUIDrawCmd.CmdText(text, rect, color);
        cmd.clip = RUIUtil.toRectP(cliprect == null? rect:cliprect);
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
        cmd.clip = RUIUtil.toRectP(cliprect == null? rect:cliprect);
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