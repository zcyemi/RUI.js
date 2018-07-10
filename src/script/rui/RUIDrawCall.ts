import { UIObject } from "./UIObject";
import { UIFlow, FlowNodeType } from "./UIFlow";



export class DrawCmd{

    public Rect:number[] = [];

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

        this.RebuildFlow(ui.flow);

        ui.isDirty =false;
    }

    private RebuildFlow(flow:UIFlow){
        if(flow == null) return;
        let nodes = flow.nodes;

        var offsetX :number = 0;
        var offsetY : number = 0;
        for(var i=0;i< nodes.length;i++){
            let node = nodes[i];
            
            switch(node.type){
                case FlowNodeType.START:

                let ui = node.ui;
                let uil = ui.layout;
                this.DrawRect(offsetX,offsetY,uil.width,uil.height);
                break;
            }
            
        }
    }

    private DrawRect(x:number,y:number,w:number,h:number){
        this.drawList.push(new DrawCmd([x,y,w,h]));
    }

    
}