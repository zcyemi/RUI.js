import { RUICmdList } from "./RUICmdList";
import { UIUtil } from "./UIUtil";
import { RUIStyle } from "./RUIStyle";



export const RUIAuto: number= -1;


export type RUIRect = number[];



export class RUIConst{
    public static readonly TOP:number = 0;
    public static readonly RIGHT:number = 1;
    public static readonly BOTTOM:number = 2;
    public static readonly LEFT: number = 3;
}

type RUISize = number;

export enum RUIPosition{
    Default,
    Relative,
    Absolute,
    Offset
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
    public left: RUISize;
    public right: RUISize;
    public top: RUISize;
    public bottom:RUISize;

    public visible: boolean = false;
    public zorder: number = 0;
    public flex: number | null;

    public parent: RUIObject = null;

    public id:string;
    public isdirty: boolean = true;

    public _calwidth?: number;
    public _calheight?:number;
    public _caloffsetx:number = 0;
    public _caloffsety:number = 0;
    public _calx:number;
    public _caly:number;

    protected _rect :RUIRect;

    public _root :RUIRoot;

    public _resized:boolean = false;

    public onBuild(){

    }

    public onDraw(cmd:RUICmdList){

    }

    public set width(val:RUISize){
        this._width = val;
        this._resized = true;
    }

    public get width():RUISize{
        return this._width;
    }

    public set height(val:RUISize){
        this._height = val;
        this._resized = true;
    }
    public get height():RUISize{
        return this._height;
    }

    public onLayout(){
        let isRoot = this.isRoot;

        if(!this._resized){
            if(this._calwidth == null) throw new Error();
            if(this._calheight == null) throw new Error();
            return;
        }
        if(this.width != RUIAuto){
            this._calwidth = this.width;
        }
        else{
            if(isRoot){
                throw new Error();
            }
            else{
                this._calwidth = this.minwidth;
            }
        }

        if(this.height != RUIAuto){
            this._calheight = this.height;
        }
        else{
            if(isRoot){
                throw new Error();
            }
            else{
                this._calheight = this.minheight;
            }
        }
        this._resized = false;
    }

    public get isRoot():boolean{
        return this._root.root === this;
    }

    public setDirty(){
        this.isdirty =true;
        let root = this._root;
        if(root == null){
            throw new Error("setDirty must be called in hierachied uiobject.");
        }
        root.isdirty = true;
    }

}

export class RUIContainer extends RUIObject{
    public boxClip: boolean = true;
    public boxOverflow: RUIOverflow = RUIOverflow.Clip;
    public boxOrientation: RUIOrientation = RUIOrientation.Vertical;

    public children: RUIObject[] = [];


    public addChild(ui:RUIObject){
        if(ui == null) return;
        let c = this.children;
        if(c.indexOf(ui)>=0) return;

        ui.parent =this;
        ui._root = this._root;
        c.push(ui);

        ui.setDirty();
    }

    public removeChild(ui:RUIObject){
        if(ui == null) return;
        let c = this.children;
        let index= c.indexOf(ui);
        if(index <0) return;
        this.children = c.splice(index,1);

        this.isdirty =true;
        ui.parent = null;
        ui._root = null;
    }

