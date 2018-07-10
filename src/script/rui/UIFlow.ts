import { UIObject } from "./UIObject";


export enum FlowNodeType{
    START,
    END,
}

export class UIFLowNode{

    constructor(nodetype:FlowNodeType,ui?:UIObject){
        this.type = nodetype;
        this.ui = ui;
    }

    public type: FlowNodeType;
    public ui:UIObject;
}

export class UIFlow{

    private m_targetUI: UIObject;

    public nodes: UIFLowNode[] = [];

    constructor(target:UIObject){
        this.m_targetUI = target;
    }

    public begin(){
        this.nodes = [];
        let fnode = new UIFLowNode(FlowNodeType.START,this.m_targetUI);
        this.nodes.push(fnode);
    }

    public addChild(ui:UIObject){

    }

    public flexBegin(isHorizontal:boolean = true){

    }

    public flexChildFlex(ui:UIObject,flex:number){

    }

    public flexChildWidth(ui:UIObject,flex:number){

    }

    public flexEnd(){

    }

    public end(){
        let fnode = new UIFLowNode(FlowNodeType.END,this.m_targetUI);
        this.nodes.push(fnode);
    }
}