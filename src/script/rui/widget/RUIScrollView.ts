import {RUIContainer} from "../RUIContainer";
import {RUIScrollBar} from "./RUIScrollBar";
import {
    RUIOrientation,
    RUIPosition,
    RUIObject,
    ROUND,
    RUIAuto,
    RUIConst,
    RUICLIP_MAX
} from "../RUIObject";
import {RUIStyle} from "../RUIStyle";
import {RUI, RUILayoutData, CLAMP} from "../RUI";
import {RUIEvent, RUIWheelEvent} from "../RUIEvent";
import {RUIFlexContainer} from "../RUIFlexContainer";
import { RUICmdList } from "../RUICmdList";

export class RUIScrollView extends RUIContainer {
    public scrollVertical : boolean = true;
    public scrollHorizontal : boolean = true;

    private m_contentWrap : RUIContainer;
    private m_sliderVertical : RUIScrollBar;
    private m_sliderHorizontal : RUIScrollBar;

    private m_scrollbarVShow : boolean = false;
    private m_scrollbarHShow : boolean = false;

    private m_overflowH : boolean = false;
    private m_overflowV : boolean = false;

    private m_contentH : number = 0;
    private m_contentV : number = 0;
    private m_viewH :number = 0;
    private m_viewV: number = 0;

    public constructor() {
        super();
        this.boxOrientation = RUIOrientation.Vertical;
        this.boxSideExtens = true;
        this.boxMatchWidth = true;
        this.boxMatchHeight = true;

        let contentWrap = new RUIContainer();
        contentWrap.boxBackground = RUIStyle.Default.background1;
        contentWrap.boxSideExtens = true;
        contentWrap.position = RUIPosition.Offset;
        contentWrap.left = 0;
        contentWrap.top = 0;
        this.m_contentWrap = contentWrap;
        super.addChild(contentWrap);

        let scrollbar = new RUIScrollBar(RUIOrientation.Vertical);
        scrollbar.sizeVal = 0.5;
        scrollbar.position = RUIPosition.Relative;
        scrollbar.right = 0;
        scrollbar.top = 0;
        scrollbar.bottom = 0;
        scrollbar
            .EventOnScroll
            .on(this.onScrollVertical.bind(this));
        this.m_sliderVertical = scrollbar;

        let scrollbarh = new RUIScrollBar(RUIOrientation.Horizontal);
        scrollbarh.position = RUIPosition.Relative;
        scrollbarh.sizeVal = 0.5;
        scrollbarh.left = 0;
        scrollbarh.right = 10;
        scrollbarh.bottom = 0;
        scrollbarh.height = 10;
        scrollbarh
            .EventOnScroll
            .on(this.onScrollHorizontal.bind(this));
        this.m_sliderHorizontal = scrollbarh;
    }

    private onScrollHorizontal(e : RUIEvent < number >) {
        let val = -e.object * this.m_contentH;
        this.setScrollH(val);
    }

    private onScrollVertical(e : RUIEvent < number >) {
        let val = -e.object * this.m_contentV;
        this.setScrollV(val);
    }

    private setScrollV(pos:number){
        pos = CLAMP(pos,this.m_viewV - this.m_contentV,0);
        let wrap  =this.m_contentWrap;
        if(wrap.top == pos) return;
        wrap.top = pos;
    }

    private setScrollH(pos:number){
        pos = CLAMP(pos,this.m_viewH - this.m_contentH,0);
        let wrap = this.m_contentWrap;
        if(wrap.left == pos) return;
        wrap.left = pos;
    }

    public Layout() {
        super.Layout();
    }

    public LayoutPost(data : RUILayoutData) {
        super.LayoutPost(data);

        let contentH = this.m_contentWrap.rCalWidth;
        let contentV = this.m_contentWrap.rCalHeight;

        this.m_contentH = contentH;
        this.m_contentV = contentV;

        {
            let viewH = this.rCalWidth - this.padding[RUIConst.RIGHT];
            this.m_viewH = viewH;
    
            let overflowH = viewH < contentH;
            this.m_overflowH = overflowH;
            this.scrollBarShowH(overflowH);
            if (overflowH) {
                this.m_sliderHorizontal.sizeVal = viewH / contentH;
            } else {
                this.m_contentWrap.left = 0;
            }
        }
        {
            let viewV = this.rCalHeight - this.padding[RUIConst.BOTTOM];
            this.m_viewV = viewV;

            let overflowV = viewV < contentV;
            this.m_overflowV = overflowV;
            this.scrollBarShowV(overflowV);
            if (overflowV) {
                this.m_sliderVertical.sizeVal = viewV / contentV;
            } else {
                this.m_contentWrap.top = 0;
            }
        }
    }

    public onMouseWheel(e:RUIWheelEvent){
        let size = e.delta / 2;
        if(this.m_overflowV){
            let scrollbarV = this.m_sliderVertical;
            let contentV = this.m_contentV;
            scrollbarV.scrollPosVal += (size / contentV);
            this.setScrollV(scrollbarV.scrollPosVal * -contentV);
        }
        else if(this.m_overflowH){
            let scrollbarH = this.m_sliderHorizontal;
            let contentH = this.m_contentH;
            scrollbarH.scrollPosVal += (size /this.m_contentV);
            this.setScrollH(scrollbarH.scrollPosVal * - contentH);
        }
        else{
            return;
        }

        e.Use();
        e.prevent();
    }

    public addChild(ui : RUIObject) {
        this.m_contentWrap.addChild(ui);
    }

    public removeChild(ui : RUIObject) {
        this.m_contentWrap.removeChild(ui);
    }

    public removeChildByIndex(index : number) : RUIObject {
        return this
            .m_contentWrap
            .removeChildByIndex(index);
    }

    public scrollBarShowV(show : boolean) {
        if (show == this.m_scrollbarVShow) 
            return;
        this.m_scrollbarVShow = show;
        if (show) {
            super.addChild(this.m_sliderVertical);
            if (this.m_scrollbarHShow) {
                this.padding = [0, 10, 10, 0];
                this.m_sliderHorizontal.right = 10;
            } else {
                this.padding = [0, 10, 0, 0];
            }
        } else {
            super.removeChild(this.m_sliderVertical);
            if (this.m_scrollbarHShow) {
                this.padding = [0, 0, 10, 0];
                this.m_sliderHorizontal.right = 0;
            } else {
                this.padding = [0, 0, 0, 0];
            }
        }
        this.setDirty(true);
    }

    public scrollBarShowH(show : boolean) {
        if (show == this.m_scrollbarHShow) 
            return;
        this.m_scrollbarHShow = show;
        let vshow = this.m_scrollbarVShow;
        if (show) {
            super.addChild(this.m_sliderHorizontal);
            if (vshow) {
                this.padding = [0, 10, 10, 0];
                this.m_sliderHorizontal.right = 10;
            } else {
                this.padding = [0, 0, 10, 0];
                this.m_sliderHorizontal.right = 0;
            }
        } else {
            super.removeChild(this.m_sliderHorizontal);
            if (vshow) {
                this.padding = [0, 10, 0, 0];
            } else {
                this.padding = [0, 0, 0, 0];
            }
        }
    }
}