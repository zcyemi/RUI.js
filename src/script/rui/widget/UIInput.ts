import { UIObject } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIFontTexture } from "../RUIFontTexture";
import { RUIStyle } from "../RUIStyle";
import { RUIEvent } from "../RUIEventSys";
import { RUICursorType } from "../RUICursor";


export class UIInput extends UIObject {

    public m_text: string;

    public m_isFocuesd: boolean =false;
    private m_isOnHover:boolean = false;

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

    public onActive(){
        this.m_isFocuesd= true;
        this.setColor();
        this.setDirty(true);
    }
    public onInactive(){
        this.m_isFocuesd= false;
        this.setColor();
        this.setDirty(true);
    }

    public onMouseEnter(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.text);
        this.m_isOnHover = true;
        this.setColor();
        this.setDirty(true);
    }

    public onMouseLeave(e:RUIEvent){
        e.canvas.cursor.SetCursor(RUICursorType.default);
        this.m_isOnHover = false;
        this.setColor();
        this.setDirty(true);
    }

    private setColor(){
        let style = RUIStyle.Default;
        if(this.m_isFocuesd){
            this.color = style.background2;
        }
        else{
            this.color = this.m_isOnHover? style.background1: style.background0;
        }
    }

    public onDraw(cmd: RUIDrawCall) {
        let rect = [this._calculateX,this._calculateY,this._width,this._height];

        cmd.DrawRectWithColor(rect,this.color);
        let text = this.m_text;
        if(text != null && text != ''){
            cmd.DrawText(text,rect);
        }

        if(this.m_isFocuesd){
            let offset = 1;
            let borderR = [rect[0]+offset,rect[1]+offset,rect[2]-2 * offset,rect[3]-2* offset];
            cmd.DrawBorder(borderR,RUIStyle.Default.primary);
        }

        
    }
}