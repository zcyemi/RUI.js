import { UIObject } from "./UIObject";


export class UIButton extends UIObject{

    public onBuild(){
        this.visible = true;
        this.width = 100;
        this.height = 23;
    }
}

export class UIRect extends UIObject{
    public onBuild(){
        this.visible= true;
        this.width = 50;
        this.height = 50;
    }
}