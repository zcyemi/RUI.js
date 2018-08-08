import { RUIContainer } from "../RUIContainer";
import { RUILabel } from "./UILabel";


export class RUIDebug extends RUIContainer{

    public constructor(){
        super();
        this.width = 200;
        this.height = 300;

        let label = new RUILabel('hello world');
        this.addChild(label);

        let label1 = new RUILabel('typescript !');
        this.addChild(label1);
        let label3 = new RUILabel('xdwa-');
        this.addChild(label3);
    }
}