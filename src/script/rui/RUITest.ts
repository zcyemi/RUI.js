import { RUIRenderer } from "./RUIRenderer";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUILayout } from "./RUILayout";
import { RUIRectangle } from "./RUIRectangle";
import { RUIDebug } from "./widget/RUIDebug";
import { RUIStyle } from "./RUIStyle";


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

        //var ui = new RUIDebug();

        var ui = new RUIContainer();
        {
            ui.width = 200;
            ui.boxBorder = RUIStyle.Default.primary;
            ui.boxOrientation = RUIOrientation.Horizontal;
            //ui.boxSideExtens = true;
            

            let r1 = new RUIRectangle();
            r1.height = 100;
            r1.width =40;
            r1.flex = 2;
            let r2 = new RUIRectangle();
            r2.position = RUIPosition.Relative;
            r2.width = 20;
            r2.height = 50;
            r2.bottom = 0;

            ui.addChild(r1);
            //ui.addChild(r2);
            ui.addChild(new RUIRectangle(70,20));
        }


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
            console.log('> ' + (Date.now() - start));
            this.m_ruicmdlist.draw(uiroot);
            renderer.DrawCmdList(this.m_ruicmdlist);

            
        }

        
    }
}