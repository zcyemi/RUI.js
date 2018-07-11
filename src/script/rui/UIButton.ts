import { UIUtil } from "./UIUtil";
import { UIView } from "./UIView";


export class UIButton extends UIView {

    constructor(){
        super();
        this.color = UIUtil.RandomColor();
    }
}