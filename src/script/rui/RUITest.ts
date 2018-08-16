import { RUIRenderer } from "./RUIRenderer";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition, RUIConst } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUILayout } from "./RUILayout";
import { RUIRectangle } from "./RUIRectangle";
import { RUIDebug } from "./widget/RUIDebug";
import { RUIStyle } from "./RUIStyle";
import { RUITabView, RUITabPage } from "./widget/RUITabView";
import { RUIButtonGroup } from "./widget/RUIButtonGroup";
import { RUIButton } from "./widget/RUIButton";
import { RUI } from "./RUI";


export class RUITest{



    private m_ruiroot: RUIRoot;
    private m_ruilayouter: RUILayout;
    private m_ruicmdlist: RUICmdList;

    private m_ruicanvas: RUICanvas;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUICanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        
        this.m_ruicmdlist = new RUICmdList();
        this.m_ruilayouter = new RUILayout();



        var ui = new RUIContainer();
        ui.width = 200;
        ui.height =100;
        ui.boxOrientation = RUIOrientation.Horizontal;
        ui.boxBackground = RUIStyle.Default.border0;

        ui.addChild(new RUIRectangle(100,30));

        
        let c=  new RUIContainer();
        c.boxOrientation= RUIOrientation.Horizontal;
        c.boxSideExtens = true;
       
        c.boxBackground = RUI.RED;
        c.addChild(new RUIRectangle(20,40));
        c.width =70;
        ui.addChild(c);


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
            //this.m_ruilayouter.build(uiroot);
            uiroot.layout();

            console.log(uiroot);
            console.log('> ' + (Date.now() - start));
            this.m_ruicmdlist.draw(uiroot);
            renderer.DrawCmdList(this.m_ruicmdlist);

            
        }

        
    }
}