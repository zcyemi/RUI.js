import { UIObject } from "./UIObject";
import { UIUtil } from "./UIUtil";


export class UIButton extends UIObject{

    constructor(){
        super();

        this.style.color = UIUtil.RandomColor();
    }
}