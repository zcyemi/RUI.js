import { RUIContainer } from "../RUIContainer";
import { RUIScrollType, RUIScrollBar, ScrollBar } from "./RUIScrollBar";
import { RUIOrientation, RUIPosition, RUIObject, ROUND } from "../RUIObject";
import { RUIStyle } from "../RUIStyle";
import { RUI } from "../RUI";
import { RUIEvent } from "../RUIEvent";
import { RUIFlexContainer } from "../RUIFlexContainer";


export class RUIScrollView extends RUIContainer {


    private m_scrolltypeH: RUIScrollType;
    private m_scrolltypeV: RUIScrollType;

    private m_scrollbarH: RUIScrollBar;
    private m_scrollbarV: RUIScrollBar;

    private m_content: RUIContainer;
    private m_contentvalH?: number;
    private m_contentvalV?: number;


    public constructor(scrollH: RUIScrollType = RUIScrollType.Enabled, scrollV: RUIScrollType = RUIScrollType.Enabled) {
        super();

        this.boxBorder = RUIStyle.Default.border0;
        this.padding = [1, 11, 11, 1];

        let content = new RUIContainer();
        content.position = RUIPosition.Offset;
        super.addChild(content);
        this.m_content = content;


        this.scrollVertical = scrollV;
        this.scrollHorizontal = scrollH;
    }

    public set scrollVertical(type: RUIScrollType) {

        let bar = this.m_scrollbarV;
        if (bar == null) {
            bar = new RUIScrollBar(RUIOrientation.Vertical, type);
            bar.EventOnScroll.on(this.onBarScrollVertical.bind(this));
            bar.position = RUIPosition.Relative;
            bar.top = 0;
            bar.bottom = 0;
            bar.right = 0;
            super.addChild(bar);
            this.m_scrollbarV = bar;
        }
        this.m_scrolltypeV = type;
    }
    public get scrollVertical(): RUIScrollType {
        return this.m_scrolltypeV;
    }

    public set scrollHorizontal(type: RUIScrollType) {
        let bar = this.m_scrollbarH;
        if (bar == null) {
            bar = new RUIScrollBar(RUIOrientation.Horizontal, type);
            bar.EventOnScroll.on(this.onBarScrollHorizontal.bind(this));
            bar.position = RUIPosition.Relative;
            bar.left = 0;
            bar.right = this.m_scrolltypeV == RUIScrollType.Disabled ? 0 : RUIScrollBar.BAR_SIZE;
            bar.bottom = 0;
            super.addChild(bar);
            this.m_scrollbarH = bar;
        }
        this.m_scrolltypeH = type;
    }

    public get scrollHorizontal(): RUIScrollType {
        return this.m_scrolltypeH;
    }

    private onBarScrollVertical(e: RUIEvent<number>) {
        // this.m_content.top = -ROUND(e.object * (this.m_content._calheight));
    }

    private onBarScrollHorizontal(e: RUIEvent<number>) {
        // this.m_content.left = -ROUND(e.object * (this.m_content._calwidth));
    }

    public setScrollPosition(h?: number, v?: number) {
        if (h != null) this.m_scrollbarH.scrollPos = 0;
        if (v != null) this.m_scrollbarV.scrollPos = 0;
    }

    private updateScrollBarVertical() {
        // let content = this.m_content;
        // //Vertical
        // let contenth = content._calheight;
        // let contentvalV = 0;
        // if(contenth > this._calheight){
        //     contentvalV = (this._calheight - 12) / contenth;
        // }
        // if (contentvalV != this.m_contentvalV) {
        //     this.m_contentvalV = contentvalV;
        //     if (this.m_scrolltypeV != RUIScrollType.Disabled) {
        //         this.m_scrollbarV.scrollSize = contentvalV;
        //     }
        //     this.FixHorizontalBarSize();
        // }
    }

    private updateScrollBarHorizontal() {
        // let content = this.m_content;
        // //Horizontal
        // let contentw = content._calwidth;
        // let contentvalH = 0;
        // if(contentw > this._calwidth){
        //     contentvalH =(this._calheight - 12) / contentw;
        // }

        // if (contentvalH != this.m_contentvalH) {
        //     this.m_contentvalH = contentvalH;
        //     if (this.m_scrolltypeH != RUIScrollType.Disabled) {
        //         this.m_scrollbarH.scrollSize = contentvalH;
        //     }
        // }
    }

