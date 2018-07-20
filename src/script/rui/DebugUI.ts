import { UIObject, UIOrientation } from "./UIObject";
import { UIButton, UIRect } from "./UIWidgets";


export class DebugUI extends UIObject{


    public onBuild(){
        

        let btn1 = new UIButton();

        btn1.EvtMouseClick.on((e)=>{
            console.log('btn1 click');
        });
        this.addChild(btn1);

        let c = new UIObject();
        c.orientation = UIOrientation.Horizontal;
        c.addChild(new UIRect());
        c.addChild(new UIRect());

        this.addChild(c);

        this.addChild(new UIRect());
    }
}