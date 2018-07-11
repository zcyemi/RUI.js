import { UIObject } from "./UIObject";
import { UIGroup } from "./widget/UIGroup";


class HierarchyState{
    public ui:UIObject;
    public contentWidth:number = 0;
    public contentHeight:number = 0;
    public vertical: boolean = true;

    public maxWidth:number;
    public maxHeight:number;
}

export class UIBuilder{

    private m_root: UIObject;

    private m_stateStack: HierarchyState[] = [];
    private m_state: HierarchyState;

   
    public constructor(ui:UIObject,canvasWidth:number,canvasHeight:number){
        this.m_root = ui;

        let state = new HierarchyState();
        state.ui = ui;
        state.maxWidth = canvasWidth;
        state.maxHeight = canvasHeight;
        this.m_state = state;
    }

    private expandContentSize(state:HierarchyState,ui:UIObject){
        if(state.vertical){
            state.contentHeight += ui.drawHeight;
            state.contentWidth = Math.max(state.contentWidth,ui.drawWidth);
        }
        else{
            state.contentWidth += ui.drawWidth;
            state.contentHeight = Math.max(state.contentHeight,ui.drawHeight);
        }
    }

    private calculateSize(state:HierarchyState,ui:UIObject){
        if(ui.width == null){
            ui.width = state.contentWidth;
        }
        else{
            ui.width = Math.max(state.contentWidth,ui.validWidth);
        }

        if(ui.height == null){
            ui.height = state.contentHeight;
        }
        else{
            ui.height = Math.max(state.contentHeight,ui.validHeight);
        }
    }

    public Start(){

    }

    public addChild(ui:UIObject){

        this.m_stateStack.push(this.m_state);
        this.m_state.ui.children.push(ui);

        let state = new HierarchyState();
        state.ui = ui;
        this.m_state = state;

        ui.onBuild(this);
        
        this.m_state = this.m_stateStack.pop();
        this.expandContentSize(this.m_state,ui);
    }

    public End(){
        let state = this.m_state;
        let ui = state.ui;

        this.calculateSize(state,ui);
    }

    public GroupBegin(isVertical:boolean,width?:number,height?:number){
        let group = new UIGroup(isVertical);
        group.width = width;
        group.height = height;
        this.m_stateStack.push(this.m_state);
        this.m_state.ui.children.push(group);

        let state = new HierarchyState();
        state.ui = group;
        state.vertical = isVertical;
        
        this.m_state = state;

        return group;
    }

    public GroupEnd(){
        let state = this.m_state;
        let ui = state.ui;

        this.calculateSize(state,ui);
        this.m_state = this.m_stateStack.pop();
        this.expandContentSize(this.m_state,ui);
    }

    public FlexBegin(isVertical:boolean){

    }

    public FlexEnd(){
        
    }


}