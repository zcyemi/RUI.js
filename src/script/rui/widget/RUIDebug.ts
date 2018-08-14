import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUILabel } from "./RUILabel";
import { RUIButton } from "./RUIButton";
import { RUICanvas } from "./RUICanvas";
import { RUIRectangle } from "../RUIRectangle";
import { RUIPosition, RUIOrientation, RUIAuto, RUIConst } from "../RUIObject";
import { RUIButtonGroup } from "./RUIButtonGroup";
import { RUIStyle } from "../RUIStyle";
import { RUIRenderer } from "../RUIRenderer";
import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUI } from "../RUI";
import { RUITabView, RUITabPage } from "./RUITabView";
import { RUIScrollBar, RUIScrollType } from "./RUIScrollBar";
import { RUIScrollView } from "./RUIScrollView";
import { RUICollapsibleContainer } from "./RUICollapsibleContainer";


export class RUIDebug extends RUIContainer {

    public constructor() {
        super();
        this.boxBorder = RUIStyle.Default.border0;

        this.position = RUIPosition.Absolute;
        this.left = 100;
        this.right = 100;
        this.top = 100;
        this.bottom = 100;

        let pages: RUITabPage[] = [];

        pages.push({ label: 'basis', ui: this.PageBasis() });
        pages.push({ label: 'container', ui: this.PageContainer() });


        let tabview = new RUITabView(pages, RUIConst.LEFT);
        tabview.position = RUIPosition.Relative;
        tabview.left = 0;
        tabview.right = 0;
        tabview.top = 0;
        tabview.bottom = 0;
        this.addChild(tabview);


        // this.BasisEnable();
        // this.BasisChildren();

        // this.LayoutContainer();
        // this.LayoutFlexContainer();
        // this.LayoutClip();
        // this.LayoutMarginPadding();

        // this.WidgetButtons();
        // this.WidgetLabel();
        // this.WidgetTabView();
        // this.WidgetScrollView();



        // {
        //     let scrollview = new RUIScrollView();
        //     scrollview.width = 400;
        //     scrollview.height= 200;
        //     this.addChild(scrollview);

        //     for(var i=0;i<10;i++){
        //         let rect1 = new RUIRectangle();
        //         rect1.width = 20 + 600* Math.random();
        //         rect1.height = 20 + 50 * Math.random();

        //         scrollview.addChild(rect1);
        //     }



        // }


    }


    private PageBasis() {
        let container = new RUIContainer();

        this.PageBasisAddRemove(container);

        return container;
    }

    private PageContainer() {
        let container = new RUIContainer();

        this.PageContainerRUIContainer(container);
        this.PageContainerMarginPadding(container);
        this.PageContainerFlexContainer(container);

        return container;
    }

    private PageContainerRUIContainer(parent:RUIContainer){
        let collapse = new RUICollapsibleContainer('RUIContainer', true);
        collapse.width = 400;
        parent.addChild(collapse);

        {
            collapse.addChild(new RUILabel('Vertical'));

            let c = new RUIContainer();
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            collapse.addChild(c);

            c.addChild(new RUIRectangle(50, 30));
            c.addChild(new RUIRectangle(100, 30));
        }

        {
            collapse.addChild(new RUILabel('Horizontal'));

            let c = new RUIContainer();
            c.boxBorder = RUIStyle.Default.primary;
            c.margin = [0, 0, 0, 10];
            c.boxOrientation = RUIOrientation.Horizontal;
            collapse.addChild(c);

            c.addChild(new RUIRectangle(30, 50));
            c.addChild(new RUIRectangle(30, 100));
            c.addChild(new RUIRectangle(30, 70));
        }

        {
            collapse.addChild(new RUILabel('Nested'));

            let c = new RUIContainer();
            c.boxBorder = RUIStyle.Default.primary;
            c.margin = [0, 0, 0, 10];
            c.boxOrientation = RUIOrientation.Vertical;
            collapse.addChild(c);

            c.addChild(new RUIRectangle(50, 30));
            {
                let c1 = new RUIContainer();
                c1.boxOrientation = RUIOrientation.Horizontal;
                c1.addChild(new RUIRectangle(30, 30));
                c1.addChild(new RUIRectangle(30, 50));
                c1.addChild(new RUIRectangle(30, 10));

                c.addChild(c1);
            }
            c.addChild(new RUIRectangle(70, 30));
        }
    }

