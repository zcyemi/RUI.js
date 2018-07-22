import { UIObject, UIOrientation, UIDisplayMode } from "./UIObject";
import { UIButton, UIRect } from "./UIWidgets";
import { RUIDrawCall } from "./RUIDrawCall";
import { UIUtil } from "./UIUtil";


export class DebugUI extends UIObject{

    private m_header:UIObject;

    public onBuild(){


        this.visible = true;

        this.displayMode = UIDisplayMode.Flex;

        let header =new UIRect();
        header.height = 23;
        this.m_header = header;
        this.addChild(header);

        
        let main = new UIRect();
        main.flex = 1;
        main.displayMode = UIDisplayMode.Flex;
        main.orientation=  UIOrientation.Horizontal;
        this.addChild(main);


        let c = new UIRect();
        c.flex = 2;
        main.addChild(c);

        let x = new UIRect();
        x.flex = 3;
        main.addChild(x);

        // let btn1 = new UIButton();

        // btn1.EvtMouseClick.on((e)=>{
        //     console.log('btn1 click');
        // });
        // this.addChild(btn1);

        // let c = new UIObject();
        // c.orientation = UIOrientation.Horizontal;
        // c.addChild(new UIRect());
        // c.addChild(new UIRect());

        // this.addChild(c);

        // this.addChild(new UIRect());
    }

    public onDraw(drawcall:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
    }
}