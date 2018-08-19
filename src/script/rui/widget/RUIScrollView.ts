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



export class ScrollView extends RUIFlexContainer {


    public scrollVertical: boolean = true;
    public scrollHorizontal: boolean = true;

    private m_contentWrap: RUIContainer;
    private m_sliderMain: ScrollBar;

    public constructor() {
        super();
        this.boxOrientation = RUIOrientation.Horizontal;
        this.boxSideExtens = true;
        this.boxBackground = RUI.GREY;

        let contentWrap = new RUIContainer();
        contentWrap.boxBackground = RUI.YELLOW;
        contentWrap.flex = 1;
        this.m_contentWrap = contentWrap;
        super.addChild(contentWrap);

        this.m_sliderMain = new ScrollBar(RUIOrientation.Vertical);
        this.m_sliderMain.sizeVal = 0.5;
        super.addChild(this.m_sliderMain);
    }


    public addChild(ui:RUIObject){
        //this.m_contentWrap.addChild(ui);
    }



}