import { UIUtil } from "./UIUtil";

export enum UIDisplayMode{
    Default,
    Flex,
    Floating
}

export enum UIOrientation{
    Vertical,
    Horizontal
}

export class UIObject{
    public parent: UIObject = null;
    public children: UIObject[] = [];
    public isDirty:boolean = true;

    public visible: boolean= false;
    public displayMode: UIDisplayMode = UIDisplayMode.Default;
    public orientation: UIOrientation = UIOrientation.Vertical;

    public color: number[] = UIUtil.RandomColor();
    public width?:number = null;
    public height?:number = null;
    public flex?:number;

    public _width:number;
    public _height:number;
    public _offsetX:number;
    public _offsetY:number;
    public _calculateX:number;
    public _calculateY:number;
    public _level: number;

    public extra:{[key:string]:any} = {};

    constructor(){
    }

    public onBuild(){

    }

    public _dispatchOnBuild(){

        this.onBuild();
        let clen = this.children.length;
        for(var i=0;i< clen;i++){
            this.children[i]._dispatchOnBuild();
        }
    }

    public addChild(ui:UIObject){
        if(ui == null || ui == this || ui == this.parent) return

        let index = this.children.indexOf(ui);
        if(index >=0) return;

        ui.parent = this;
        this.children.push(ui);

        ui.isDirty= true;
        this.isDirty = true;
    }

    public removeChild(ui:UIObject){
        if(ui == null) return;

        let index = this.children.indexOf(ui);
        if(index < 0 )return;

        this.children.splice(index,1);
        ui.parent = null;
        this.isDirty= true;
    }
    
    
}