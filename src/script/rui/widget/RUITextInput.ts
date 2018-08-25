import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIContainer } from "../RUIContainer";
import { RUIStyle } from "../RUIStyle";
import { RUIKeyboardEvent, RUIEvent, RUIEventEmitter } from "../RUIEvent";
import { RUIInput } from "../RUIInput";
import { RUI } from "../RUI";


export class RUITextInputFormat{
    private m_regexp: RegExp;
    public constructor(r:RegExp){
        this.m_regexp =  r;
    }

    public static NUMBER :RUITextInputFormat = new RUITextInputFormat(/^[\d]+[.[\d]+]*$/);
    public static DEFAULT:RUITextInputFormat = new RUITextInputFormat(null);
    public static EMAIL: RUITextInputFormat = new RUITextInputFormat(/\S+@\S+\.\S+/);

    public verify(text:string):boolean{
        if(this.m_regexp == null)return true;
        return this.m_regexp.test(text);
    }
}

export class RUITextInput extends RUIObject{

    private m_content:string;
    private m_isError:boolean = false;
    private m_onActive:boolean =false;

    public EventOnTextChange:RUIEventEmitter<string> = new RUIEventEmitter();

    public inputFormat: RUITextInputFormat;

    public constructor(content?:string,format:RUITextInputFormat = RUITextInputFormat.DEFAULT){
        super();
        this.m_content = content;
        this.inputFormat = format;
        this.height = RUI.LINE_HEIGHT_DEFAULT;
        this.width = 200;

        this.m_isError = !format.verify(this.m_content);
    }

    public get content():string{
        return this.m_content;
    }
    public set content(content:string){
        let curcontent = this.m_content;
        if(content === curcontent) return;
        this.m_content = content;
        this.setDirty();
    }


    public onActive(){
        this.m_onActive = true;
        this.setDirty();
    }

    public onInactive(){
        this.m_onActive =false;
        this.setDirty();
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);

        let cliprect =this._drawClipRect;
        if(cliprect == null) return;

        cmd.DrawText(this.m_content,this._rect,null,cliprect);

        let color = RUIStyle.Default.primary0;
        if(this.m_isError){
            color = RUI.RED;
        }
        else if(this.m_onActive){
            color = RUIStyle.Default.primary;
        }

        cmd.DrawBorder(this._rect,color,cliprect);
    }

    public onKeyPress(e:RUIKeyboardEvent){
        let newcontent = RUIInput.ProcessTextKeyDown(this.m_content,e);
        if(newcontent === this.m_content){
            return;
        }
        this.m_content = newcontent;
        this.m_isError = !this.inputFormat.verify(this.m_content);
        this.setDirty();
        this.EventOnTextChange.emitRaw(newcontent);
    }


}