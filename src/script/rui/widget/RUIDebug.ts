import { RUIContainer } from "../RUIContainer";
import { RUILabel } from "./UILabel";
import { RUIButton } from "./RUIButton";
import { RUICanvas } from "./RUICanvas";
import { RUIScrollView } from "./RUIScrollView";
import { RUIRectangle } from "../RUIRectangle";


export class RUIDebug extends RUIContainer{

    public constructor(){
        super();
        this.width = 800;


        let label = new RUILabel('hello world');
        this.addChild(label);


        let button = new RUIButton("button1");
        this.addChild(button);

        let canvas = new RUICanvas();
        this.addChild(canvas);


        {
            let scrollview = new RUIScrollView();
            scrollview._debuglog = true;
            scrollview.width = 400;
            scrollview.height= 300;
            this.addChild(scrollview);

            for(var i=0;i<10;i++){
                let rect1 = new RUIRectangle();
                rect1.width = 20 + 100* Math.random();
                rect1.height = 20 + 50 * Math.random();

                scrollview.addChild(rect1);
            }

            

            console.log(scrollview);
            
        }


    }
}