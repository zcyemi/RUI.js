import {RUIContainer, RUIContainerClipType} from "../RUIContainer";
import {RUILabel} from "./RUILabel";
import {RUIButton} from "./RUIButton";
import {RUIRectangle} from "../RUIRectangle";
import {RUIPosition, RUIOrientation, RUIAuto, RUIConst} from "../RUIObject";
import {RUIButtonGroup} from "./RUIButtonGroup";
import {RUIStyle} from "../RUIStyle";
import {RUIRenderer} from "../RUIRenderer";
import {RUIFlexContainer} from "../RUIFlexContainer";
import {RUI} from "../RUI";
import {RUITabView, RUITabPage} from "./RUITabView";
import {RUIScrollBar} from "./RUIScrollBar";
import {RUIScrollView} from "./RUIScrollView";
import {RUICollapsibleContainer} from "./RUICollapsibleContainer";
import { RUITextInput, RUITextInputFormat } from "./RUITextInput";
import { RUIInput } from "../RUIInput";
import { RUITextField, RUICheckBoxField, RUIIntegerField, RUIFloatField } from "./RUIField";
import { RUICheckBox } from "./RUICheckBox";
import { RUISlider } from "./RUISlider";
import { RUISliderInput } from "./RUISliderInput";

export class RUIDebug extends RUIContainer {

    public constructor() {
        super();
        this.boxBorder = RUIStyle.Default.border0;


        let pages : RUITabPage[] = [];

        pages.push({label: 'basis', ui: new RUIPageBasis()});
        pages.push({label: 'layout', ui: new RUIPageLayout()});
        pages.push({label: 'container', ui: new RUIPageContainer()});
        pages.push({label: 'widget', ui: new RUIPageWidget()});
        pages.push({label: 'compoundwidget', ui: new RUIPageCompoundWiget()});

        let tabview = new RUITabView(pages, RUIConst.LEFT);
        this.addChild(tabview);

    }

}

export class RUIPageBasis extends RUIContainer {

    public constructor() {
        super();
        RUIPageBasis.PageBasicResize(this);
        RUIPageBasis.PageBasisAddRemove(this);
        //RUIPageBasis.PageBasisToggleEnable(this);
    }

    public static PageBasisAddRemove(parent : RUIContainer) {
        var collapse = new RUICollapsibleContainer('remove/add children', true);
        parent.addChild(collapse);

        var c = new RUIContainer();
        c.boxOrientation = RUIOrientation.Horizontal;
        collapse.addChild(c);

        let btnAdd = new RUIButton('Add', (b) => {
            c.addChild(new RUIRectangle(20, 20));
            c.setDirty();
        });
        btnAdd.width = 100;
        collapse.addChild(btnAdd);

        let btnDel = new RUIButton('Remove', (b) => {
            c.removeChildByIndex(0);
        });
        btnDel.width = 100;
        collapse.addChild(btnDel);

    }

    public static PageBasicResize(parent : RUIContainer) {

        var collapse = new RUICollapsibleContainer('Resize', true);
        parent.addChild(collapse);

        var container = new RUIContainer();
        container.boxBackground = RUI.RED;
        container.width = 200;
        collapse.addChild(container);

        var c = new RUIContainer();
        container.addChild(c);
        var rect = new RUIRectangle(100, 100);
        c.addChild(rect);
        c.addChild(new RUIButton("+", b => {
            rect.width += 10;
        }));
        c.addChild(new RUIButton("-", b => {
            rect.width -= 10;
        }))
    }

    public static PageBasisToggleEnable(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('Enable/Disable', true);
        collapse.width = 400;
        parent.addChild(collapse);

        {
            collapse.addChild(new RUILabel('container'));
            let c = new RUIContainer();
            c.padding = RUI.Vector(3);
            c.boxBorder = RUIStyle.Default.primary;
            collapse.addChild(c);

            var r1 = new RUIRectangle(120, 20);
            let btn = new RUIButton('enable/disable', (b) => {
                r1.enabled = !r1.enabled;
                r1.setDirty(true);
            });
            btn.width = 100;
            c.addChild(btn);
            c.addChild(r1);
        }

        {
            collapse.addChild(new RUILabel('container has single child'));

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

            collapse.addChild(c);
            collapse.addChild(btn);
        }

        {
            collapse.addChild(new RUILabel('flex'));

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
            collapse.addChild(c);
        }

        {
            collapse.addChild(new RUILabel('flex has single child'));
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

            collapse.addChild(c2);
            collapse.addChild(btn);
        }
    }
}

export class RUIPageLayout extends RUIContainer {

