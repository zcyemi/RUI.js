import { UIObject, UIOrientation, UIDisplayMode } from "./UIObject";
import { UIInput } from "./widget/UIInput";



export enum DrawCmdType {
    rect,
    text,
    border,
    line
}

export class DrawCmd {

    public Rect: number[] = [];
    public Color: number[];
    public Text: string;

    public type: DrawCmdType = DrawCmdType.rect;

    public constructor(rect?: number[]) {
        this.Rect = rect;
    }

    public static CmdRect(rect: number[], color: number[]): DrawCmd {
        let cmd = new DrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        return cmd;
    }

    public static CmdText(text: string, cliprect: number[], color?: number[]) {
        let cmd = new DrawCmd();
        cmd.Text = text;
        cmd.Rect = cliprect;
        cmd.Color = color;
        cmd.type = DrawCmdType.text;
        return cmd;
    }

    public static CmdBorder(rect:number[],color:number[]):DrawCmd{
        let cmd = new DrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        cmd.type = DrawCmdType.border;
        return cmd;
    }

    public static CmdLine(x1:number,y1:number,x2:number,y2:number,color:number[]){
        let cmd= new DrawCmd();
        cmd.Rect = [x1,y1,x2,y2];
        cmd.Color = color;
        cmd.type = DrawCmdType.line;
        return cmd;
    }

}

export class RUIDrawCall {


    public drawList: DrawCmd[] = [];

    public isDirty: boolean = true;

    constructor() {

    }

    public Rebuild(ui: UIObject, isResize: boolean = false) {
        this.drawList = [];
        this.RebuildNode(ui);
        this.ExecNodes(ui, this.PostRebuild.bind(this));

        ui.isDirty = false;
        this.isDirty = true;
    }

    private ExecNodes(uiobj: UIObject, f: (ui: UIObject) => void) {
        f(uiobj);
        let c = uiobj.children;
        let cc = c.length;
        for (let i = 0; i < cc; i++) {
            let cu = c[i];
            this.ExecNodes(cu, f);
        }
    }

    //Process all child ui and self rect
    private RebuildNode(ui: UIObject) {
        switch (ui.displayMode) {
            case UIDisplayMode.Default:
                this.RebuildNodeDefault(ui);
                break;
            case UIDisplayMode.Flex:
                this.RebuildNodeFlex(ui);
                break;
        }
    }

    private fillFlexSize(ui: UIObject){
        if (ui._flexHeight != null) {
            ui._height = ui._flexHeight;
        }
        else {
            ui._height = ui.height;
        }
        if (ui._flexWidth != null) {
            ui._width = ui._flexWidth;
        }
        else {
            ui._width = ui.width;
        }
    }


    //Post process rect
    private RebuildNodeDefault(ui: UIObject) {
        this.fillFlexSize(ui);

        let children = ui.children;
        let parent = ui.parent;

        let isVertical = ui.orientation == UIOrientation.Vertical;
        let childOffset = 0;

        let childMaxSecond = 0;

        let clen = children.length;

        for (var i = 0, len = clen; i < len; i++) {
            let c = children[i];

            c._flexWidth = null;
            c._flexHeight = null;


            //TODO: set size for flex child
            this.RebuildNode(c);


            let cwidth = c._width;
            let cheight = c._height;
            if(cwidth == undefined || cheight == undefined) throw new Error('child size not full calculated!');

            if(isVertical){
                c._offsetX = 0;
                c._offsetY = childOffset;
                childOffset += c._height;

                
                childMaxSecond = Math.max(childMaxSecond,c._width);
            }else{
                c._offsetX = childOffset;
                c._offsetY = 0;
                childOffset += c._width;
                childMaxSecond = Math.max(childMaxSecond,c._height);
            }
        }

        if(clen > 0){
            //set ui size
            if(ui._width == undefined){
                ui._width = isVertical? childMaxSecond: childOffset;
            }
            if(ui._height == undefined){
                ui._height = isVertical ? childOffset : childMaxSecond;
            }
        }
        else{

            let pisVertical = parent.orientation == UIOrientation.Vertical;
            if(ui._width == undefined){
                ui._width = pisVertical? parent._width: 100;
            }
            if(ui._height == undefined){
                ui._height = pisVertical ? 23 : parent._height;
            }
        }
    }

