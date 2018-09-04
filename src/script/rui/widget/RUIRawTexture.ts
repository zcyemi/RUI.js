import { RUIObject } from './../RUIObject'
import { RUICmdList } from '../RUICmdList';
import { RUIColor } from '../RUIColor';

export class RUIRawTexture extends RUIObject{
    private m_texture:WebGLTexture;
    public constructor(rawtexture:WebGLTexture){
        super();
        this.m_texture = rawtexture;

    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);

        if(this.m_texture != null){
            cmd.DrawTexture(this.m_texture,this._rect,this._drawClipRect);
        }
        else{
            cmd.DrawRectWithColor(this._rect,RUIColor.COLOR_ERROR,this._drawClipRect);
        }
    }
}