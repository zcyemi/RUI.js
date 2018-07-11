import { UIObject } from "./rui/UIObject";
import { UIButton } from "./rui/widget/UIButton";
import { UIBuilder } from "./rui/UIBuilder";


export class TestUI extends UIObject{

    constructor(){
        super();
        this.isDrawn = false;
    }

    public onBuild(builder:UIBuilder){
        console.log("testui onbuild");

        builder.Start();


        builder.addChild(new UIButton(100));
        builder.addChild(new UIButton(200));

        builder.GroupBegin(false,500);
        {
            builder.addChild(new UIButton(50));
            builder.addChild(new UIButton(200));
        }
        builder.GroupEnd();

        builder.End();

    }
}