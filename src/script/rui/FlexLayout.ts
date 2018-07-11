import { UILayout } from "./UILayout";
import { UIObject } from "./UIObject";

export class FlexLayout extends UILayout{

    constructor(isVertical:boolean = false){
        super();
    }

    public addChildFixed(ui:UIObject,size:number){
        this.children.push(ui);
    }

    public addChildFlex(ui:UIObject,flex:number){
        this.children.push(ui);
    }

}