import { UIStyle } from "./UIStyle";
import { UILayout } from "./UILayout";
import { UIFlow } from "./UIFlow";

export class UIObject{
    public isDirty:boolean = false;
    public style:UIStyle = new UIStyle();
    public layout:UILayout = new UILayout();

    public flow:UIFlow;
    
    protected children: UIObject[] = [];

    constructor(){
        this.flow = new UIFlow(this);
        this.onBuild();
    }

    protected onBuild(){

    }

    public addChild(ui:UIObject){
        if(this.children.indexOf(ui)>=0) return;
        this.children.push(ui);
        this.isDirty =true;
    }

    public removeChild(ui:UIObject){
        let index = this.children.indexOf(ui);
        if(index<0) return;
        this.children.splice(index,1);
        this.isDirty = true;
    }
}