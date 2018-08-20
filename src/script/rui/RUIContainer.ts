import { RUIObject, RUIOverflow, RUIOrientation, RUIConst, RUIAuto, RUIPosition, ROUND, RUIRect } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { RUIStyle } from "./RUIStyle";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIWheelEvent } from "./RUIEvent";
import { RUI, RUILayouter, RUIVal, RUISizePair, RUILayoutData, RUICHECK, SIZE } from "./RUI";
import { RUIDefaultLayouter } from "./RUIDefaultLayouter";


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
    public boxBorder?: number[] = null;
    public boxBackground?:number[] = null;
    public boxSideExtens:boolean = false;

    public boxMatchWidth:boolean = false;
    public boxMatchHeight:boolean = false;

    public children: RUIObject[] = [];

    public layoutSideChildMax?:number;

    /** mark execute for children ui of @function traversal */
    public skipChildTraversal: boolean = false;

    public constructor(){
        super();
        this.layouter= RUIContainerLayouter.Layouter;
    }

    public onBuild(){

    }

    public get isVertical(){
        return this.boxOrientation == RUIOrientation.Vertical;
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
        ui.setRoot(this._root);
        c.push(ui);

        ui.setDirty();
    }

    public hasChild(ui:RUIObject):boolean{
        return this.children.indexOf(ui) >=0;
    }

    public removeChild(ui: RUIObject) {
        if (ui == null) return;
        let c = this.children;
        let index = c.indexOf(ui);
        if (index < 0) return;
        c.splice(index, 1);
        this.setDirty();
        ui.parent = null;
        ui.setRoot(null);
    }

    public removeChildByIndex(index:number):RUIObject{
        let c =this.children;
        if(index <0 || index >= c.length) return null;
        let ui = c[index];
        c.splice(index,1);
        this.setDirty();
        ui.parent = null;
        ui.setRoot(null);
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


    public LayoutRelativeUI(container: RUIContainer, children: RUIObject[]) {

        let root = container._root.root;

        let rw = root.rCalWidth;
        let rh = root.rCalHeight;

        let cw = container.rCalWidth;
        let ch = container.rCalHeight;

        let layoutRelative =RUIDefaultLayouter.LayoutRelative;

        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            if (c.isOnFlow) continue;

            let isrelative = c.position == RUIPosition.Relative;
            if(isrelative){
                layoutRelative(c,cw,ch);
            }
            else{
                layoutRelative(c,rw,rh);
            }
        }

    }


    public onDraw(cmd: RUICmdList) {


        this.onDrawPre(cmd);

        let children = this.children;
        for (var i = 0, clen = children.length; i < clen; i++) {
            let c = children[i];
            if(!c._enabled) continue;
            if(c.visible) c.onDraw(cmd);
        }

        this.onDrawPost(cmd);
    }

    public onDrawPre(cmd: RUICmdList) {

        let boxclip = this.boxClip;


        if(boxclip == RUIContainerClipType.Clip){
            if(cmd.isSkipDraw) return;
        }

        let rect = this.calculateRect()
        this._rect = rect;
        if(this.boxBackground != null) cmd.DrawRectWithColor(rect,this.boxBackground);
        if(this.boxBorder != null) cmd.DrawBorder(rect, this.boxBorder);
        // clip paddingrect/rect
        let paddingrect = rect;// this.RectMinusePadding(rect, this.padding);

        let cliprect = RUI.RectClip(paddingrect,cmd.clipRect);
        this._rectclip = cliprect;


        if (boxclip != RUIContainerClipType.NoClip) {
            cmd.PushClip(paddingrect,cliprect,boxclip);
        }
        else{
            cmd.PushClip(rect,cliprect,boxclip);   
        }
    }

    public onDrawPost(cmd: RUICmdList) {
        if (this.boxClip != RUIContainerClipType.NoClip) cmd.PopClipRect();
    }

    protected RectMinusePadding(recta: RUIRect, offset: number[]): RUIRect {

        let pleft = Math.max(offset[3],0);
        let ptop = Math.max(offset[0],0);

        return [
            recta[0] + pleft,
            recta[1] + ptop,
            recta[2] - Math.max(offset[1],0) - pleft,
            recta[3] - Math.max(offset[2],0) - ptop
        ];
    }

    public setRoot(root: RUIRoot){
        if(this._root == root) return;

        this._root = root;

        let children =this.children;
        for(var i=0,clen=children.length;i<clen;i++){
            let c = children[i];
            c.setRoot(root);
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


export class RUIContainerLayouter implements RUILayouter{

    private static s_layouter = new RUIContainerLayouter();
    public static get Layouter():RUIContainerLayouter{
        return this.s_layouter;
    }

    public Layout(ui:RUIObject){
        let cui = <RUIContainer> ui;
        let children = cui.children;
        let clen = children.length;
        let flowChildren = [];
        for(var i=0;i<clen;i++){
            let c=  children[i];
            if(c.isOnFlow) flowChildren.push(c);
        }
        children = flowChildren;
        clen = children.length;
        let isvertical = cui.isVertical;

        cui.layoutSideChildMax = null;

        let f = (c)=>c.Layout();
        var maxsize = -1;
        if(isvertical && cui.rWidth == RUIAuto){
            f = (c)=>{
                c.Layout();
                let clayoutwidth = c.layoutWidth;
                if(clayoutwidth != RUIAuto) maxsize = Math.max(maxsize,clayoutwidth);
            }
        }
        else if(!isvertical && cui.rHeight == RUIAuto){
            f = (c)=>{
                c.Layout();
                if(c.layoutHeight != RUIAuto) maxsize = Math.max(maxsize,c.layoutHeight);
            }
        }

        for(var i=0;i<clen;i++){
            let c = children[i];
            f(c);
        }

        cui.layoutSideChildMax = maxsize;

        let parent = cui.parent;
        let exten = cui.boxSideExtens && (parent == null ||(parent != null && (<RUIContainer>parent).boxOrientation == cui.boxOrientation ));

        //width
        if(cui.rWidth != RUIAuto){
            cui.layoutWidth = cui.rWidth;
        }
        else{
            //exten
            if(isvertical){
                if(exten){
                    cui.layoutWidth = RUIAuto;
                }
                else{
                    if(maxsize != -1){
                        cui.layoutWidth = maxsize;
                    }
                    else{
                        cui.layoutWidth = RUIAuto;
                    }
                }
            }
            else{
                cui.layoutWidth = RUIAuto;
            }
        }
        //height
        if(cui.rHeight != RUIAuto){
            cui.layoutHeight = cui.rHeight;
        }
        else{
            //exten
            if(isvertical){
                cui.layoutHeight = RUIAuto;
            }
            else{
                if(exten){
                    cui.layoutHeight = RUIAuto;
                }
                else{
                    if(maxsize !=-1){
                        cui.layoutHeight = maxsize;
                    }else{
                        cui.layoutHeight = RUIAuto;
                    }
                }
            }
        }

    }

    public LayoutPost(ui:RUIObject,data:RUILayoutData){

        if(ui.layoutHeight == null){
            console.error(ui);
            throw new Error();
        }

        if(ui.layoutWidth == null){
            throw new Error();
        }

        let cui = <RUIContainer>ui;
        let children = cui.children;
        let clen = children.length;
        let flowChildren = [];
        for(var i=0;i<clen;i++){
            let c=  children[i];
            if(c.isOnFlow) flowChildren.push(c);
        }
        children = flowChildren;


        if(data.containerHeight == null){
            throw new Error();
        }
        if(data.containerWidth == null){
            throw new Error();
        }

        let isFlexWidth = false;
        let isFlexHeight = false;
        

        //Fill flex
        if(data.flexWidth != null){
            cui.layoutWidth =data.flexWidth;
            isFlexWidth = true;
        }
        if(data.flexHeight != null){
            cui.layoutHeight = data.flexHeight;
            isFlexHeight = true;
        }

        //Fill auto

        var isvertical = cui.isVertical;
        
        if(isvertical){
            if(cui.layoutWidth == RUIAuto){
                cui.layoutWidth = data.containerWidth;
            }
        }
        else{
            if(cui.layoutHeight == RUIAuto){
                cui.layoutHeight = data.containerHeight;
            }
        }


        //padding
        let padding = cui.padding;
        var paddingleft = padding[3];
        var paddingtop = padding[0];
        let paddingright = padding[1];
        let paddingbottom = padding[2];

        let paddinghorizontal = paddingleft + paddingright;
        let paddingvertical = paddingtop + paddingbottom;

        //Fixed Size
        if(cui.layoutWidth != RUIAuto && cui.layoutHeight != RUIAuto){
            cui.rCalWidth= cui.layoutWidth;
            cui.rCalHeight = cui.layoutHeight;

            

            let cdata = new RUILayoutData();
            cdata.containerWidth = SIZE(cui.rCalWidth - paddinghorizontal);
            cdata.containerHeight =SIZE(cui.rCalHeight - paddingvertical);

            var accuSize = isvertical? paddingtop : paddingleft;
            children.forEach(c=>{
                c.LayoutPost(cdata);
                if(isvertical){
                    c.rOffx = paddingleft;
                    c.rOffy = accuSize;
                    accuSize+=c.rCalHeight;
                }
                else{
                    c.rOffy = paddingtop;
                    c.rOffx = accuSize;
                    accuSize+= c.rCalWidth;
                }
                
                if(c.isPositionOffset){
                    c.rOffx += c.positionOffsetX;
                    c.rOffy += c.positionOffsetY;
                }
            });

            cui.LayoutRelativeUI(cui,cui.children);

            return;
        }

        //orientation auto
        console.assert((cui.isVertical ? cui.layoutHeight : cui.layoutWidth) == RUIAuto);
        if(cui.isVertical){
            let cdata = new RUILayoutData();
            cdata.containerWidth = SIZE(cui.layoutWidth - paddinghorizontal);
            cdata.containerHeight = SIZE(data.containerHeight -paddingvertical);

            var maxChildWidth = 0;
            var accuChildHeight = paddingtop;
            children.forEach(c=>{
                c.LayoutPost(cdata);
                c.rOffx = paddingleft;
                c.rOffy = accuChildHeight;
                maxChildWidth = Math.max(maxChildWidth,c.rCalWidth);
                accuChildHeight += c.rCalHeight;

                if(c.isPositionOffset){
                    c.rOffx += c.positionOffsetX;
                    c.rOffy += c.positionOffsetY;
                }
            });

            if(!isFlexWidth){
                if(cui.layoutWidth == cui.width || cui.boxMatchWidth){
                    cui.rCalWidth = cui.layoutWidth;
                }
                else{
    
                    let paddinghorizontalFixed = SIZE(paddingleft) + SIZE(paddingright);
    
                    if(cui.boxSideExtens){
                    
                        if(maxChildWidth < data.containerWidth){
                            cui.rCalWidth = data.containerWidth;
                        }
                        else{
                            cui.rCalWidth = maxChildWidth + paddinghorizontalFixed;
                        }
                    }
                    else{
                        cui.rCalWidth = maxChildWidth + paddinghorizontalFixed;
                    }
                }
            }
            else{
                cui.rCalWidth = cui.layoutWidth;
            }
            if(!isFlexHeight){
                cui.rCalHeight = accuChildHeight - paddingtop + SIZE(paddingtop) + SIZE(paddingbottom);
            }
            else{
                cui.rCalHeight = cui.layoutHeight;
            }
        }
        else{
            let cdata =new RUILayoutData();
            cdata.containerWidth = data.containerWidth;
            cdata.containerHeight =cui.layoutHeight;

            var maxChildHeight =0;
            var accuChildWidth = paddingleft;
            children.forEach(c=>{
                c.LayoutPost(cdata);
                c.rOffy =paddingtop;
                c.rOffx = accuChildWidth;
                maxChildHeight = Math.max(maxChildHeight,c.rCalHeight);
                accuChildWidth += c.rCalWidth;

                if(c.isPositionOffset){
                    c.rOffx += c.positionOffsetX;
                    c.rOffy += c.positionOffsetY;
                }
            });

            if(!isFlexHeight){
                if(cui.layoutHeight == cui.height || cui.boxMatchHeight){
                    cui.rCalHeight = cui.height;
                }
                else{
    
                    let paddingverticalFix = SIZE(paddingtop) + SIZE(paddingbottom)
                    if(cui.boxSideExtens){
                        if(maxChildHeight < data.containerHeight){
                            cui.rCalHeight = data.containerHeight;
                        }
                        else{
                            cui.rCalHeight = maxChildHeight + paddingverticalFix;
                        }
                    }else{
                        cui.rCalHeight = maxChildHeight + paddingverticalFix;
                    }
                }
            }
            else{
                cui.rCalHeight = cui.layoutHeight;
            }
            
            if(!isFlexWidth) {
                cui.rCalWidth= accuChildWidth - paddingtop +SIZE(paddingtop) + SIZE(paddingright);
            }
            else{
                cui.rCalWidth = cui.layoutWidth;
            }

        }

        cui.LayoutRelativeUI(cui,cui.children);
        return;
    }

}