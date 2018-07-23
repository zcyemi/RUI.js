import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIStyle } from "../RUIStyle";


export class UIInput extends UIObject {

    public m_label: string;
    public m_text: string;

    public constructor(label: string, content?: string) {
        super();
        this.height = 23;
        this.m_label = label;
        this.m_text = content;
    }

    public get label(): string {
        return this.m_label;
    }
    public set label(val: string) {
        this.m_label = val;
        this.setDirty(true);
    }
    public get text(): string {
        return this.m_text;
    }
    public set text(val: string) {
        this.m_text = val;
        this.setDirty(true);
    }

    public onBuild() {
        this.visible = true;
    }

    public onDraw(cmd: RUIDrawCall) {
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

        let fieldrect = [rect[0] + labelsize,rect[1] + 1,rect[2] - labelsize - 3,rect[3]-2];

        cmd.DrawRectWithColor(fieldrect,RUIStyle.Default.background0);
        let text = this.m_text;
        if(text != null && text != ''){
            cmd.DrawText(text,fieldrect);
        }

        
    }
}