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
        ui.boxBackground = RUI.RED;
        ui.padding = RUI.Vector(10);
        
        var sb = new ScrollBar(RUIOrientation.Horizontal);
        sb.sizeVal = 0.5;
        sb.scrollPosVal = 0.3;
        ui.addChild(sb);

        ui.addChild(new RUIRectangle(100,100));

        ui.addChild(new RUIButton('+',b=>{
            sb.sizeVal +=0.1;
        }));

        ui.addChild(new RUIButton('-',b=>{
            sb.sizeVal -=0.1;
        }));

        ui.addChild(new RUIButton('+p',b=>{
            sb.scrollPosVal +=0.1;
        }));

        ui.addChild(new RUIButton('-p',b=>{
            sb.scrollPosVal -=0.1;
        }));

        ui.addChild(new RUIButton('c',b=>{

            if(sb.scrollOrientation == RUIOrientation.Vertical){
                sb.scrollOrientation = RUIOrientation.Horizontal;
                sb.width = 200;
            }
            else{
                sb.scrollOrientation = RUIOrientation.Vertical;
                sb.height = 200;
            }
        }));



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