    public constructor() {
        super();
        this.PageLayoutClip(this);
        this.PageLayoutMargin(this);
    }

    private PageLayoutClip(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('Clip', true);
        parent.addChild(collapse);

        
        collapse.addChild(new RUILabel('RUIContainerClipType.Clip'));
        {
            let c1 = new RUIContainer();
            c1.boxOrientation = RUIOrientation.Horizontal;
            c1.boxBorder = RUI.WHITE;
            c1.padding = RUI.Vector(3);
            c1.width = 400;
            c1.height = 75;
            collapse.addChild(c1);

            c1.addChild(new RUIRectangle(50,100));
            
            let r2 = new RUIRectangle(50,100);
            r2.position = RUIPosition.Offset;
            r2.width = 50;
            r2.height = 100;
            r2.top = 25;
            c1.addChild(r2);

            let r3 = new RUIRectangle(50,100);
            r3.position = RUIPosition.Relative;
            r3.top =25;
            r3.left = 100;
            c1.addChild(r3);

            let r4 = new RUIRectangle(50,100);
            r4.isClip =false;
            c1.addChild(r4);

        }


        collapse.addChild(new RUILabel('RUIContainerClipType.clipself'));

        let wrap = new RUIContainer();
        //collapse.addChild(wrap);

        // {
        //     let container2 = new RUIContainer();
        //     container2.padding = [2, 2, 2, 2];
        //     container2.margin = [0, 50, 0, 0];
        //     container2.height = 94;
        //     container2.width = 40;
        //     container2.boxBorder = RUIStyle.Default.primary;
        //     container2.boxClip = RUIContainerClipType.NoClip;
        //     wrap.addChild(container2);
        //     //clip default
        //     let r1 = new RUIRectangle();
        //     r1.width = 50;
        //     r1.height = 30;
        //     container2.addChild(r1);
        //     //clip offset
        //     let r2 = new RUIRectangle();
        //     r2.width = 50;
        //     r2.height = 30;
        //     r2.position = RUIPosition.Offset;
        //     r2.left = 20;
        //     container2.addChild(r2);
        //     //clip relative clip
        //     let r3 = new RUIRectangle();
        //     r3.width = 50;
        //     r3.height = 30;
        //     r3.position = RUIPosition.Relative;
        //     r3.left = 22;
        //     r3.top = 62;
        //     container2.addChild(r3);
        // }

        // {
        //     let container1 = new RUIContainer();
        //     container1.padding = [2, 2, 2, 2];
        //     container1.margin = [0, 50, 0, 0];
        //     container1.height = 94;
        //     container1.width = 40;
        //     container1.boxBorder = RUIStyle.Default.primary;
        //     wrap.addChild(container1);
        //     //clip default
        //     let r1 = new RUIRectangle();
        //     r1.width = 50;
        //     r1.height = 30;
        //     container1.addChild(r1);
        //     //clip offset
        //     let r2 = new RUIRectangle();
        //     r2.width = 50;
        //     r2.height = 30;
        //     r2.position = RUIPosition.Offset;
        //     r2.left = 20;
        //     container1.addChild(r2);
        //     //clip relative clip
        //     let r3 = new RUIRectangle();
        //     r3.width = 50;
        //     r3.height = 30;
        //     r3.position = RUIPosition.Relative;
        //     r3.left = 22;
        //     r3.top = 62;
        //     container1.addChild(r3);
        // }

        // {
        //     let container1 = new RUIContainer();
        //     container1.padding = [2, 2, 2, 2];
        //     container1.height = 94;
        //     container1.width = 40;
        //     container1.boxBorder = RUIStyle.Default.primary;
        //     wrap.addChild(container1);
        //     //clip default
        //     let r1 = new RUIRectangle();
        //     r1.width = 50;
        //     r1.height = 30;
        //     r1.isClip = false;
        //     container1.addChild(r1);
        //     //clip offset
        //     let r2 = new RUIRectangle();
        //     r2.width = 50;
        //     r2.height = 30;
        //     r2.position = RUIPosition.Offset;
        //     r2.left = 20;
        //     r2.isClip = false;
        //     container1.addChild(r2);
        //     //clip relative clip
        //     let r3 = new RUIRectangle();
        //     r3.width = 50;
        //     r3.height = 30;
        //     r3.position = RUIPosition.Relative;
        //     r3.left = 22;
        //     r3.top = 62;
        //     r3.isClip = false;
        //     container1.addChild(r3);
        // }

        // {
        //     let c = new RUIContainer();
        //     c.padding = [2, 2, 2, 2];
        //     c.margin = [0, 0, 0, 50];
        //     c.height = 100;
        //     c.width = 100;
        //     c.boxBorder = RUIStyle.Default.primary;
        //     wrap.addChild(c);

        //     let c1 = new RUIContainer();
        //     c1.padding = RUI.Vector(10);
        //     c1.width = 70;
        //     c1.height = 70;
        //     c1.boxBorder = RUIStyle.Default.primary;
        //     c1.position = RUIPosition.Offset;
        //     c1.left = 50;
        //     c1.top = 70;
        //     c1.addChild(new RUIRectangle(60, 60));
        //     c.addChild(c1);

        //     let c2 = new RUIContainer();
        //     c2.boxBorder = RUIStyle.Default.primary;
        //     c2.boxClip = RUIContainerClipType.ClipSelf;
        //     c2.position = RUIPosition.Relative;
        //     c2.padding = RUI.Vector(2);
        //     c2.width = 70;
        //     c2.height = 60;
        //     c2.top = 0;
        //     c2.right = -30;

        //     let r2 = new RUIRectangle(70, 60);
        //     r2.position = RUIPosition.Offset;
        //     r2.left = -50;
        //     r2.top = -20;
        //     c2.addChild(r2);
        //     c.addChild(c2);
        // }
    }

