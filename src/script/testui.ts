import { UIObject } from "./rui/UIObject";
import { UIButton } from "./rui/UIButton";
import { UIView } from "./rui/UIView";
import { UIBuilder } from "./rui/UIBuilder";
import { UIDocument } from "./rui/UIDocument";


export class TestUI extends UIDocument{

    constructor(){
        super();
        this.width = 800;
        this.height = 600;
    }

    public onBuild(builder:UIBuilder){
        console.log("testui onbuild");

        builder.flexStart(true);

        builder.flexChildFlex(new UIButton(),1);
        builder.flexChildFixed(new UIButton(),100);
        builder.flexChildFlex(new UIButton(),1);

        builder.flexEnd();


    }
}