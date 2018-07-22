import { UIObject, UIOrientation, UIDisplayMode } from "./UIObject";



export enum DrawCmdType{
    rect,
    text
}

export class DrawCmd{

    public Rect:number[] = [];
    public Color:number[];
    public Text:string;

    public type:DrawCmdType = DrawCmdType.rect;

    public constructor(rect?:number[]){
        this.Rect = rect;
    }

    public static CmdRect(rect:number[],color:number[]):DrawCmd{
        let cmd = new DrawCmd();
        cmd.Rect = rect;
        cmd.Color = color;
        return cmd;
    }

    public static CmdText(text:string,cliprect:number[],color?:number[]){
        let cmd= new DrawCmd();
        cmd.Text = text;
        cmd.Rect = cliprect;
        cmd.Color = color;
        cmd.type = DrawCmdType.text;
        return cmd;
    }

}

export class RUIDrawCall{


    public drawList:DrawCmd[] = [];

    public isDirty: boolean = true;

    constructor(){

    }

    public Rebuild(ui:UIObject,isResize:boolean = false){
        this.drawList = [];

        this.RebuildUINode(ui,isResize);

        this.ExecNodes(ui,this.PostRebuild.bind(this));

        ui.isDirty =false;
        this.isDirty =true;
    }

    private ExecNodes(uiobj:UIObject,f:(ui:UIObject)=>void){
        f(uiobj);
        let c= uiobj.children;
        let cc = c.length;
        for(let i=0;i<cc;i++){
            let cu = c[i];
            this.ExecNodes(cu,f);
        }
    }

    private RebuildUINode(ui:UIObject,isResize:boolean = false){
        let children = ui.children;
        let childCount = children.length;
        let isRoot = ui.parent == null;
        let canvas = ui._canvas;
        let parent = ui.parent;

        let isVertical = ui.orientation == UIOrientation.Vertical;
        let isFlex = ui.displayMode == UIDisplayMode.Flex;

        
        let maxsize:number = isVertical ? ui.width : ui.height;
        let offset:number = 0;
        
        if(isRoot){
            ui.width= canvas.m_width;
            ui.height = canvas.m_height;
            ui._width = ui.width;
            ui._height = ui.height;
        }
        else{
            if(isFlex){
                if(isVertical){
                    ui.width = ui.parent.width;
                    if(ui.height == undefined) ui.height = ui._height;
                }
                else{
                    ui.height = ui.parent.height;
                    if(ui.width == undefined) ui.width = ui._width;
                }
            }
        }
        
        if(childCount != 0){

            switch(ui.displayMode){
                case UIDisplayMode.Default:
                {
                    for(var i=0;i< childCount;i++){

                        let c = children[i];
                        if(c.isDirty){
                            this.RebuildUINode(c);
        
                            c._offsetX = isVertical ? 0 : offset;
                            c._offsetY = isVertical ? offset : 0;
                        }
                        offset += isVertical ? c._height : c._width;
                        maxsize = Math.max(maxsize, isVertical ? c._width : c._height);
                    }
                }
                break;
                case UIDisplayMode.Flex:
                {
                    let flexCount =0;
                    let fiexSize = 0;
                    for(var i=0;i< childCount;i++){
                        let c = children[i];
                        if(c.flex != null){
                            flexCount += c.flex;
                        }
                        else{
                            let fsize = (isVertical? c.height : c.width);
                            fiexSize += fsize == undefined ? 0 : fsize;
                        }
                    }

                    let sizePerFlex = flexCount == 0? 0: ((isVertical ? ui.height : ui.width) - fiexSize ) / flexCount;

                    for(var i=0;i< childCount;i++){

                        let c = children[i];
                        if(c.isDirty){
                            let cflex = c.flex;
                            let cfsize = isVertical ? c.height : c.width;
                            if(cflex != undefined){
                                cfsize = cflex * sizePerFlex;
                            }
                            
                            if(isVertical){
                                c._height = cfsize;
                                c._width = ui.width;
                            }
                            else{
                                c._width = cfsize;
                                c._height = ui.height;
                            }
                            this.RebuildUINode(c);
        
                            c._offsetX = isVertical ? 0 : offset;
                            c._offsetY = isVertical ? offset : 0;
                        }
        
                        offset += isVertical ? c._height : c._width;
                        maxsize = Math.max(maxsize, isVertical ? c._width : c._height);
                    }
                }
                break;
            }

            if(isRoot || parent.displayMode != UIDisplayMode.Flex){
                if(ui.width == undefined){
                    ui._width = isVertical ? maxsize : offset;
                }
                else{
                    ui._width = ui.width;
                }
                if(ui.height == undefined){
                    ui._height = isVertical ? offset : maxsize;
                }
                else{
                    ui._height = ui.height;
                }
            }
        }
        else{
            if(isRoot || parent.displayMode != UIDisplayMode.Flex){
                ui._width = ui.width == null ? 20 :ui.width;
                ui._height = ui.height == null? 20 : ui.height;
            }
        }
        ui.isDirty= false;
    }

    private PostRebuild(ui:UIObject){
        
        let p = ui.parent;
        if(p == null){
            ui._calculateX = 0;
            ui._calculateY = 0;
            ui._level = 0;
        }
        else{
            ui._calculateX = p._calculateX + ui._offsetX;
            ui._calculateY = p._calculateY + ui._offsetY;
            ui._level = p._level +1;
        }

        if(ui.visible){

            let onDraw = ui['onDraw'];
            if(onDraw!=null){
                ui['onDraw'](this);
            }
            else{
                let rect = [ui._calculateX,ui._calculateY,ui._width,ui._height];
                this.DrawRectWithColor(rect,ui.color);
            }

        }

    }


    public DrawRect(x:number,y:number,w:number,h:number){
        this.drawList.push(new DrawCmd([x,y,w,h]));
    }

    public DrawRectWithColor(pos:number[],color:number[]){
        let cmd = new DrawCmd(pos);
        cmd.Color = color;
        this.drawList.push(cmd);
    }
    
    public DrawText(text:string,clirect:number[],color?:number[]){
        let cmd = DrawCmd.CmdText(text,clirect,color);
        this.drawList.push(cmd);
    }
}