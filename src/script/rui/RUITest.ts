import { RUIRenderer } from "./RUIRenderer";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition, RUIConst, RUIAuto } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUIRectangle } from "./RUIRectangle";
import { RUIDebug } from "./widget/RUIDebug";
import { RUIStyle } from "./RUIStyle";
import { RUITabView, RUITabPage } from "./widget/RUITabView";
import { RUIButtonGroup } from "./widget/RUIButtonGroup";
import { RUIButton } from "./widget/RUIButton";
import { RUI } from "./RUI";
import { RUILabel } from "./widget/RUILabel";
import { RUICollapsibleContainer } from "./widget/RUICollapsibleContainer";
import { RUIScrollBar, ScrollBar } from "./widget/RUIScrollBar";
import { ScrollView } from "./widget/RUIScrollView";


export class RUITest{



    private m_ruiroot: RUIRoot;
    private m_ruicmdlist: RUICmdList;

    private m_ruicanvas: RUICanvas;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUICanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        
        this.m_ruicmdlist = new RUICmdList();

        // var ui = new RUIContainer();

        // var cc = new RUICollapsibleContainer('aaa',true);
        // cc.width = 150;
        // cc.addChild(new RUIContainer());

        // ui.addChild(cc);
        // ui.addChild(new RUIRectangle(50,100));

        var ui = new RUIContainer();

        ui.width = 800;
        ui.height = 800;
        ui.boxBackground = RUI.BLACK;

        // var sb = new ScrollBar(RUIOrientation.Horizontal);
        // sb.sizeVal = 0.5;

        // var sb1 = new ScrollBar(RUIOrientation.Vertical);
        // sb1.sizeVal = 0.5;
        // sb1.height = 100;

        // ui.addChild(sb);
        // ui.addChild(sb1);


        var sv = new ScrollView();
        sv.height = 250;
        sv.width = 350;

        sv.position = RUIPosition.Offset;
        sv.left = 400;

        sv.addChild(new RUIRectangle(100,50));

        var show = true;
        var showh = true;
        sv.addChild(new RUIButton('toggleV',b=>{
            sv.scrollBarShowV(show);
            show = !show;
        }));
        sv.addChild(new RUIButton('toggleH',b=>{
            sv.scrollBarShowH(showh);
            showh = !showh;
        }));
        ui.addChild(sv);

        var f = new RUIFlexContainer();
        f.boxBackground = RUI.RED;
        f.boxOrientation= RUIOrientation.Horizontal;


        var c= new RUIContainer();
        c.addChild(new RUIRectangle(50,50));
        c.flex = 1;
        f.addChild(c);

        f.addChild(new RUIRectangle(100,100));

        ui.addChild(f);

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