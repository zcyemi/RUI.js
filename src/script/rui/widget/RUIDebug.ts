import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUILabel } from "./UILabel";
import { RUIButton } from "./RUIButton";
import { RUICanvas } from "./RUICanvas";
import { RUIScrollView } from "./RUIScrollView";
import { RUIRectangle } from "../RUIRectangle";
import { RUIPosition, RUIOrientation, RUIAuto } from "../RUIObject";
import { RUITestWidget } from "./RUITestWidget";
import { RUIButtonGroup } from "./RUIButtonGroup";
import { RUIStyle } from "../RUIStyle";
import { RUIRenderer } from "../RUIRenderer";
import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUIColor } from "../RUIColor";


export class RUIDebug extends RUIContainer {

    public constructor() {
        super();
        this.width = 800;
        this.padding = [10, 10, 10, 10];
        this.boxBorder = RUIColor.Red;
        this.boxClip = RUIContainerClipType.NoClip;

        this.LayoutContainer();
        this.LayoutFlexContainer();
        this.LayoutClip();

        this.Buttons();

        // let button = new RUIButton("button1");
        // this.addChild(button);

        // {
        //     var btnGroup = new RUIButtonGroup([
        //         new RUIButton('AAA'),
        //         new RUIButton('BBB'),
        //         new RUIButton('CCC'),
        //         new RUIButton('DDD'),
        //         new RUIButton('EEE'),
        //     ],RUIOrientation.Horizontal);
        //     btnGroup.width = 450;
        //     this.addChild(btnGroup);

        //     // let canvas = new RUICanvas();
        //     // this.addChild(canvas);

        //     let btnGroupSwitch = new RUIButton('Switch BtnGroup',(b)=>{
        //         let orit = btnGroup.boxOrientation == RUIOrientation.Horizontal;
        //         btnGroup.boxOrientation = orit ? RUIOrientation.Vertical : RUIOrientation.Horizontal;
        //         if(orit){
        //             btnGroup.width =120;
        //             btnGroup.height = 70;
        //         }
        //         else{
        //             btnGroup.width = 450;
        //             btnGroup.height = RUIAuto;
        //         }

        //     });
        //     this.addChild(btnGroupSwitch);
        // }





        // {
        //     let rect1 = new RUIRectangle();
        //     rect1.height= 400;
        //     rect1.width =10;
        //     this.addChild(rect1);

        // }

        // {
        //     //relative container test


        //     var rcontainer = new RUIContainer();
        //     rcontainer.position = RUIPosition.Relative;
        //     rcontainer.left = 20;
        //     rcontainer.right = 400;
        //     rcontainer.top = 410;
        //     rcontainer.bottom = 10;
        //     this.addChild(rcontainer);
        //     var rect1 =new RUIRectangle();
        //     rect1.width = 20;
        //     rect1.height = 20;

        //     var t = ()=>{

        //         rect1.height= Math.random() *100;
        //         rect1.setDirty(true);
        //         setTimeout(t, 1000);
        //     }

        //     setTimeout(t, 1000);

        //     rcontainer.addChild(rect1);
        // }




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

    private LayoutContainer(){
        var label = new RUILabel('1.0-Container');
        this.addChild(label);

        var container = new RUIContainer();
        this.addChild(container);
        container.boxOrientation = RUIOrientation.Horizontal;
        container.boxBorder = RUIStyle.Default.primary;
        container.padding = [3,3,3,3];
        container.margin = [0,0,10,0];

        //vertical
        {
            var c =new RUIContainer();
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            container.addChild(c);

            c.addChild(new RUIRectangle(50,30));
            c.addChild(new RUIRectangle(100,30));
        }

        //horizontal
        {
            var c = new RUIContainer();
            c.boxBorder = RUIStyle.Default.primary;
            c.margin = [0,0,0,10];
            c.boxOrientation = RUIOrientation.Horizontal;
            container.addChild(c);

            c.addChild(new RUIRectangle(30,50));
            c.addChild(new RUIRectangle(30,100));
            c.addChild(new RUIRectangle(30,70));
        }

        //nested 
        {
            var c = new RUIContainer();
            c.boxBorder = RUIStyle.Default.primary;
            c.margin = [0,0,0,10];
            c.boxOrientation = RUIOrientation.Vertical;
            container.addChild(c);

            c.addChild(new RUIRectangle(50,30));
            {
                var c1 = new RUIContainer();
                c1.boxOrientation = RUIOrientation.Horizontal;
                c1.addChild(new RUIRectangle(30,30));
                c1.addChild(new RUIRectangle(30,50));
                c1.addChild(new RUIRectangle(30,10));

                c.addChild(c1);
            }
            c.addChild(new RUIRectangle(70,30));
        }
    }

    private LayoutFlexContainer(){
        var label = new RUILabel('1.1-FlexContainer');
        this.addChild(label);

        var container = new RUIContainer();
        this.addChild(container);
        container.boxOrientation = RUIOrientation.Horizontal;
        container.boxBorder = RUIStyle.Default.primary;
        container.padding = [3,3,3,3];
        container.margin = [0,0,10,0];

        //Flex vertical
        {
            var c = new RUIFlexContainer();
            container.addChild(c);
            c.boxOrientation = RUIOrientation.Horizontal;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3,3,3,3];
            c.margin = [0,10,0,0];
            c.width = 100;
            c.height = 70;

            var r1 = new RUIRectangle();
            r1.flex = 1;
            var r2 = new RUIRectangle();
            r2.flex = 1;
            r2.height = 40;
            
            var r3 = new RUIRectangle();
            r3.flex = 2;
            r3.height = 30;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        //Flex horizontal
        {
            var c = new RUIFlexContainer();
            container.addChild(c);
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3,3,3,3];
            c.margin = [0,10,0,0];
            c.width = 100;
            c.height = 70;

            var r1 = new RUIRectangle();
            r1.flex = 1;
            r1.width = 50;
            var r2 = new RUIRectangle();
            r2.flex = 1;
            r2.width= 70;
            var r3 = new RUIRectangle();
            r3.flex = 2;
            r3.width = 60;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        //Flex vertical exten
        {
            var c = new RUIFlexContainer();
            c._debugname ="hhhh";
            container.addChild(c);
            c.boxOrientation = RUIOrientation.Horizontal;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3,3,3,3];
            c.margin = [0,10,0,0];
            c.width = 100;

            //auto expands to container's height
            var r1 = new RUIRectangle();
            r1.flex = 1;

            var r2 = new RUIRectangle();
            r2.flex = 1;
            r2.height = 60;
            
            var r3 = new RUIRectangle();
            r3.flex = 2;
            r3.height = 30;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }

        //Flex horizontal exten
        {
            var c = new RUIFlexContainer();
            container.addChild(c);
            c.boxOrientation = RUIOrientation.Vertical;
            c.boxBorder = RUIStyle.Default.primary;
            c.padding = [3,3,3,3];
            c.margin = [0,10,0,0];
            c.height = 70;

            var r1 = new RUIRectangle();
            r1.flex = 1;
            r1.width = 50;
            var r2 = new RUIRectangle();
            r2.flex = 1;
            r2.width= 100;
            var r3 = new RUIRectangle();
            r3.flex = 2;

            c.addChild(r1);
            c.addChild(r2);
            c.addChild(r3);
        }
    }

    private LayoutClip() {

        var label = new RUILabel('1.1-LayoutClip');
        this.addChild(label);

        var container = new RUIContainer();
        this.addChild(container);
        container.boxOrientation = RUIOrientation.Horizontal;
        container.boxBorder = RUIStyle.Default.primary;
        container.padding = [3,3,3,3];

        {
            var container2 = new RUIContainer();
            container2.padding = [2, 2, 2, 2];
            container2.margin = [0,50,0,0];
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
            container1.margin = [0,50,0,0];
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

        

    }

    private Buttons(){
        var label =new RUILabel('2.0-Buttons');
        this.addChild(label);

        this.addChild(new RUIButton('Button1'));

        //Button in container
        {

        }
    }
}