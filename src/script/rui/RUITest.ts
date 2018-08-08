import { RUIRenderer } from "./RUIRenderer";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUILayouter } from "./RUILayouter";
import { RUIRectangle } from "./RUIRectangle";
import { RUIDebug } from "./widget/RUIDebug";


export class RUITest{



    private m_ruiroot: RUIRoot;
    private m_ruilayouter: RUILayouter;
    private m_ruicmdlist: RUICmdList;

    private m_ruicanvas: RUICanvas;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUICanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        
        this.m_ruicmdlist = new RUICmdList();
        this.m_ruilayouter = new RUILayouter();

        var ui = new RUIDebug();

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

            this.m_ruilayouter.build(uiroot);
            this.m_ruicmdlist.draw(uiroot);
            renderer.DrawCmdList(this.m_ruicmdlist);
        }

        
    }
}