import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIStyle } from "../RUIStyle";
import { RUIEvent } from "../RUIEventSys";
import { RUICursorType } from "../RUICursor";


export class UIInput extends UIObject {

    public m_text: string;

    public m_isFocuesd: boolean =false;

    public constructor(content?: string) {
        super();
        this.height = 23;
        this.m_text = content;

        this.color = RUIStyle.Default.background0;
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

    // public onMouseDown(){
    //     this.color = RUIStyle.Default.background2;
    //     this.m_isFocuesd= true;

    //     console.log('mouse down');
    // }

    public onMouseEnter(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.text);
        this.color = RUIStyle.Default.background1;
        this.setDirty(true);
    }

    public onMouseLeave(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.default);
        this.color = RUIStyle.Default.background0;
        this.m_isFocuesd= false;
        this.setDirty(true);
    }

    public onDraw(cmd: RUIDrawCall) {
        let rect = [this._calculateX,this._calculateY,this._width,this._height];

        cmd.DrawRectWithColor(rect,this.color);
        let text = this.m_text;
        if(text != null && text != ''){
            cmd.DrawText(text,rect);
        }

        
    }
}