import { UIObject } from "./rui/UIObject";
import { UIButton } from "./rui/UIButton";


export class TestUI extends UIObject{

    constructor(){
        super();
        
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