    public onLayoutPost() {
        this.updateScrollBarVertical();
        this.updateScrollBarHorizontal();
    }

    private FixHorizontalBarSize() {
        if (this.m_scrollbarV.enabled) {
            this.m_scrollbarH.right = RUIScrollBar.BAR_SIZE;
        }
        else {
            this.m_scrollbarH.right = 0;
        }
    }

    public addChild(ui: RUIObject) {
        this.m_content.addChild(ui);
    }

    public removeChild(ui: RUIObject) {
        this.m_content.removeChild(ui);
    }

    public removeChildByIndex(index: number): RUIObject {
        return this.m_content.removeChildByIndex(index);
    }

    public hasChild(ui: RUIObject): boolean {
        return this.m_content.hasChild(ui);
    }

}



export class ScrollView extends RUIContainer {


    public scrollVertical: boolean = true;
    public scrollHorizontal: boolean = true;

    private m_contentWrap: RUIContainer;
    private m_sliderVertical: ScrollBar;
    private m_sliderHorizontal: ScrollBar;

    private m_scrollbarVShow:boolean = true;
    private m_scrollbarHShow:boolean = true;

    public constructor() {
        super();
        this.boxOrientation = RUIOrientation.Vertical;
        this.boxSideExtens = true;
        this.boxBackground = RUI.GREY;
        //this.padding = [0,10,10,0];

        let contentWrap = new RUIContainer();
        contentWrap.boxBackground = RUI.GREEN;
        contentWrap.boxSideExtens = true;
        contentWrap.flex = 1;
        this.m_contentWrap = contentWrap;
        super.addChild(contentWrap);

        let scrollbar = new ScrollBar(RUIOrientation.Vertical);
        scrollbar.sizeVal = 0.5;
        scrollbar.position = RUIPosition.Relative;
        scrollbar.right = 0;
        scrollbar.top =0;
        scrollbar.bottom = 0;
        this.m_sliderVertical = scrollbar;
        super.addChild(scrollbar);


        let scrollbarh = new ScrollBar(RUIOrientation.Horizontal);
        scrollbarh.position = RUIPosition.Relative;
        scrollbarh.sizeVal = 0.5;
        scrollbarh.left =0;
        scrollbarh.right = 10;
        scrollbarh.bottom =0;
        scrollbarh.height = 10;
        this.m_sliderHorizontal = scrollbarh;
        super.addChild(scrollbarh);
    }


    public addChild(ui:RUIObject){
        this.m_contentWrap.addChild(ui);
    }

    public scrollBarShowV(show:boolean){
        if(show  == this.m_scrollbarVShow) return;
        this.m_scrollbarVShow = show;
        if(show){
            super.addChild(this.m_sliderVertical);
            if(this.m_scrollbarHShow){
                this.padding = [0,10,10,0];
                this.m_sliderHorizontal.right = 10;
            }
            else{
                this.padding = [0,10,0,0];
            }
        }
        else{
            super.removeChild(this.m_sliderVertical);
            if(this.m_scrollbarHShow){
                this.padding = [0,0,10,0];
                this.m_sliderHorizontal.right = 0;
            }
            else{
                this.padding = [0,0,0,0];
            }
        }
        this.setDirty(true);
    }

    public scrollBarShowH(show:boolean){
        if(show == this.m_scrollbarHShow) return;
        this.m_scrollbarHShow = show;
        let vshow = this.m_scrollbarVShow;
        if(show){
            super.addChild(this.m_sliderHorizontal);
            if(vshow){
                this.padding = [0,10,10,0];
                this.m_sliderHorizontal.right = 10;
            }
            else{
                this.padding = [0,0,10,0];
                this.m_sliderHorizontal.right = 0;
            }
        }
        else{
            super.removeChild(this.m_sliderHorizontal);
            if(vshow){
                this.padding = [0,10,0,0];
            }
            else{
                this.padding = [0,0,0,0];
            }
        }
    }



}