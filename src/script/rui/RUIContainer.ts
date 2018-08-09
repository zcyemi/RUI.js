import { RUIObject, RUIOverflow, RUIOrientation, RUIConst, RUIAuto, RUIPosition, ROUND, RUIRect } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { RUIStyle } from "./RUIStyle";
import { UIUtil } from "./UIUtil";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIWheelEvent } from "./EventSystem";


export enum RUIContainerUpdateMode{
    None,
    LayoutUpdate,
    LayoutFull,
}


export enum RUIContainerClipType{
    NoClip,
    Clip, /** Nesting clip */
    ClipSelf,
}

export class RUIContainer extends RUIObject {
    public boxClip: RUIContainerClipType = RUIContainerClipType.Clip;
    public boxOverflow: RUIOverflow = RUIOverflow.Clip;
    public boxOrientation: RUIOrientation = RUIOrientation.Vertical;

    public children: RUIObject[] = [];

    /** mark execute for children ui of @function traversal */
    public skipChildTraversal: boolean = false;

    public onBuild(){

    }


    public addChild(ui: RUIObject) {
        if (ui == null){
            console.warn('can not add undefined child');
            return;
        }
        let c = this.children;
        if (c.indexOf(ui) >= 0) {
            console.warn('skip add child');
            return;
        }

        ui.parent = this;
        ui._root = this._root;
        c.push(ui);

        ui.setDirty();
    }

    public removeChild(ui: RUIObject) {
        if (ui == null) return;
        let c = this.children;
        let index = c.indexOf(ui);
        if (index < 0) return;
        this.children = c.splice(index, 1);

        this.isdirty = true;
        ui.parent = null;
        ui._root = null;
    }

    protected containerUpdateCheck(): RUIContainerUpdateMode{
        if(!this.isdirty && !this._resized){

            let children = this.children;
            let cisdirty = false;
            let cisresize = false;

            for(var i=0,clen=children.length;i<clen;i++){
                let c = children[i];
                if( c.isdirty){
                    cisdirty = true;
                }
                if(c._resized){
                    cisresize = true;
                }
            }

            if(!cisdirty && !cisresize){
                return RUIContainerUpdateMode.None;
            }
            if(!cisresize && cisdirty){
                return RUIContainerUpdateMode.LayoutUpdate;
            }
        }
        return RUIContainerUpdateMode.LayoutFull;
    }

    public onLayout() {

        if(this._debugname == "dwdw"){
            console.log(">");
        }

        let isVertical = this.boxOrientation == RUIOrientation.Vertical;

        let children = this.children;


        //check for dirty
        let updateMode = this.containerUpdateCheck();
        if(updateMode == RUIContainerUpdateMode.None) return;
        if(updateMode == RUIContainerUpdateMode.LayoutUpdate){
            for(var i=0,clen = children.length;i<clen;i++){
                children[i].onLayout();
            }
            return;
        }

        let offset = 0;
        let maxsize = 0;

        let offsetside = 0;

        //padding
        let padding = this.padding;
        offset += padding[isVertical ? RUIConst.TOP : RUIConst.LEFT];
        offsetside = padding[isVertical ? RUIConst.LEFT : RUIConst.TOP];

        //margin
        let marginLast = 0;

        let relativeChildren: RUIObject[] = [];

        if (children.length != 0) {

            for (var i = 0, len = children.length; i < len; i++) {
                let c = children[i];

                if (c.isOnFlow == false) {
                    relativeChildren.push(c);
                    continue;
                }

                c.onLayout();

                let cw = c._calwidth;
                let ch = c._calheight;
                if (cw == null){
                    console.error(c);
                    throw new Error("children width is null");
                }
                if (ch == null){
                    console.error(c);
                    throw new Error("children height is null");
                }

                let cmargin = c.margin;
                if (isVertical) {
                    marginLast = Math.max(marginLast, cmargin[RUIConst.TOP]);

                    c._caloffsety = offset + marginLast;
                    c._caloffsetx = offsetside + cmargin[RUIConst.LEFT];
                    offset += ch + marginLast;
                    marginLast = cmargin[RUIConst.BOTTOM];
                    maxsize = Math.max(maxsize, cw + cmargin[RUIConst.LEFT] + cmargin[RUIConst.RIGHT]);
                }
                else {
                    marginLast = Math.max(marginLast, cmargin[RUIConst.LEFT]);

                    c._caloffsetx = offset + marginLast;
                    c._caloffsety = offsetside + cmargin[RUIConst.TOP];
                    offset += cw + marginLast;
                    marginLast = cmargin[RUIConst.RIGHT];
                    maxsize = Math.max(maxsize, ch + cmargin[RUIConst.TOP] + cmargin[RUIConst.BOTTOM]);
                }

                c.fillPositionOffset();
            }

            offset += marginLast;
        }
        else {
        }

        let isRelative = (this.position == RUIPosition.Relative || this.position == RUIPosition.Absolute);

        if(!isRelative){
            if (isVertical) {
                this._calwidth = maxsize + padding[RUIConst.RIGHT] + padding[RUIConst.LEFT];
                this._calheight = offset + padding[RUIConst.BOTTOM];
            }
            else {
                this._calheight = maxsize + padding[RUIConst.BOTTOM] + padding[RUIConst.TOP];
                this._calwidth = offset + padding[RUIConst.RIGHT];
            }
    
            if (this.width != RUIAuto) this._calwidth = this.width;
            if (this.height != RUIAuto) this._calheight = this.height;
        }

        //process relative children
        this.onLayoutRelativeUI(relativeChildren);

        this.isdirty = false;
        this._resized = false;
    }

