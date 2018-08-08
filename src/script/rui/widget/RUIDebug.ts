import { RUIContainer } from "../RUIContainer";
import { RUILabel } from "./UILabel";
import { RUIButton } from "./RUIButton";
import { RUINodeCanvas } from "./RUICanvas";


export class RUIDebug extends RUIContainer{

    public constructor(){
        super();
        this.width = 800;
        this.height = 400;

        let label = new RUILabel('hello world');
        this.addChild(label);


        let button = new RUIButton("button1");
        this.addChild(button);

        let canvas = new RUINodeCanvas();
        this.addChild(canvas);

    }
}