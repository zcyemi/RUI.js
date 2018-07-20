import { UIUtil } from "./UIUtil";
import { RUIMouseEvent } from "./RUIEventSys";

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

    public execRecursive(f:(ui:UIObject)=>void){
        f(this);
        let clen = this.children.length;
        let children = this.children;

        for(var i=0;i< clen;i++){
            let c = children[i];
            c.execRecursive(f);
        }
    }

    public onMouseEnter(){

    }

    public onMouseLeave(){

    }

    public onMouseDown(){

    }

    public onMouseUp(){

    }

    public onMouseClick(e:RUIMouseEvent){

    }

    public rectContains(x:number,y:number):boolean{
        if(x < this._calculateX || x > this._calculateX +this._width) return false;
        if(y < this._calculateY || y > this._calculateY + this._height) return false;
        return true;
    }
    
    
}