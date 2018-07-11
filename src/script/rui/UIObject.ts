import { UIStyle } from "./UIStyle";
import { UILayout } from "./UILayout";
import { UIFlow } from "./UIFlow";
import { UIBuilder } from "./UIBuilder";

export class UIObject{
    public isDirty:boolean = false;

    public extra:{[key:string]:any} = {};

    
    public children: UIObject[] = [];

    constructor(){
    }

    public onBuild(builder:UIBuilder){

    }
}