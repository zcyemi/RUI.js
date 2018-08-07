import { RUIRenderer } from "./RUIRenderer";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";
import { RUIRoot } from "./RUIRoot";
import { RUIOrientation, RUIPosition } from "./RUIObject";
import { RUIContainer } from "./RUIContainer";
import { RUILayouter } from "./RUILayouter";
import { RUIRectangle } from "./RUIRectangle";


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
        ui.padding = [5,5,5,5];

        var root = new RUIRoot(ui,false);
        root.root = ui;
        this.m_ruicanvas.EventOnResize.on((e)=>{
            root.resizeRoot(e.object.width,e.object.height);
        });

        this.m_ruicanvas.EventOnUIEvent.on((e)=>root.dispatchEvent(e));

        {
            let rect1 = new RUIRectangle();
            rect1.width = 100;
            rect1.height= 100;
            rect1._debugname = "rect1";
            ui.addChild(rect1);

            let container1 =new RUIContainer();
            container1.boxOrientation = RUIOrientation.Horizontal;
            //container1.padding = [10,10,10,5];
            container1.margin = [10,0,5,0];
            container1._debugname = "container1";
            
            container1.width = 150;
            ui.addChild(container1);
            {
                let rectc1 = new RUIRectangle();
                rectc1.width = 70;
                rectc1.height = 30;
                rectc1.margin[3] = 20;
                rectc1.margin[1] = 20;
                rectc1._debugname = "rect3";
                container1.addChild(rectc1);


                let rectc2 = new RUIRectangle();
                rectc2.width= 130;
                rectc2.height= 50;
                rectc2.position = RUIPosition.Offset;
                rectc2.left = 20;
                rectc2.top = -20;
                rectc2._debugname = "rect4";
                
                rectc2.margin[3] = 25;
                rectc2.isClip = false;

                container1.addChild(rectc2);
            }

            {
                let container2 = new RUIFlexContainer();
                container2.width = 200;
                container2.padding = [5,5,5,5];
                container2.height = 100;
                container2.boxOrientation = RUIOrientation.Horizontal;
                container2._debugname = "container2";


                ui.addChild(container2);

                let rectfc1 = new RUIRectangle();
                rectfc1.flex = 1;
                rectfc1.margin = [10,2,5,3];
                container2.addChild(rectfc1);
                rectfc1.height = 30;
                rectfc1._debugname = "rect5";

                let rectfc2 = new RUIRectangle();
                rectfc2.width = 50;
                rectfc2._debugname= "rect6";
                

                rectfc2.margin[1] = 7;

                let rectfc3 = new RUIRectangle();
                rectfc3.height = 100;
                rectfc3.flex = 2;
                rectfc3.margin[0] = 70;
                rectfc3.margin[1] = 5;

                rectfc3._debugname = "rect7";

                container2.addChild(rectfc3);
                container2.addChild(rectfc2);

                {
                    let container3 =new RUIFlexContainer();
                    container3.boxOrientation = RUIOrientation.Vertical;
                    container3.flex = 1;

                    container3.position = RUIPosition.Offset;
                    container3.left = 20;

                    container2.addChild(container3);

                    let rfc1 = new RUIRectangle();
                    rfc1.flex = 1;
                    container3.addChild(rfc1);



                    let rfc2 =new RUIRectangle();
                    rfc2.flex = 2;
                    container3.addChild(rfc2);

                }

                
                // let rfcf1 = new RUIRectangle();
                // rfcf1.position = RUIPosition.Relative;
                // rfcf1.left = 20;
                // rfcf1.right = 20;
                // rfcf1.height =100;
                // rfcf1.isClip = false;

                // container2.addChild(rfcf1);
            }

            let rect2 = new RUIRectangle();
            rect2.width = 50;
            rect2.height = 30;
            rect2._debugname = "rect2";
            ui.addChild(rect2);

        }
        

        this.m_ruiroot = root;
    }

    public OnFrame(ts:number){
        
        let uiroot = this.m_ruiroot;
        if(uiroot.isdirty){

            this.m_ruilayouter.build(uiroot);
            this.m_ruicmdlist.draw(uiroot);

            this.m_ruicanvas.renderer.DrawCmdList(this.m_ruicmdlist);
        }
        
    }
}