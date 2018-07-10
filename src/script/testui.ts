import { UIObject } from "./rui/UIObject";
import { UIButton } from "./rui/UIButton";


export class TestUI extends UIObject{

    constructor(){
        super();
        
        this.style.color = [0.5,0.5,0.5,1.0];
    }

    public onBuild(){

        console.log("testui onbuild");

        this.layout.width = 220;
        this.layout.height = 500;
        this.layout.isDirty = true;

        let flow = this.flow;
        flow.begin();

        flow.addChild(new UIButton());
        flow.addChild(new UIButton());


        flow.end();
    }
}