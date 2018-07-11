import { UIStyle } from "./UIStyle";
import { UIFlow } from "./UIFlow";
import { UIBuilder } from "./UIBuilder";
import { UIUtil } from "./UIUtil";

export class UIObject{
    public isDirty:boolean = false;
    public isDrawn: boolean = true;

    public width:number|null;
    public height:number|null;

    public margin:number = 1;

    public color: number[] = UIUtil.RandomColor();

    public extra:{[key:string]:any} = {};

    
    public children: UIObject[] = [];

    constructor(){
    }

    public onBuild(builder:UIBuilder){

    }

    public get validWidth():number{
        if(!this.width){
            return 23;
        }
        return this.width;
    }

    public get validHeight():number{
        if(!this.height){
            return 23;
        }
        return this.height;
    }
    
    public get drawWidth():number{
        return this.validWidth+ this.margin *2;
    }
    public get drawHeight():number{
        return this.validHeight + this.margin *2;
    }
}