import { UIObject, UIOrientation } from "./UIObject";
import { UIButton, UIRect } from "./UIWidgets";


export class DebugUI extends UIObject{


    public onBuild(){
        
        this.addChild(new UIButton());

        let c = new UIObject();
        c.orientation = UIOrientation.Horizontal;
        c.addChild(new UIRect());
        c.addChild(new UIRect());

        this.addChild(c);

        this.addChild(new UIRect());
    }
}