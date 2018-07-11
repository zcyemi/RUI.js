import { UIObject } from "./UIObject";
import { UIFlow, FlowNodeType } from "./UIFlow";



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

        this.RebuildFlow(ui);

        ui.isDirty =false;
    }

    private RebuildFlow(ui:UIObject){
        // if(flow == null) return;
        // let nodes = flow.nodes;

        // var offsetX :number = 0;
        // var offsetY : number = 0;
        // var maxWidth: number = 0;
        // var maxHeight: number =0;
        // for(var i=0;i< nodes.length;i++){
        //     let node = nodes[i];
            
        //     switch(node.type){
        //         case FlowNodeType.START:
        //         {
        //             let ui = node.ui;
        //             let uil = ui.layout;
        //             this.DrawRectWithColor([offsetX,offsetY,uil.width,uil.height],ui.style.color);
        //         }
        //         break;
        //         case FlowNodeType.CHILD:
        //         {
        //             let ui = node.ui;
        //             this.DrawRectWithColor([offsetX,offsetY,ui.layout.width,ui.layout.height],ui.style.color);
        //             offsetY += ui.layout.height;
        //         }
        //         break;
        //     }
            
        // }
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