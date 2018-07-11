import { UIObject } from "./UIObject";
import { FlexLayout } from "./FlexLayout";
import { UILayout, LayoutType } from "./UILayout";

export class UIBuilder{

    private m_root: UIObject;
    private m_list: UIObject[];

    private m_stackUI:UIObject[] = [];
    private m_stackLayout:LayoutType[] = [];

    private m_ui:UIObject;
    private m_layoutType: LayoutType = LayoutType.DEFAULT;

    public constructor(ui:UIObject){
        this.m_root = ui;
        this.m_list = ui.children;

        this.m_ui = ui;
        this.m_layoutType = LayoutType.DEFAULT;
    }

    public addChild(ui:UIObject){
        this.m_list.push(ui);
    }

    public flexStart(isVertical:boolean = false){

        this.m_stackUI.push(this.m_root);
        this.m_stackLayout.push(this.m_layoutType);

        let flex = new FlexLayout(isVertical);

        this.m_ui = flex;
        this.m_layoutType = isVertical? LayoutType.FLEX_VER : LayoutType.FLEX_HOR;

        this.m_list.push(flex);
        this.m_list = flex.children;

    }

    public flexChildFixed(ui:UIObject,size:number){
        (<FlexLayout>this.m_ui).addChildFixed(ui,size);
    }

    public flexChildFlex(ui:UIObject,flex:number){
        (<FlexLayout>this.m_ui).addChildFlex(ui,flex);
    }

    public flexEnd(){
        this.m_ui = this.m_stackUI.pop();
        this.m_layoutType = this.m_stackLayout.pop();
        this.m_list = this.m_ui.children;
    }

}