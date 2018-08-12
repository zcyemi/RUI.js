import { RUIContainer } from "../RUIContainer";
import { RUIOrientation, RUIObject, RUIConst, RUIAuto } from "../RUIObject";
import { RUIButtonGroup } from "./RUIButtonGroup";
import { RUIButton } from "./RUIButton";
import { RUIStyle } from "../RUIStyle";
import { RUIBind } from "../RUIBinder";
import { RUIScrollView } from "./RUIScrollView";


export interface RUITabPage{
    label: string,
    ui:RUIObject
}

export class RUITabView extends RUIContainer{

    private m_pages : RUITabPage[];
    private m_menu :RUIButtonGroup;
    private m_pageWrap: RUIScrollView;
    private m_pageIndex?: number;
    public constructor(pages?:RUITabPage[],tabpos:number = RUIConst.TOP){
        super();
        this.boxBorder = RUIStyle.Default.primary;

        var self = this;
        this.m_pages = pages;

        let buttons:RUIButton[];
        if(pages != null){
            buttons = [];
            pages.forEach(page => {
                buttons.push(new RUIButton(page.label,this.onMenuClick.bind(self)));
            });
        }

        let pagewrap = new RUIScrollView();
        pagewrap.boxBorder= null;
        var menu:RUIButtonGroup;
        if(tabpos == RUIConst.TOP || tabpos == RUIConst.BOTTOM){
            
            this.boxOrientation = RUIOrientation.Vertical;
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
            menu = new RUIButtonGroup(buttons,RUIOrientation.Vertical);
            menu.width = 100;
            RUIBind(this,"_calheight",(v)=>menu.height = v);
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

        //Bind
        RUIBind(this,"_calheight",(v)=>pagewrap.height = v);
        RUIBind(this,"_calwidth",(v)=>pagewrap.width=v - 100);

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