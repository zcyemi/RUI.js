import { RUIContainer } from "../RUIContainer";
import { RUIOrientation, RUIObject, RUIConst, RUIAuto } from "../RUIObject";
import { RUIButtonGroup } from "./RUIButtonGroup";
import { RUIButton } from "./RUIButton";
import { RUIStyle } from "../RUIStyle";
import { RUIBind } from "../RUIBinder";
import { RUIScrollView, ScrollView } from "./RUIScrollView";
import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUI } from "../RUI";


export interface RUITabPage{
    label: string,
    ui:RUIObject
}

export class RUITabView extends RUIFlexContainer{

    private m_pages : RUITabPage[];
    private m_menu :RUIButtonGroup;
    private m_pageWrap: ScrollView;
    private m_pageIndex?: number;
    public constructor(pages?:RUITabPage[],tabpos:number = RUIConst.TOP){
        super();
        this.boxBorder = RUIStyle.Default.border0;

        var self = this;
        this.m_pages = pages;

        let buttons:RUIButton[];
        if(pages != null){
            buttons = [];
            pages.forEach(page => {
                buttons.push(new RUIButton(page.label,this.onMenuClick.bind(self)));
            });
        }

        let pagewrap = new ScrollView();
        pagewrap.flex =1;
        pagewrap.boxBorder= null;
        var menu:RUIButtonGroup;
        if(tabpos == RUIConst.TOP || tabpos == RUIConst.BOTTOM){
            
            this.boxOrientation = RUIOrientation.Vertical;
            pagewrap.boxMatchWidth = true;
            menu.height = 23;
            menu = new RUIButtonGroup(buttons,RUIOrientation.Horizontal);
            if(tabpos == RUIConst.TOP){
                super.addChild(menu);
                super.addChild(pagewrap);
            }
            else{
                super.addChild(pagewrap);
                super.addChild(menu);
            }
        }
        else{
            this.boxOrientation = RUIOrientation.Horizontal;
            pagewrap.boxMatchHeight = true;
            menu = new RUIButtonGroup(buttons,RUIOrientation.Vertical);
            menu.width = 100;
            if(tabpos == RUIConst.LEFT){
                super.addChild(menu);
                super.addChild(pagewrap);
            }
            else{
                super.addChild(pagewrap);
                super.addChild(menu);
            }
        }

        this.m_menu = menu;
        this.m_pageWrap = pagewrap;

        this.setPageIndex(0);

    }

    private onMenuClick(b:RUIButton){
        let index = this.m_menu.getButtonIndex(b);
        if(index >=0) this.setPageIndex(index);
    }

    private setPageIndex(index:number){
        if(this.m_pageIndex == index) return;
        let ui = this.m_pages[index].ui;
        if(ui != null){
            let wrap = this.m_pageWrap;
            //wrap.setScrollPosition(0,0);
            wrap.removeChildByIndex(0);
            wrap.addChild(ui);
            this.m_pageIndex = index;
        }
    }

    public addChild(ui:RUIObject){
    }
    public removeChild(ui:RUIObject){
    }
}