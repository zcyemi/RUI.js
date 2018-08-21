import { RUIRoot } from "./RUIRoot";
import { RUICmdList } from "./RUICmdList";
import { RUIMouseEvent, RUIMouseDragEvent } from "./RUIEvent";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIContainer } from "./RUIContainer";
import { RUI, RUILayouter, RUIVal, RUILayoutData } from "./RUI";
import { RUIDefaultLayouter } from "./RUIDefaultLayouter";

export const RUIAuto: number= -Infinity;

export type RUIRect = number[];
export type RUIRectP = number[];
export const RUICLIP_MAX = [0,0,5000,5000];
export const RUICLIP_NULL = null;


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

    public maxwidth: RUISize = RUIAuto;
    public maxheight: RUISize = RUIAuto;
    public minwidth:RUISize = 70;
    public minheight:RUISize = 23;
    public margin : number[] = [0,0,0,0];    // top right bottom left
    public padding: number[] = [0,0,0,0]; 

    public position : RUIPosition = RUIPosition.Default;

    public left: RUISize = RUIAuto;
    public right: RUISize = RUIAuto;
    public top: RUISize = RUIAuto;
    public bottom:RUISize = RUIAuto;

    public visible: boolean = true;
    public zorder: number = 0;
    public flex?: number;

    public parent: RUIContainer = null;
    public id:string;
    public isdirty: boolean = true;
    public isClip: boolean = true;
    public enabled:boolean = true;

    public _enabled:boolean = true;
    public _level:number = 0;
    public _order:number =0;

    protected _rect :RUIRect;
    public _drawClipRect:RUIRect;

    public _root :RUIRoot;
    public _resized:boolean = true;
    public _debugname:string;

    /* Refactoring Start*/
    public rWidth?:RUIVal =RUIAuto;
    public rHeight?:RUIVal = RUIAuto;

    //Layouter
    public layouter: RUILayouter = RUIDefaultLayouter.Layouter;
    public layoutWidth?:RUIVal;
    public layoutHeight?:RUIVal;

    public rCalWidth:number;
    public rCalHeight:number;
    public rOffx:number =0;
    public rOffy:number =0;

    public rCalx:number = 0;
    public rCaly:number = 0;

    public clipMask:RUIRect = RUICLIP_MAX;


    public Layout(){
        this.layoutWidth = null;
        this.layoutHeight = null;
        this.layouter.Layout(this);
        if(Number.isNaN(this.layoutWidth) || Number.isNaN(this.layoutHeight)){
            console.error(this);
            throw new Error('layout data is NaN');
        }
    }
    public LayoutPost(data:RUILayoutData){
        if(data == null) throw new Error('layout data is null!');
        data.verify();
        this.layouter.LayoutPost(this,data);
    }

    public Update(){

    }

    //Layouter end

    /* Refactoring end */

    public onDraw(cmd:RUICmdList){
        let rect = this.calculateRect();
        this._rect = rect;
        let cliprect = RUI.RectClip(rect,this.clipMask);

        this._drawClipRect = cliprect;
    }

    public set width(val:RUISize){
        if(val != this.rWidth){
            this.rWidth = val;
            this._resized = true;
        }
        
    }

    public get width():RUISize{
        return this.rWidth;
    }

    public set height(val:RUISize){
        if(val != this.rHeight){
            this.rHeight = val;
            this._resized = true;
        }
    }
    public get height():RUISize{
        return this.rHeight;
    }

    public get isRoot():boolean{
        return this._root.root === this;
    }

    public get isOnFlow(): boolean{
        let pos = this.position;
        return (pos == RUIPosition.Default || pos == RUIPosition.Offset);
    }

    public get isPositionOffset():boolean{
        return this.position == RUIPosition.Offset;
    }

    public get positionOffsetX():number{
        let coffx = this.left;
        if(coffx == RUIAuto) return 0;
        return coffx;
    }
    public get positionOffsetY():number{
        let coffy = this.top;
        if(coffy == RUIAuto)return 0;
        return coffy;
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

    public calculateRect(cliprect?:RUIRect):RUIRect{
        if(this.rCalWidth == RUIAuto || this.rCalHeight == RUIAuto){
            console.error(this);
            throw new Error('calculated size is auto!');
        }
        //let rect =  [this._calx,this._caly,this._calwidth,this._calheight];
        let rect = [this.rCalx,this.rCaly,this.rCalWidth,this.rCalHeight];
        if(cliprect != null){
            return RUI.RectClip(rect,cliprect);
        }
        return rect;
    }

    public rectContains(x:number,y:number):boolean{
        let rect = this._drawClipRect;

        if(rect == null) return false;
        let calx = rect[0];
        let caly = rect[1];

        if(x < calx || x > calx + rect[2]) return false;
        if(y < caly || y > caly + rect[3]) return false;
        return true;
    }

}
