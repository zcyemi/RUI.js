import { UIObject, UIOrientation } from "./UIObject";



export class DrawCmd{

    public Rect:number[] = [];
    public Color:number[];

    public constructor(rect?:number[]){
        this.Rect = rect;
    }
}



export class RUIDrawCall{


    public drawList:DrawCmd[] = [];

    public isDirty: boolean = true;

    constructor(){

    }

    public Rebuild(ui:UIObject){

        console.log('rebuild');
        this.drawList = [];
        
        this.RebuildUINode(ui);

        ui.isDirty =false;
    }


    private RebuildUINode(ui:UIObject){

        let children = ui.children;
        let childCount = children.length;

        let isVertical = ui.orientation == UIOrientation.Vertical;
        
        let maxsize:number = isVertical ? ui.width : ui.height;
        let offset:number = 0;
        
        if(childCount != 0){

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

            if(ui.width == undefined) ui._width = isVertical ? maxsize : offset;
            if(ui.height == undefined) ui._height = isVertical ? offset : maxsize;
        }
        else{
            ui._width = ui.width == null ? 20 :ui.width;
            ui._height = ui.height == null? 20 : ui.height;
        }

        
        
        ui.isDirty= false;
    }


    private DrawRect(x:number,y:number,w:number,h:number){
        this.drawList.push(new DrawCmd([x,y,w,h]));
    }

    private DrawRectWithColor(pos:number[],color:number[]){
        let cmd = new DrawCmd(pos);
        cmd.Color = color;
        this.drawList.push(cmd);
    }
    
}