    public onLayout(){

        let isVertical = this.boxOrientation == RUIOrientation.Vertical;

        let children = this.children;

        let offset = 0;
        let maxsize = 0;

        let offsetside = 0;

        //padding
        let padding = this.padding;
            offset += padding[isVertical? RUIConst.TOP : RUIConst.LEFT];
            offsetside = padding[isVertical? RUIConst.LEFT: RUIConst.TOP];

        //margin
        let marginLast = 0;

        if(children.length != 0){
            for(var i=0,len = children.length;i<len;i++){
                let c= children[i];

                c.onLayout();

                let cw = c._calwidth;
                let ch = c._calheight;
                if(cw == null) throw new Error("children width is null");
                if(ch == null) throw new Error("children height is null");

                let cmargin = c.margin;
                if(isVertical){
                    marginLast = Math.max(marginLast, cmargin[RUIConst.TOP]);

                    c._caloffsety = offset + marginLast;
                    c._caloffsetx = offsetside + cmargin[RUIConst.LEFT];
                    offset += ch + marginLast;
                    marginLast = cmargin[RUIConst.BOTTOM];
                    maxsize = Math.max(maxsize,cw + cmargin[RUIConst.LEFT]+ cmargin[RUIConst.RIGHT]);
                }
                else{
                    marginLast = Math.max(marginLast,cmargin[RUIConst.LEFT]);

                    c._caloffsetx = offset + marginLast;
                    c._caloffsety = offsetside + cmargin[RUIConst.TOP];
                    
                    offset +=cw + marginLast;
                    marginLast = cmargin[RUIConst.RIGHT];
                    maxsize = Math.max(maxsize,ch+ cmargin[RUIConst.TOP] + cmargin[RUIConst.BOTTOM]);
                }
            }
            
            offset += marginLast;
        }
        else{

        }

        if(isVertical){
            this._calwidth = maxsize + padding[RUIConst.RIGHT] + padding[RUIConst.LEFT];
            this._calheight = offset +padding[RUIConst.BOTTOM];
        }
        else{
            this._calheight = maxsize + padding[RUIConst.BOTTOM] + padding[RUIConst.TOP];
            this._calwidth = offset + padding[RUIConst.RIGHT];
        }

        if(this.width != RUIAuto) this._calwidth = this.width;
        if(this.height != RUIAuto) this._calheight = this.height;
    }


    public onDraw(cmd:RUICmdList){
        this.onDrawPre(cmd);

        let children= this.children;
        for(var i=0,clen = children.length;i<clen;i++){
            let c=  children[i];
            c.onDraw(cmd);
        }

        this.onDrawPost(cmd);
    }

    public onDrawPre(cmd:RUICmdList){

        let rect =[this._calx,this._caly,this._calwidth,this._calheight];
        this._rect = rect;
        if(this.boxClip) cmd.PushClipRect(rect);

        cmd.DrawBorder(rect,RUIStyle.Default.primary);

    }

    public onDrawPost(cmd:RUICmdList){
        if(this.boxClip) cmd.PopClipRect();
    }
}

export class RUIFlexContainer extends RUIContainer{


    public onLayout(){

      

    }
}

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = true;

    public constructor(ui:RUIObject){
        if(ui.parent != null) throw new Error("root ui must have no parent.");

        this.root = ui;
        ui._root = this;
    }

    public resizeRoot(width:number,height:number){
        this.isdirty =true;
        this.root.width = width;
        this.root.height = height;
    }
}

export class RUIRectangle extends RUIObject{


    public onDraw(cmd:RUICmdList){
        let rect = [this._calx,this._caly,this._calwidth,this._calheight];
        cmd.DrawRectWithColor(rect,UIUtil.RandomColor());
    }
}

export class RUILayouter{

    public build(uiroot: RUIRoot){

        let isdirty = uiroot.isdirty;
        if(!isdirty) return;

        //Layout
        let ui = uiroot.root;
        ui.onLayout();
        uiroot.isdirty = false;
        

        ui._calx = 0;
        ui._caly = 0;

        //Calculate All offset
        if(ui instanceof RUIContainer){
            this.calculateOffset(ui);
        }

        console.log(ui);
    }

    private calculateOffset(cui:RUIContainer){

        let children = cui.children;
        let clen = children.length;

        let isVertical = cui.boxOrientation == RUIOrientation.Vertical;

        if(clen > 0){

            let offx = cui._calx;
            let offy = cui._caly;

            for(var i=0;i<clen;i++){
                var c= children[i];

                c._calx = offx + c._caloffsetx;
                c._caly = offy + c._caloffsety;

                if(c instanceof RUIContainer){
                    this.calculateOffset(c);
                }
            }
        }
    }


}