    private PageContainerMarginPadding(parent:RUIContainer){
        let collapse = new RUICollapsibleContainer('Margin/Padding', true);
        collapse.width = 400;
        parent.addChild(collapse);

        let c = new RUIContainer();
        c.boxOrientation = RUIOrientation.Horizontal;
        collapse.addChild(c);

        {
            let c1 = new RUIContainer();
            c1.margin = [0, 20, 0, 20];
            c1.boxBorder = RUI.RED;
            c1.width = 50;
            c1.padding = [1, 1, 1, -20];
            c.addChild(c1);
            c1.addChild(new RUIRectangle(50, 30));
        }

        {
            let c2 = new RUIContainer();
            c2.margin = [0, 20, 0, 20];
            c2.boxBorder = RUI.RED;
            c2.width = 50;
            c2.padding = [1, 1, 1, -20];
            c2.boxClip = RUIContainerClipType.NoClip;
            c.addChild(c2);
            c2.addChild(new RUIRectangle(50, 30));
        }

        {
            let c3 = new RUIContainer();
            c3.margin = [0, 20, 0, 20];
            c3.boxBorder = RUI.RED;
            c3.width = 50;
            c3.padding = [1, 1, 1, 20];
            c.addChild(c3);
            c3.addChild(new RUIRectangle(50, 30));
        }

        {
            let c4 = new RUIContainer();
            c4.margin = [0, 20, 0, 20];
            c4.boxBorder = RUI.RED;
            c4.width = 50;
            c4.padding = [1, 1, 1, 20];
            c.addChild(c4);
            let r = new RUIRectangle(50, 30);
            r.isClip = false;
            c4.addChild(r);
        }
    }

    private PageContainerFlexContainer(parent:RUIContainer){
        let collapse = new RUICollapsibleContainer('FlexContainer', true);
        collapse.width = 400;
        parent.addChild(collapse);

        let fc = new RUIContainer();
        collapse.addChild(fc);
        fc.boxOrientation = RUIOrientation.Horizontal;
        fc.boxBorder = RUIStyle.Default.primary;
        fc.padding = [3, 3, 3, 3];
        fc.margin = [0, 0, 10, 0];

        {
            let c = new RUIFlexContainer();
            fc.addChild(c);
            c.boxOrientation = RUIOrientation.Horizontal;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3, 3, 3, 3];
            c.margin = [0, 10, 0, 0];
            c.width = 100;
            c.height = 70;

            let r1 = new RUIRectangle();
            r1.flex = 1;
            let r2 = new RUIRectangle();
            r2.flex = 1;
            r2.height = 40;

            let r3 = new RUIRectangle();
            r3.flex = 2;
            r3.height = 30;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        {
            let c = new RUIFlexContainer();
            fc.addChild(c);
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3, 3, 3, 3];
            c.margin = [0, 10, 0, 0];
            c.width = 100;
            c.height = 70;

            let r1 = new RUIRectangle();
            r1.flex = 1;
            r1.width = 50;
            let r2 = new RUIRectangle();
            r2.flex = 1;
            r2.width = 70;
            let r3 = new RUIRectangle();
            r3.flex = 2;
            r3.width = 60;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        {
            let c = new RUIFlexContainer();
            fc.addChild(c);
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3, 3, 3, 3];
            c.margin = [0, 10, 0, 0];
            c.height = 70;

            let r1 = new RUIRectangle();
            r1.flex = 1;
            r1.width = 50;
            let r2 = new RUIRectangle();
            r2.flex = 1;
            r2.width = 100;
            let r3 = new RUIRectangle();
            r3.flex = 2;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        let fc2 = new RUIContainer();
        collapse.addChild(fc2);
        fc2.boxOrientation = RUIOrientation.Horizontal;
        fc2.boxBorder = RUIStyle.Default.primary;
        fc2.padding = [3, 3, 3, 3];
        fc2.margin = [20, 0, 10, 0];

        {
            let c1 = new RUIFlexContainer();
            c1.padding = RUI.Vector(3);
            c1.height = 100;
            fc2.addChild(c1);

            let r1 = new RUIRectangle();
            r1.flex = 1;
            r1.width = 100;
            let r2 = new RUIButton('flexbtn');
            r2.height = 50;
            r2.width = 120;

            let r3 = new RUIRectangle();
            r3.flex = 2;
            r3.width = 30;

            c1.addChild(r1);
            c1.addChild(r2);
            c1.addChild(r3);

        }
    }

