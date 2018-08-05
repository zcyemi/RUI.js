import { RUIRenderer } from "./RUIRenderer";
import { RUIRoot, RUIContainer, RUILayouter, RUIRectangle, RUIOrientation } from "./RUI";
import { RUICanvas } from "./RUICanvas";
import { RUICmdList } from "./RUICmdList";
import { RUIFlexContainer } from "./RUIFlexContainer";


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

        let root = new RUIRoot(ui);
        root.root = ui;

        {
            let rect1 = new RUIRectangle();
            rect1.width = 100;
            rect1.height= 100;
            ui.addChild(rect1);

            let container1 =new RUIContainer();
            container1.boxOrientation = RUIOrientation.Horizontal;
            //container1.padding = [10,10,10,5];
            container1.margin = [10,0,5,0];
            
            container1.width = 150;
            ui.addChild(container1);
            {
                let rectc1 = new RUIRectangle();
                rectc1.width = 70;
                rectc1.height = 30;
                rectc1.margin[3] = 20;
                rectc1.margin[1] = 20;
                container1.addChild(rectc1);


                let rectc2 = new RUIRectangle();
                rectc2.width= 130;
                rectc2.height= 50;
                
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

                ui.addChild(container2);

                let rectfc1 = new RUIRectangle();
                rectfc1.flex = 1;
                rectfc1.margin = [10,2,5,3];
                container2.addChild(rectfc1);
                rectfc1.height = 30;

                let rectfc2 = new RUIRectangle();
                rectfc2.width = 50;
                container2.addChild(rectfc2);

                rectfc2.margin[1] = 7;

                let rectfc3 = new RUIRectangle();
                rectfc3.height = 100;
                rectfc3.flex = 2;
                rectfc3.margin[0] = 70;
                rectfc3.margin[1] = 5;

                container2.addChild(rectfc3);

                {
                    let container3 =new RUIFlexContainer();
                    container3.boxOrientation = RUIOrientation.Vertical;
                    container3.flex = 1;

                    container2.addChild(container3);

                    console.log(container3);

                    let rfc1 = new RUIRectangle();
                    rfc1.flex = 1;
                    container3.addChild(rfc1);

                    let rfc2 =new RUIRectangle();
                    rfc2.flex = 2;
                    container3.addChild(rfc2);
                }
            }

            let rect2 = new RUIRectangle();
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