    //Pre process rect
    private RebuildNodeFlex(ui: UIObject) {
        this.fillFlexSize(ui);

        //checkfor root
        if (ui.parent == null) {
            let canvas = ui._canvas;
            ui._width = canvas.m_width;
            ui._height = canvas.m_height;
        }

        let isVertical = ui.orientation == UIOrientation.Vertical;
        //check size
        if (ui._height == null) {
            if(ui.height != null){
                ui._height = ui.height;
            }
            else{
                throw new Error('flex proces error');
            }
        }
        if(ui._width == null){
            if(ui.width != null){ui._width = ui.width;}
            else{
                throw new Error('flex proces error');
            }
        }
        let fsizeTotal = isVertical ? ui._height: ui._width;
        let fsizeSecond = isVertical? ui._width: ui._height;


        let children = ui.children;
        let clen = children.length;

        let flexCount = 0;
        let flexSize = 0;

            //calculate size
        for (var i = 0; i < clen; i++) {
            let c = children[i];
            if(c.flex !=null){
                flexCount +=c.flex;
            }
            else{
                let cfsize = isVertical? c.height: c.width;
                if(cfsize == null){
                    throw new Error('flexed child has invalid flex or size');
                }else{
                    flexSize += cfsize;
                }
            }
        }
        let sizePerFlex = (fsizeTotal - flexSize ) / flexCount;

        let childOffsetY = 0;
        let childOffsetX = 0;

        for(var i=0;i< clen;i++){
            let c = children[i];

            let flexval = c.flex != null;

            if(isVertical){
                c._flexWidth = fsizeSecond;
                c._flexHeight = flexval ? c.flex * sizePerFlex : c.height;
            }
            else{
                c._flexHeight = fsizeSecond;
                c._flexWidth = flexval ? c.flex * sizePerFlex : c.width;
            }
            this.RebuildNode(c);
            c._offsetX = childOffsetX;
            c._offsetY = childOffsetY;

            if(isVertical){
                childOffsetY += c._height;
            }else{
                childOffsetX += c._width;
            }
        }
    }

    private PostRebuild(ui: UIObject) {

        let p = ui.parent;
        if (p == null) {
            ui._calculateX = 0;
            ui._calculateY = 0;
            ui._level = 0;
        }
        else {
            ui._calculateX = p._calculateX + ui._offsetX;
            ui._calculateY = p._calculateY + ui._offsetY;
            ui._level = p._level + 1;
        }

        if (ui.visible) {

            let onDraw = ui['onDraw'];
            if (onDraw != null) {
                ui['onDraw'](this);
            }
            else {
                let rect = [ui._calculateX, ui._calculateY, ui._width, ui._height];
                this.DrawRectWithColor(rect, ui.color);
            }

        }

    }


    public DrawRect(x: number, y: number, w: number, h: number) {
        this.drawList.push(new DrawCmd([x, y, w, h]));
    }

    public DrawRectWithColor(pos: number[], color: number[]) {
        let cmd = new DrawCmd(pos);
        cmd.Color = color;
        this.drawList.push(cmd);
    }

    public DrawText(text: string, clirect: number[], color?: number[]) {
        let cmd = DrawCmd.CmdText(text, clirect, color);
        this.drawList.push(cmd);
    }

    public DrawBorder(rect:number[],color:number[]){
        let cmd = DrawCmd.CmdBorder(rect,color);
        this.drawList.push(cmd);
    }
    
    public DrawLine(x1:number,y1:number,x2:number,y2:number,color:number[]){

    }
}