    private PageBasisAddRemove(parent:RUIContainer) {
        var collapse = new RUICollapsibleContainer('remove/add children',true);
        collapse.width= 400;
        collapse.padding = RUI.Vector(3);
        collapse.boxBorder = RUIStyle.Default.primary;
        parent.addChild(collapse);

        var c = new RUIContainer();
        c.boxOrientation = RUIOrientation.Horizontal;
        collapse.addChild(c);

        let btnAdd = new RUIButton('Add', (b) => {
            c.addChild(new RUIRectangle(20, 20));
            c.setDirty();
        });
        btnAdd.width = 50;
        collapse.addChild(btnAdd);

        let btnDel = new RUIButton('Remove', (b) => {
            c.removeChildByIndex(0);
        });
        btnDel.width = 50;
        collapse.addChild(btnDel);

    }

    private BasisEnable() {
        this.addChild(new RUILabel('0.0-Enabled'));

        let container = new RUIContainer();
        container.boxBorder = RUIStyle.Default.primary;
        container.boxOrientation = RUIOrientation.Horizontal;
        container.padding = RUI.Vector(2);
        this.addChild(container);

        //container
        {
            let c = new RUIContainer();
            c.padding = RUI.Vector(3);
            c.boxBorder = RUIStyle.Default.primary;
            container.addChild(c);

            var r1 = new RUIRectangle(120, 20);
            let btn = new RUIButton('enable/disable', (b) => {
                r1.enabled = !r1.enabled;
                r1.setDirty(true);
            });
            btn.width = 100;
            c.addChild(btn);
            c.addChild(r1);
        }

        //container has  single child
        {
            var rect = new RUIRectangle(50, 50);
            rect.enabled = true;
            let btn = new RUIButton("ClickMe", (b) => {
                rect.enabled = !rect.enabled;
                rect.setDirty(true);
            });
            btn.width = 50;

            let c = new RUIContainer();
            c.padding = RUI.Vector(3);
            c.boxBorder = RUIStyle.Default.primary;
            c.addChild(rect);

            container.addChild(c);
            container.addChild(btn);
        }

        //flex
        {
            let c = new RUIFlexContainer();
            c.padding = RUI.Vector(3);
            c.boxBorder = RUIStyle.Default.primary;
            c.height = 70;
            var r = new RUIRectangle(120);
            r.flex = 1;
            let btn = new RUIButton('enable/disable', (b) => {
                r.enabled = !r.enabled;
                r.setDirty(true);
            })
            btn.width = 100;
            btn.flex = 2;
            c.addChild(btn);
            c.addChild(r);

            container.addChild(c);
        }


        //flex has single child
        {
            var r2 = new RUIRectangle(50, 50);
            r2.flex = 1;
            r2.enabled = true;
            let btn = new RUIButton("ClickMe", (b) => {
                r2.enabled = !r2.enabled;
                r2.setDirty(true);
            });
            btn.width = 50;

            let c2 = new RUIFlexContainer();
            c2.padding = RUI.Vector(3);
            c2.height = 56;
            c2.boxBorder = RUIStyle.Default.primary;
            c2.addChild(r2);

            container.addChild(c2);
            container.addChild(btn);
        }
    }