    private PageLayoutMargin(parent:RUIContainer){
        var collapse = new RUICollapsibleContainer('Margin',true);
        parent.addChild(collapse);

        //Horizontal
        {
            collapse.addChild(new RUILabel('Horizontal'));

            let c1 = new RUIContainer(RUIOrientation.Horizontal);
            collapse.addChild(c1);

            c1.boxBorder= RUI.WHITE;
            c1.padding = RUI.Vector(5);

            let r1 = new RUIRectangle(100,100);
            r1.margin = [0,20,20,0];
            c1.addChild(r1);

            let r2 = new RUIRectangle(50,50);
            r2.margin = [10,50,0,30];
            c1.addChild(r2);

        }
    }
}

export class RUIPageContainer extends RUIContainer {
    public constructor() {
        super();

        this.PageContainerRUIContainer(this);
        this.PageContainerFlexContainer(this);
        this.PageContainerMarginPadding(this);
    }

    public PageContainerRUIContainer(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('RUIContainer', true);
        parent.addChild(collapse);

        {
            //collapse.addChild(new RUILabel('Vertical'));

            let c = new RUIContainer();
            collapse.addChild(c);
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;

            c.addChild(new RUIRectangle(50, 30));
            c.addChild(new RUIRectangle(100, 30));
        }

        {
            //collapse.addChild(new RUILabel('Horizontal'));

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
            //collapse.addChild(new RUILabel('Nested'));

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

    public PageContainerMarginPadding(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('Margin/Padding', true);
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

    public PageContainerFlexContainer(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('FlexContainer', true);
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

}

export class RUIPageCompoundWiget extends RUIContainer {

    public constructor() {
        super();

        this.WidgetScrollView(this);
        this.WidgetTabView(this);
    }

    private WidgetTabView(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('tabview', true);
        parent.addChild(collapse);

        {

            let c1 = new RUIContainer();
            c1.addChild(new RUIRectangle(100, 20));
            c1.addChild(new RUIRectangle(40, 50));
            c1.addChild(new RUIRectangle(500, 100));
            c1.addChild(new RUIRectangle(20, 200));

            let tabview1 = new RUITabView([
                {
                    label: 'Tab1',
                    ui: new RUIRectangle(30, 40)
                }, {
                    label: 'Tab2',
                    ui: c1
                }
            ], RUIConst.LEFT);
            tabview1.width = 400;
            tabview1.height = 300;

            collapse.addChild(tabview1);
        }
    }

    private WidgetScrollView(parent : RUIContainer) {
        let collapse = new RUICollapsibleContainer('scrollview', true);
        parent.addChild(collapse);
        {
            let c = new RUIContainer();
            c.boxOrientation = RUIOrientation.Horizontal;
            collapse.addChild(c);

            var sbarHorizontal = new RUIScrollBar();
            collapse.addChild(sbarHorizontal);

            let btngroup = new RUIButtonGroup([
                new RUIButton('szInc', (b) => {
                    sbarHorizontal.sizeVal += 0.1;
                }),
                new RUIButton('szDec', (b) => {
                    sbarHorizontal.sizeVal -= 0.1;
                }),
                new RUIButton('posInc', (b) => {
                    sbarHorizontal.scrollPosVal += 0.1;
                }),
                new RUIButton('posDec', (b) => {
                    sbarHorizontal.scrollPosVal -= 0.1;
                })
            ], RUIOrientation.Horizontal);
            c.addChild(btngroup);
        }

        {
            let c2 = new RUIContainer();
            c2.boxOrientation = RUIOrientation.Horizontal;
            c2.margin = [10, 0, 0, 0];
            collapse.addChild(c2);

            let sbarVertical = new RUIScrollBar();
            sbarVertical.height = 120;
            c2.addChild(sbarVertical);

            {
                var sv = new RUIScrollView();
                sv.margin = [0, 0, 0, 10];
                sv.width = 150;
                sv.height = 150;
                c2.addChild(sv);

                var rect1 = new RUIRectangle(250, 50);
                let btn = new RUIButton('Click', (b) => {
                    if (sv.hasChild(rect1)) {
                        sv.removeChild(rect1);
                    } else {
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

export class RUIPageWidget extends RUIContainer {
    public constructor() {
        super();
        this.WidgetButtons(this);
        this.WidgetInput(this);
        this.WidgetField(this);
    }

    private WidgetButtons(parent : RUIContainer) {

        let collapse = new RUICollapsibleContainer('Button', true);
        parent.addChild(collapse);
        {
            let btn1 = new RUIButton('LongText');
            btn1.width = 70;
            collapse.addChild(btn1);
        }
        //Button in container
        {
            let c = new RUIContainer();
            c.width = 100;
            c.padding = [1, 1, 1, -50];
            c.boxBorder = RUIStyle.Default.primary;
            collapse.addChild(c);
            let btn = new RUIButton('Hello');
            btn.width = 100;
            c.addChild(btn);
        }
        //ButtonGroup
        {
            let btnGroup = new RUIButtonGroup([
                new RUIButton('AAA'), new RUIButton('BBB'), new RUIButton('CCC'), new RUIButton('DDD'), new RUIButton('EEE')
            ], RUIOrientation.Horizontal);
            btnGroup.width = 450;
            collapse.addChild(btnGroup);
            let btnGroupSwitch = new RUIButton('Switch BtnGroup', (b) => {
                let orit = btnGroup.boxOrientation == RUIOrientation.Horizontal;
                btnGroup.boxOrientation = orit
                    ? RUIOrientation.Vertical
                    : RUIOrientation.Horizontal;
                if (orit) {
                    btnGroup.width = 120;
                    btnGroup.height = 70;
                } else {
                    btnGroup.width = 450;
                    btnGroup.height = RUIAuto;
                }

            });
            btnGroupSwitch.width = 200;
            collapse.addChild(btnGroupSwitch);
        }
    }

    private WidgetInput(parent:RUIContainer){
        let collapse = new RUICollapsibleContainer('Input',true);
        parent.addChild(collapse);

        let input = new RUITextInput('hello');
        collapse.addChild(input);

        let inputnumber = new RUITextInput('number input',RUITextInputFormat.NUMBER);
        collapse.addChild(inputnumber);

        let inputemail = new RUITextInput('email input', RUITextInputFormat.EMAIL);
        collapse.addChild(inputemail);
    }

    private WidgetField(parent:RUIContainer){
        let collapse = new RUICollapsibleContainer('Fields',true);
        parent.addChild(collapse);

        let textField= new RUITextField('TextField','contents');
        collapse.addChild(textField);

        let textFieldFixedSize = new RUITextField('TextField','fixed size');
        textFieldFixedSize.width = 300;
        collapse.addChild(textFieldFixedSize);


        {
            collapse.addChild(new RUILabel('checkbox'));
            collapse.addChild(new RUICheckBox(true));

            let checkboxField = new RUICheckBoxField('CheckboxField',true);
            collapse.addChild(checkboxField);
            let checkboxFieldFixedSize = new RUICheckBoxField('CheckboxField',false);
            checkboxFieldFixedSize.width = 300;
            collapse.addChild(checkboxFieldFixedSize);
        }

        {
            collapse.addChild(new RUILabel('slider'));
            collapse.addChild(new RUISlider(0.5));

            collapse.addChild(new RUILabel('sliderInput-[0.0,1.0]'));
            collapse.addChild(new RUISliderInput(0.5,0,1.0,false));

            collapse.addChild(new RUILabel('sliderInput-[-10,100]'));
            collapse.addChild(new RUISliderInput(50,-10,100,true));

            collapse.addChild(new RUILabel('integerfield'));
            collapse.addChild(new RUIIntegerField('Integer',50));

            collapse.addChild(new RUILabel('Floatfield'));
            collapse.addChild(new RUIFloatField('Float-xfwhoiyffes',0.3));
        }
    }

}
