import { UIObject } from "../UIObject";


export class UIButton extends UIObject {

    constructor(w?:number,height?:number){
        super();

        this.width = w;
        this.height = height;
    }
}