    private LayoutClip() {

        var label = new RUILabel('1.1-LayoutClip');
        this.addChild(label);

        var container = new RUIContainer();
        this.addChild(container);
        container.boxOrientation = RUIOrientation.Horizontal;
        container.boxBorder = RUIStyle.Default.primary;
        container.padding = [3, 3, 3, 3];

        {
            var container2 = new RUIContainer();
            container2.padding = [2, 2, 2, 2];
            container2.margin = [0, 50, 0, 0];
            container2.height = 94;
            container2.width = 40;
            container2.boxBorder = RUIStyle.Default.primary;
            container2.boxClip = RUIContainerClipType.NoClip;
            container.addChild(container2);


            //clip default
            var r1 = new RUIRectangle();
            r1.width = 50;
            r1.height = 30;
            container2.addChild(r1);

            //clip offset
            var r2 = new RUIRectangle();
            r2.width = 50;
            r2.height = 30;
            r2.position = RUIPosition.Offset;
            r2.left = 20;
            container2.addChild(r2);

            //clip relative clip
            var r3 = new RUIRectangle();
            r3.width = 50;
            r3.height = 30;
            r3.position = RUIPosition.Relative;
            r3.left = 22;
            r3.top = 62;
            container2.addChild(r3);
        }


        {
            var container1 = new RUIContainer();
            container1.padding = [2, 2, 2, 2];
            container1.margin = [0, 50, 0, 0];
            container1.height = 94;
            container1.width = 40;
            container1.boxBorder = RUIStyle.Default.primary;
            container.addChild(container1);

            //clip default
            var r1 = new RUIRectangle();
            r1.width = 50;
            r1.height = 30;
            container1.addChild(r1);

            //clip offset
            var r2 = new RUIRectangle();
            r2.width = 50;
            r2.height = 30;
            r2.position = RUIPosition.Offset;
            r2.left = 20;
            container1.addChild(r2);

            //clip relative clip
            var r3 = new RUIRectangle();
            r3.width = 50;
            r3.height = 30;
            r3.position = RUIPosition.Relative;
            r3.left = 22;
            r3.top = 62;
            container1.addChild(r3);
        }

        {
            var container1 = new RUIContainer();
            container1.padding = [2, 2, 2, 2];
            container1.height = 94;
            container1.width = 40;
            container1.boxBorder = RUIStyle.Default.primary;
            container.addChild(container1);

            //clip default
            var r1 = new RUIRectangle();
            r1.width = 50;
            r1.height = 30;
            r1.isClip = false;
            container1.addChild(r1);

            //clip offset
            var r2 = new RUIRectangle();
            r2.width = 50;
            r2.height = 30;
            r2.position = RUIPosition.Offset;
            r2.left = 20;
            r2.isClip = false;
            container1.addChild(r2);

            //clip relative clip
            var r3 = new RUIRectangle();
            r3.width = 50;
            r3.height = 30;
            r3.position = RUIPosition.Relative;
            r3.left = 22;
            r3.top = 62;
            r3.isClip = false;
            container1.addChild(r3);
        }

        {
            var c = new RUIContainer();
            c.padding = [2, 2, 2, 2];
            c.margin = [0, 0, 0, 50];
            c.height = 100;
            c.width = 100;
            c.boxBorder = RUIStyle.Default.primary;
            container.addChild(c);

            var c1 = new RUIContainer();
            c1.padding = RUI.Vector(10);
            c1.width = 70;
            c1.height = 70;
            c1.boxBorder = RUIStyle.Default.primary;
            c1.position = RUIPosition.Offset;
            c1.left = 50;
            c1.top = 70;
            c1.addChild(new RUIRectangle(60, 60));
            c.addChild(c1);

            var c2 = new RUIContainer();
            c2.boxBorder = RUIStyle.Default.primary;
            c2.boxClip = RUIContainerClipType.ClipSelf;
            c2.position = RUIPosition.Relative;
            c2.padding = RUI.Vector(2);
            c2.width = 70;
            c2.height = 60;
            c2.top = 0;
            c2.right = -30;

            var r2 = new RUIRectangle(70, 60);
            r2.position = RUIPosition.Offset;
            r2.left = -50;
            r2.top = -20;
            c2.addChild(r2);
            c.addChild(c2);

        }


    }

