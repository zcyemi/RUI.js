import { RUIRenderer } from "./RUIRenderer";
import { RUIRoot, RUIContainer, RUILayouter, RUIRect } from "./RUI";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";


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

        var ui = new RUIContainer();
        let root = new RUIRoot(ui);
        root.root = ui;

        {
            let rect1 = new RUIRect();
            rect1.width = 100;
            rect1.height= 100;
            ui.addChild(rect1);

            let rect2 = new RUIRect();
            rect2.width = 50;
            rect2.height = 30;
            ui.addChild(rect2);
        }
        

        this.m_ruiroot = root;
    }

    public OnFrame(ts:number){
        
        let uiroot = this.m_ruiroot;
        if(uiroot.isdirty){

            this.m_ruilayouter.build(uiroot);
            this.m_ruicmdlist.draw(uiroot);

            console.log(this.m_ruicmdlist);

            this.m_ruicanvas.renderer.DrawCmdList(this.m_ruicmdlist);
        }
        
    }
}