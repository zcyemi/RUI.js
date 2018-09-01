import { RUIRoot } from "./RUIRoot";
import { RUICmdList } from "./RUICmdList";
import { RUIMouseEvent, RUIMouseDragEvent, RUIKeyboardEvent } from "./RUIEvent";
import { RUIContainer } from "./RUIContainer";
import { RUIUtil, ROUND } from "./RUIUtil";
import { RUIRect, RUIAuto, RUIPosition, RUICLIP_MAX } from "./RUIDefine";


export class RUIObject{

    public maxwidth: number = RUIAuto;
    public maxheight: number = RUIAuto;
    public minwidth:number = 70;
    public minheight:number = 23;
    public margin : number[] = [0,0,0,0];    // top right bottom left
    public padding: number[] = [0,0,0,0]; 

    public position : RUIPosition = RUIPosition.Default;

    public left: number = RUIAuto;
    public right: number = RUIAuto;
    public top: number = RUIAuto;
    public bottom:number = RUIAuto;

    public visible: boolean = true;
    public zorder: number = 0;
    public flex?: number;

    public parent: RUIContainer = null;
    public id:string;
    public isdirty: boolean = true;
    public isClip: boolean = true;

    private _enable:boolean = true;
    public _level:number = 0;
    public _order:number =0;
    public _finalOrder:number =0;
    private _layer?:number = null;
    public calLayer:number = 0;

    protected _rect :RUIRect;
    public _drawClipRect:RUIRect;

    public _root :RUIRoot;
    public _resized:boolean = true;
    public _debugname:string;

    /* Refactoring Start*/
    public rWidth?:number =RUIAuto;
    public rHeight?:number = RUIAuto;

    //Layouter
    public layouter: RUILayouter = RUIDefaultLayouter.Layouter;
    public layoutWidth?:number;
    public layoutHeight?:number;

    public rCalWidth:number;
    public rCalHeight:number;
    public rOffx:number =0;
    public rOffy:number =0;

    public rCalx:number = 0;
    public rCaly:number = 0;

    public clipMask:RUIRect = RUICLIP_MAX;

    public responseToMouseEvent:boolean = true;


    public Layout(){
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

        this.isdirty =false;
        this._resized = false;
    }

    public Update(){

    }

    //Layouter end

    /* Refactoring end */

    public onDraw(cmd:RUICmdList){
        let rect = this.calculateRect();
        this._rect = rect;
        let cliprect = RUIUtil.RectClip(rect,this.clipMask);

        this._drawClipRect = cliprect;
    }

    public set width(val:number){
        if(val != this.rWidth){
            this.rWidth = val;
            this._resized = true;
        }
        
    }

    public get width():number{
        return this.rWidth;
    }

    public set height(val:number){
        if(val != this.rHeight){
            this.rHeight = val;
            this._resized = true;
        }
    }
    public get height():number{
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

    public get enable(){
        return this._enable;
    }

    public set enable(val:boolean){
        if(this._enable == val) return;
        this._enable = val;
        this.setDirty();
    }

    public get layer():number{
        return this._layer;
    }

    public set layer(val:number){
        this._layer = val;
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
    public onMouseEnter(ontop?:boolean){}
    public onMouseClick(e:RUIMouseEvent){}
    public onMouseDrag(e:RUIMouseDragEvent){}
    public onKeyPress(e:RUIKeyboardEvent){}

    public calculateRect(cliprect?:RUIRect):RUIRect{
        if(this.rCalWidth == RUIAuto || this.rCalHeight == RUIAuto){
            console.error(this);
            throw new Error('calculated size is auto!');
        }
        //let rect =  [this._calx,this._caly,this._calwidth,this._calheight];
        let rect = [this.rCalx,this.rCaly,this.rCalWidth,this.rCalHeight];
        if(cliprect != null){
            return RUIUtil.RectClip(rect,cliprect);
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


export class RUIDefaultLayouter implements RUILayouter {

    private static s_layouter = new RUIDefaultLayouter();
    public static get Layouter(): RUIDefaultLayouter {
        return this.s_layouter;
    }


    public Layout(ui: RUIObject) {

        ui.layoutWidth = ui.rWidth;
        ui.layoutHeight = ui.rHeight;

    }

    public LayoutPost(ui: RUIObject, data: RUILayoutData) {

        if (data.flexWidth != null) {
            ui.rCalWidth = data.flexWidth;
        }
        else {
            if (ui.layoutWidth == RUIAuto) {
                ui.rCalWidth = data.containerWidth;
            }
            else {
                ui.rCalWidth = ui.layoutWidth;
            }
        }

        if (data.flexHeight != null) {
            ui.rCalHeight = data.flexHeight;
        }
        else {
            if (ui.layoutHeight == RUIAuto) {
                ui.rCalHeight = data.containerHeight;
            }
            else {
                ui.rCalHeight = ui.layoutHeight;
            }
        }


    }

    public static LayoutRelative(c: RUIObject, cpw: number, cph: number) {


        let cleft = c.left;
        let cright = c.right;
        let ctop = c.top;
        let cbottom = c.bottom;

        let constraintHori = cleft != RUIAuto && cright != RUIAuto;
        let constraintVert = ctop != RUIAuto && cbottom != RUIAuto;

        let cwidth = RUIAuto;
        let cheight = RUIAuto;

        let coffx = cleft;
        let coffy = ctop;

        c.Layout();

        if (constraintHori) {
            cwidth = Math.max(0, cpw - cleft - cright);
        }
        else {
            if (c.layoutWidth != RUIAuto) {
                cwidth = c.layoutWidth;
                if (cleft != RUIAuto) {

                }
                else if (cright != RUIAuto) {
                    coffx = cpw - cright - cwidth;
                }
                else {
                    coffx = ROUND((cpw - cwidth) / 2);
                }
            }
            else {
                // console.error(c);
                // throw new Error();
                coffx = cleft;
            }
        }

        if (constraintVert) {
            cheight = Math.max(0, cph - ctop - cbottom);
        }
        else {
            if (c.layoutHeight != RUIAuto) {
                cheight = c.layoutHeight;
                if (ctop != RUIAuto) {
                }
                else if (cbottom != RUIAuto) {
                    coffy = cph - cbottom - cheight;
                }
                else {
                    coffy = ROUND((cph - cheight) / 2);
                }
            } else {
                // console.error(c);
                // throw new Error();
                coffy  =ctop;
            }
        }

        let data = new RUILayoutData();
        data.flexWidth = cwidth;
        data.flexHeight = cheight;
        data.containerWidth = cpw;
        data.containerHeight = cph;

        c.LayoutPost(data);
        // c.rCalWidth = cwidth;
        // c.rCalHeight = cheight;
        c.rOffx = coffx;
        c.rOffy = coffy;
    }
}

export interface RUILayouter{

    /**
     * calculate ui.LayoutWidth ui.LayoutHeight
     * @param ui Target UI object.
     */
    Layout(ui:RUIObject);
    LayoutPost(ui:RUIObject,data:RUILayoutData);
}

export class RUILayoutData{

    /** should not be RUIAuto */
    public containerWidth:number;
    /** should not be RUIAuto */
    public containerHeight:number;
    public containerPadding: number[];


    public flexWidth?:number;
    public flexHeight?:number;

    public verify(){
        if(Number.isNaN(this.containerWidth)) throw new Error('container width is NaN');
        if(Number.isNaN(this.containerHeight)) throw new Error('container height is NaN');
        if(this.containerWidth == RUIAuto || this.containerHeight == RUIAuto) throw new Error('coantiner size can not be RUIAuto'); 
    }
}