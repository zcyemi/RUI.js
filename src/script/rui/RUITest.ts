import { RUIRenderer } from "./RUIRenderer";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition, RUIConst, RUIAuto, RUICLIP_MAX } from "./RUIObject";
import { RUIContainer, RUIContainerClipType } from "./RUIContainer";
import { RUIRectangle } from "./RUIRectangle";
import { RUIDebug, RUIPageBasis, RUIPageCompoundWiget, RUIPageWidget, RUIPageLayout, RUIPageContainer } from "./widget/RUIDebug";
import { RUIStyle } from "./RUIStyle";
import { RUITabView, RUITabPage } from "./widget/RUITabView";
import { RUIButtonGroup } from "./widget/RUIButtonGroup";
import { RUIButton } from "./widget/RUIButton";
import { RUI } from "./RUI";
import { RUILabel } from "./widget/RUILabel";
import { RUICollapsibleContainer } from "./widget/RUICollapsibleContainer";
import { RUIScrollBar } from "./widget/RUIScrollBar";
import { RUIScrollView } from "./widget/RUIScrollView";
import { RUIDOMCanvas } from "./RUIDOMCanvas";


export class RUITest{



    private m_ruiroot: RUIRoot;
    private m_ruicmdlist: RUICmdList;

    private m_ruicanvas: RUIDOMCanvas;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUIDOMCanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        this.m_ruicmdlist = new RUICmdList();

        var ui = new RUIContainer();


        ui.addChild(new RUIDebug());

        var root = new RUIRoot(ui,false);
        root.root = ui;

        root.resizeRoot(this.m_ruicanvas.m_width,this.m_ruicanvas.m_height);
        this.m_ruicanvas.EventOnResize.on((e)=>{
            root.resizeRoot(e.object.width,e.object.height);
        });
        
        this.m_ruicanvas.EventOnUIEvent.on((e)=>root.dispatchEvent(e));

        this.m_ruiroot = root;
    }

    public OnFrame(ts:number){
        
        let uiroot = this.m_ruiroot;
        let renderer= this.m_ruicanvas.renderer;
        if(uiroot.isdirty || renderer.needRedraw){
            let start = Date.now();
            uiroot.layout();
            //console.log(uiroot.root);
            console.log('> ' + (Date.now() - start));
            this.m_ruicmdlist.draw(uiroot);
            renderer.DrawCmdList(this.m_ruicmdlist);
        }
        
    }
}