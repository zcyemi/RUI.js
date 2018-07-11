import { UIObject } from "../UIObject";

export class UIGroup extends UIObject{
    
    public isVertical:boolean = true;
    public constructor(isVertical:boolean){
        super();
        this.isVertical = isVertical;
        this.isDrawn = false;
    }
}