    protected onLayoutRelativeUI(ui: RUIObject[]) {
        if (ui.length == 0) return;
        let pWdith = this._calwidth;
        let pHeight = this._calheight;

        let root = this._root.root;

        let rWidth = root._calwidth;
        let rHeight = root._calheight;

        for (var i = 0, clen = ui.length; i < clen; i++) {

            let c = ui[i];

            let isrelative = c.position == RUIPosition.Relative;
            let cpw = isrelative ? pWdith : rWidth;
            let cph = isrelative ? pHeight : rHeight;

            let cleft = c.left;
            let cright = c.right;
            let ctop = c.top;
            let cbottom = c.bottom;
            
            let cwidth = c.width;
            let cheight = c.height;

            let constraintHori = cleft != RUIAuto && c.right != RUIAuto;
            let constraintVert = ctop != RUIAuto && c.bottom != RUIAuto;

            if (constraintHori) {
                c._caloffsetx = cleft;
                c._calwidth = cpw - cleft - cright;
            }
            else {
                if (cwidth != RUIAuto) {
                    c._calwidth = cwidth;
                    if (cleft != RUIAuto) {
                        c._caloffsetx = cleft;
                    }
                    else if (cright != RUIAuto) {
                        c._caloffsetx = cpw - cright - cwidth;
                    }
                    else {
                        c._caloffsetx = ROUND((cpw - c._calwidth) / 2);
                    }
                }
                else {
                    console.error(c);
                    throw new Error("relative ui have invalid horizontal constraint.");
                }
            }

            if (constraintVert) {
                c._caloffsety = ctop;
                c._calheight = cph - ctop - cbottom;
            }
            else {
                
                if (c.height != RUIAuto) {
                    c._calheight = cheight;
                    if (ctop != RUIAuto) {
                        c._caloffsety = ctop;
                    }
                    else if (cbottom != RUIAuto) {
                        c._caloffsety = cph - cbottom - cheight;
                    }
                    else {
                        c._caloffsety = ROUND((cph - c._calheight) / 2);
                    }
                } else {
                    throw new Error("relative ui have invalid vertical constraint.");
                }
            }

        

            c.onLayout();

            c.fillPositionOffset();
        }
    }


    public onDraw(cmd: RUICmdList) {


        this.onDrawPre(cmd);

        let children = this.children;
        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            c.onDraw(cmd);
        }

        this.onDrawPost(cmd);
    }

    public onDrawPre(cmd: RUICmdList) {

        let rect = [this._calx, this._caly, this._calwidth, this._calheight];
        this._rect = rect;
        cmd.DrawBorder(rect, RUIStyle.Default.primary);
        let cliprect = this.RectMinusePadding(rect, this.padding);

        let boxclip = this.boxClip;
        if (boxclip != RUIContainerClipType.NoClip) cmd.PushClipRect(cliprect,boxclip == RUIContainerClipType.Clip);
    }

    public onDrawPost(cmd: RUICmdList) {
        if (this.boxClip != RUIContainerClipType.NoClip) cmd.PopClipRect();
    }

    protected RectMinusePadding(recta: RUIRect, offset: number[]): RUIRect {

        let pleft = offset[3];
        let ptop = offset[0]

        return [
            recta[0] + pleft,
            recta[1] + ptop,
            recta[2] - offset[2] - pleft,
            recta[3] - offset[3] - ptop
        ];
    }

    public setRoot(root: RUIRoot){
        if(this._root == root) return;

        this._root = root;

        let children =this.children;
        for(var i=0,clen=children.length;i<clen;i++){
            let c = children[i];
            if(c instanceof RUIContainer){
                c.setRoot(root);
            }
            else{
                c._root = root;
            }
        }
    }

    public onMouseWheel(e:RUIWheelEvent){

    }

    public traversal(f:(c:RUIObject)=>void){

        if(f == null)return;
        f(this);
        if(this.skipChildTraversal)return;
        let children = this.children;
        for(var i=0,clen = children.length;i<clen;i++){
            let c = children[i];
            if(c instanceof RUIContainer){
                c.traversal(f);
            }
            else{
                f(c);
            }
        }
    }
}
