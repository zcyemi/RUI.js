import { UIObject } from "./UIObject";
import { UIFlow, FlowNodeType } from "./UIFlow";
import { UIGroup } from "./widget/UIGroup";



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

        this.RebuildFlow(ui,0,0);

        ui.isDirty =false;
    }

    private RebuildFlow(ui:UIObject,xoff:number,yoff:number){

        let drawoffx = xoff;
        let drawoffy = yoff;

        let c= ui.children;
        let isvertical:boolean = true;
        if(ui instanceof UIGroup){
            isvertical = (<UIGroup>ui).isVertical;
        }

        if(ui.isDrawn)
            this.DrawRectWithColor([drawoffx + ui.margin,drawoffy + ui.margin,ui.validWidth,ui.validHeight],ui.color);
        
        for(var i=0;i< c.length;i++){
            let cu = c[i];
            this.RebuildFlow(cu,drawoffx,drawoffy);

            if(isvertical){
                drawoffy += cu.drawHeight;
            }
            else{
                drawoffx += cu.drawWidth;
            }
        }
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