import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIFontTexture } from "../RUIFontTexture";


export abstract class UIField extends UIObject{


    public m_label:string;

    public constructor(label:string){
        super();
        this.m_label = label;
    }

    public onBuild(){
        this.visible = true;
    }

    public get label(): string {
        return this.m_label;
    }
    public set label(val: string) {
        this.m_label = val;
        this.setDirty(true);
    }

    public onDraw(cmd:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];

        let totalWidth = this._width;
        let labelsize = 0;
        let label = this.m_label;
        if(label != null && label != ''){
            labelsize = RUIFontTexture.ASIICTexture.MeasureTextWith(label);
            labelsize = Math.min(labelsize + 10,Math.max(150,totalWidth *0.5));
            let labelRect = [rect[0],rect[1],labelsize,rect[3]];
            cmd.DrawText(label,labelRect);
        }
    }
}