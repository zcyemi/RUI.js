import { UIUtil } from "./UIUtil";
import { RUIMouseEvent, RUIEvent, RUIMouseDragEvent } from "./RUIEventSys";
import { RUICanvas } from "./RUICanvas";
import { RUIDrawCall } from "./RUIDrawCall";
import { RUIStyle } from "./RUIStyle";

export enum UIDisplayMode{
    Default,
    Flex
}

export enum UIOrientation{
    Vertical,
    Horizontal
}

export enum UIAlign{
    Center,
    Left,
    Right
}

export enum UIPosition{
    Default,
    Relative,
    Absolute,
}



export class UIObject{
    public parent: UIObject = null;
    public children: UIObject[] = [];
    public isDirty:boolean = true;

    public visible: boolean= false;
    public displayMode: UIDisplayMode = UIDisplayMode.Default;
    public orientation: UIOrientation = UIOrientation.Vertical;

    public color: number[] = RUIStyle.Default.background0;
    public width?:number = null;
    public height?:number = null;
    public flex?:number;


    public position:UIPosition = UIPosition.Default;
    public floatLeft?:number;
    public floatRight?:number;
    public floatTop?:number;
    public floatBottom?:number;

    public _width:number;
    public _height:number;
    public _offsetX:number;
    public _offsetY:number;
    public _calculateX:number;
    public _calculateY:number;

    //calculated flex size;
    public _flexWidth:number;
    public _flexHeight:number;

    public _level: number;

    public _canvas: RUICanvas;

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

        if(this._canvas != null){
            ui.setCanvas(this._canvas);
        }
        

        ui.isDirty= true;
        this.isDirty = true;
    }

    public removeChild(ui:UIObject){
        if(ui == null) return;

        let index = this.children.indexOf(ui);
        if(index < 0 )return;

        this.children.splice(index,1);
        ui.parent = null;
        ui.setCanvas(null);
        this.isDirty= true;
    }

    public setCanvas(canvas:RUICanvas){
        this.execRecursive((u)=>u._canvas = canvas);
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

    public onMouseEnter(e:RUIEvent){
    }
    public onMouseLeave(e:RUIEvent){
    }
    public onMouseDown(e:RUIEvent){
    }
    public onMouseUp(e:RUIEvent){}

    public onMouseClick(e:RUIMouseEvent){

    }

    public onMouseDrag(e:RUIMouseDragEvent){

    } 

    public onActive(){}
    public onInactive(){}

    public onDraw(cmd:RUIDrawCall){
        
    }

    public onDrawLate(cmd:RUIDrawCall){
        
    }

    public rectContains(x:number,y:number):boolean{
        if(x < this._calculateX || x > this._calculateX +this._width) return false;
        if(y < this._calculateY || y > this._calculateY + this._height) return false;
        return true;
    }

    public setDirty(isdirty:boolean){
        if(!isdirty){
            this.isDirty = false;
        }
        else{
            this.isDirty = true;
            if(this.parent != null) this.parent.bubbleDirty();
        }
    }

    private bubbleDirty(){
        if(this.parent == null){
            this.isDirty =true;
        }
        else{
            this.parent.bubbleDirty();
        }
    }

    
}

export class UIDiv extends UIObject{

}