    private WidgetButtons() {
        var label = new RUILabel('2.0-Buttons');
        this.addChild(label);

        this.addChild(new RUIButton('Button1'));

        {
            var btn1 = new RUIButton('LongText');
            btn1.width = 70;
            this.addChild(btn1);
        }

        //Button in container
        {
            var c = new RUIContainer();
            c.width = 100;
            c.padding = [1, 1, 1, -50];
            c.boxBorder = RUIStyle.Default.primary;
            this.addChild(c);

            let btn = new RUIButton('Hello');
            btn.width = 100;
            c.addChild(btn);
        }

        //ButtonGroup
        {
            var btnGroup = new RUIButtonGroup([
                new RUIButton('AAA'),
                new RUIButton('BBB'),
                new RUIButton('CCC'),
                new RUIButton('DDD'),
                new RUIButton('EEE'),
            ], RUIOrientation.Horizontal);
            btnGroup.width = 450;
            this.addChild(btnGroup);

            // let canvas = new RUICanvas();
            // this.addChild(canvas);

            let btnGroupSwitch = new RUIButton('Switch BtnGroup', (b) => {
                let orit = btnGroup.boxOrientation == RUIOrientation.Horizontal;
                btnGroup.boxOrientation = orit ? RUIOrientation.Vertical : RUIOrientation.Horizontal;
                if (orit) {
                    btnGroup.width = 120;
                    btnGroup.height = 70;
                }
                else {
                    btnGroup.width = 450;
                    btnGroup.height = RUIAuto;
                }

            });
            this.addChild(btnGroupSwitch);
        }
    }

    private WidgetLabel() {
        this.addChild(new RUILabel("2.1-Label"));
    }

    private WidgetTabView() {
        {

            let c1 = new RUIContainer();
            c1.addChild(new RUIRectangle(100, 20));
            c1.addChild(new RUIRectangle(40, 50));
            c1.addChild(new RUIRectangle(500, 100));
            c1.addChild(new RUIRectangle(20, 200));

            let tabview1 = new RUITabView([
                { label: 'Tab1', ui: new RUIRectangle(30, 40) },
                { label: 'Tab2', ui: c1 }
            ], RUIConst.LEFT);

            tabview1.width = 400;
            tabview1.height = 300;

            this.addChild(tabview1);
        }
    }

    private WidgetScrollView() {
        this.addChild(new RUILabel("2.2-scrollView"));

        {
            let c = new RUIContainer();
            c.boxOrientation = RUIOrientation.Horizontal;
            this.addChild(c);

            var sbarHorizontal = new RUIScrollBar(RUIOrientation.Horizontal, RUIScrollType.Always);
            sbarHorizontal.width = 500;
            this.addChild(sbarHorizontal);

            let btnszInc = new RUIButton('szInc', (b) => {
                sbarHorizontal.scrollSize += 0.1;
            });
            btnszInc.width = 50;
            c.addChild(btnszInc);
            let btnszDec = new RUIButton('szDec', (b) => {
                sbarHorizontal.scrollSize -= 0.1;
            });
            btnszDec.width = 50;
            c.addChild(btnszDec);

            let btnposInc = new RUIButton('posInc', (b) => {
                sbarHorizontal.scrollPos += 0.1;
            });
            btnposInc.width = 50;
            c.addChild(btnposInc);
            let btnposDec = new RUIButton('posDec', (b) => {
                sbarHorizontal.scrollPos -= 0.1;
            });
            btnposDec.width = 50;
            c.addChild(btnposDec);
        }


        {
            let c2 = new RUIContainer();
            c2.boxOrientation = RUIOrientation.Horizontal;
            c2.margin = [10, 0, 0, 0];
            this.addChild(c2);

            let sbarVertical = new RUIScrollBar(RUIOrientation.Vertical, RUIScrollType.Enabled);
            sbarVertical.height = 120;
            c2.addChild(sbarVertical);


            {
                var sv = new RUIScrollView(RUIScrollType.Always, RUIScrollType.Always);
                sv.margin = [0, 0, 0, 10];
                sv.width = 150;
                sv.height = 150;
                c2.addChild(sv);

                var rect1 = new RUIRectangle(250, 50);
                let btn = new RUIButton('Click', (b) => {
                    if (sv.hasChild(rect1)) {
                        sv.removeChild(rect1);
                    }
                    else {
                        sv.addChild(rect1);
                    }
                })
                btn.width = 100;
                btn.height = 50;

                sv.addChild(new RUIRectangle(50, 50));
                sv.addChild(btn);
                sv.addChild(new RUIRectangle(20, 50));
            }
        }


    }

}