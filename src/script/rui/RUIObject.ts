import { RUIRoot } from "./RUIRoot";
import { RUICmdList } from "./RUICmdList";
import { RUIMouseEvent, RUIMouseDragEvent } from "./RUIEvent";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIContainer } from "./RUIContainer";
import { RUI, RUILayouter, RUIVal, RUILayoutData } from "./RUI";
import { RUIDefaultLayouter } from "./RUIDefaultLayouter";

export const RUIAuto: number= -1;

export type RUIRect = number[];
export type RUIRectP = number[];
export const RUICLIP_MAX = [0,0,5000,5000];


export function ROUND(x:number){
    return Math.round(x);
}

export function CLAMP(val:number,min:number,max:number){
    return Math.min(Math.max(min, val), max);
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

    public visible: boolean = true;
    public zorder: number = 0;
    public _level:number = 0;
    public flex?: number;

    public parent: RUIObject = null;

    public id:string;
    public isdirty: boolean = true;
    public isClip: boolean = true;
    public enabled:boolean = true;
    public _enabled:boolean = true;


    public _calwidth?: number;
    public _calheight?:number;
    public _caloffsetx:number = 0;
    public _caloffsety:number = 0;
    public _calx:number = 0;
    public _caly:number = 0;

    public _flexwidth?:number;
    public _flexheight?:number;

    protected _rect :RUIRect;
    protected _rectclip: RUIRect;

    public _root :RUIRoot;

    public _resized:boolean = true;

    public _debugname:string;


    /* Refactoring Start*/

    public rWith:RUIVal = RUIVal.Auto;
    public rHeight:RUIVal = RUIVal.Auto;

    //Layouter
    public layouter: RUILayouter = RUIDefaultLayouter.Layouter;
    public layoutWidth: RUIVal;
    public layoutHeight:RUIVal;

    public rCalWidth:number;
    public rCalHeight:number;
    public rOffx:number =0;
    public rOffy:number =0;

    public Layout(){
        this.layouter.Layout(this);
    }
    public LayoutPost(data:RUILayoutData){
        this.layouter.LayoutPost(this,data);
    }

    //Layouter end

    /* Refactoring end */

    public onDraw(cmd:RUICmdList){
    }

    public set width(val:RUISize){
        if(val != this._width){
            this._width = val;
            this._resized = true;
        }

        if(val != this.rWith.value){
            this.rWith = (val == RUIAuto? RUIVal.Auto : new RUIVal(val));
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

        if(val != this.rHeight.value){
            this.rHeight = (val == RUIAuto? RUIVal.Auto : new RUIVal(val));
        }
    }
    public get height():RUISize{
        return this._height;
    }

    public onLayoutPre(){
        if(this.enabled != this._enabled){
            this._enabled = this.enabled;
            this.setDirty(true);
        }
    }

    public onLayout(){
        if(this._root == null){
            console.error(this);
            throw new Error('ui root is null');
        }
        let isRoot = this.isRoot;
        this.isdirty = false;

        if(!this._resized){

            let calw = this._calwidth;
            let calh = this._calheight;
            if(calw == null) throw new Error();
            if(calh == null) throw new Error();

            if(this._flexheight == calh && this._flexwidth == calw){
                return;
            }
        }

        this.fillSize();

        if(this._calheight == RUIAuto) this._calheight = this.minheight;

        this._resized = false;
    }


    public onLayoutPost(){

    }

    public get isRoot():boolean{
        return this._root.root === this;
    }

    public get isOnFlow(): boolean{
        let pos = this.position;
        return (pos == RUIPosition.Default || pos == RUIPosition.Offset);
    }

    public setRoot(root:RUIRoot){
        this._root = root;
    }

    public setDirty(resize:boolean = false){
        this.isdirty =true;
        let root = this._root;
        if(root != null){
            root.isdirty =true;
        }

        if(this.parent != null){
            this.parent.popupDirty();
        }

        if(resize) this._resized = true;
    }

    private popupDirty(){
        this.isdirty = true;
        if(this.parent != null) this.parent.popupDirty();
    }


    public onMouseDown(e:RUIMouseEvent){}
    public onMouseUp(e:RUIMouseEvent){}
    public onActive(){}
    public onInactive(){}
    public onMouseLeave(){}
    public onMouseEnter(){}
    public onMouseClick(e:RUIMouseEvent){}
    public onMouseDrag(e:RUIMouseDragEvent){}

    protected fillSize(){


        this._calwidth= null;
        this._calheight = null;

        if(this._flexwidth != null) this._calwidth = this._flexwidth;
        if(this._flexheight != null) this._calheight = this._flexheight;

        let parent = this.parent;
        let parentWidth = parent.width;
        if(this._calwidth == null){
            if(this.width== RUIAuto){
                if(parent == null){
                    throw new Error();
                }
                else{
                    if(parentWidth != RUIAuto){
                        if(parent.padding == null){
                            this._calwidth = parentWidth;
                        }
                        else{
                            let parentPadding = parent.padding;
                            this._calwidth = parentWidth - parentPadding[1] - parentPadding[3];
                        }
                        
                    }
                }
            }
            else{
                this._calwidth= this.width;
            }
        }
        
        if(this._calheight == null){
            if(this.height == RUIAuto){
                if(parent == null){
                    throw new Error();
                }
                else{
                    this._calheight = RUIAuto;
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

    public calculateRect(cliprect?:RUIRect):RUIRect{
        //let rect =  [this._calx,this._caly,this._calwidth,this._calheight];
        let rect = [this._calx,this._caly,this.rCalWidth,this.rCalHeight];
        if(cliprect != null){
            return RUI.RectClip(rect,cliprect);
        }
        return rect;
    }

    public rectContains(x:number,y:number):boolean{
        let rect = this._rectclip == null ? this._rect:this._rectclip;

        if(rect == null) return false;
        let calx = rect[0];
        let caly = rect[1];

        if(x < calx || x > calx + rect[2]) return false;
        if(y < caly || y > caly + rect[3]) return false;
        return true;
    }

}
