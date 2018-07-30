import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";


export class UILable  extends UIObject{

    private m_label :string;
    public constructor(label:string){
        super();
        this.m_label = label;
    }

    public onBuild(){
        this.visibleSelf = true;
    }

    public onDraw(cmd:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        let l = this.m_label;
        if(l != null && l != ''){
            cmd.DrawText(l,rect);
        }
    }
}