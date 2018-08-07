import { RUIRoot } from "./RUIRoot";
import { RUICmdList } from "./RUICmdList";
import { RUIMouseEvent } from "./EventSystem";

export const RUIAuto: number= -1;

export type RUIRect = number[];
export const RUICLIP_MAX = [0,0,5000,5000];


export function ROUND(x:number){
    return Math.round(x);
}


export class RUIConst{
    public static readonly TOP:number = 0;
    public static readonly RIGHT:number = 1;
    public static readonly BOTTOM:number = 2;
    public static readonly LEFT: number = 3;
}

type RUISize = number;

export enum RUIPosition{
    Default = 0,
    Relative = 1,
    Absolute = 2,
    Offset = 3
}

export enum RUIBoxFlow{
    Flow,
    Flex
}

export enum RUIOverflow{
    Clip,
    Scroll
}

export enum RUIOrientation{
    Vertical,
    Horizontal
}

export class RUIObject{

    private _width: RUISize = RUIAuto;
    private _height: RUISize = RUIAuto;

    public maxwidth: RUISize = RUIAuto;
    public maxheight: RUISize = RUIAuto;
    public minwidth:RUISize = 70;
    public minheight:RUISize = 23;
    public margin : number[] = [0,0,0,0];
    // top right bottom left
    public padding: number[] = [0,0,0,0]; 

    public position : RUIPosition = RUIPosition.Default;
    public left: RUISize = RUIAuto;
    public right: RUISize = RUIAuto;
    public top: RUISize = RUIAuto;
    public bottom:RUISize = RUIAuto;

    public visible: boolean = false;
    public zorder: number = 0;
    public _level:number;
    public flex?: number;

    public parent: RUIObject = null;

    public id:string;
    public isdirty: boolean = true;
    public isClip: boolean = true;

    public _calwidth?: number;
    public _calheight?:number;
    public _caloffsetx:number = 0;
    public _caloffsety:number = 0;
    public _calx:number;
    public _caly:number;

    public _flexwidth?:number;
    public _flexheight?:number;

    protected _rect :RUIRect;

    public _root :RUIRoot;

    public _resized:boolean = true;

    public _debugname:string;

    public onBuild(){

    }

    public onDraw(cmd:RUICmdList){
    }

    public set width(val:RUISize){
        if(val != this._width){
            this._width = val;
            this._resized = true;
        }
        
    }

    public get width():RUISize{
        return this._width;
    }

    public set height(val:RUISize){
        if(val != this._height){
            this._height = val;
            this._resized = true;
        }
    }
    public get height():RUISize{
        return this._height;
    }

    public onLayout(){
        let isRoot = this.isRoot;
        this.isdirty = false;

        if(!this._resized){
            if(this._calwidth == null) throw new Error();
            if(this._calheight == null) throw new Error();
            return;
        }

        this.fillSize();

        this._resized = false;
    }

    public get isRoot():boolean{
        return this._root.root === this;
    }

    public get isOnFlow(): boolean{
        let pos = this.position;
        return (pos == RUIPosition.Default || pos == RUIPosition.Offset);
    }

    public setDirty(){
        this.isdirty =true;
        let root = this._root;
        if(root == null){
            throw new Error("setDirty must be called in hierachied uiobject.");
        }
        root.isdirty = true;
    }


    public onMouseDown(e:RUIMouseEvent){}
    public onMouseUp(e:RUIMouseEvent){}
    public onActive(){}
    public onInactive(){}
    public onMouseLeave(){}
    public onMouseEnter(){}

    protected fillSize(){

        this._calwidth= null;
        this._calheight = null;

        if(this._flexwidth != null) this._calwidth = this._flexwidth;
        if(this._flexheight != null) this._calheight = this._flexheight;

        if(this._calwidth == null){
            if(this.width== RUIAuto){
                if(this.parent == null){
                    throw new Error();
                }
            }
            else{
                this._calwidth= this.width;
            }
        }
        
        if(this._calheight == null){
            if(this.height == RUIAuto){
                if(this.parent == null){
                    throw new Error();
                }
            }
            else{
                this._calheight = this.height;
            }
        }
    }

    public fillPositionOffset(){
        if(this.position == RUIPosition.Offset){
            this._caloffsetx += this.left == RUIAuto? 0 : this.left;
            this._caloffsety += this.top == RUIAuto? 0: this.top;
        }
    }

    public rectContains(x:number,y:number){
        let calx = this._calx;
        let caly = this._caly;

        if(x < calx || x > calx +this._calwidth) return false;
        if(y < caly || y > caly + this._calheight) return false;
        return true;
    }

}
