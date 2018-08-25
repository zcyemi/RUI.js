import { RUIObject, RUIAuto } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUI } from "../RUI";
import { RUIBind } from "../RUIBinder";

export class RUIImage extends RUIObject{

    private m_image:HTMLImageElement;
    private m_valid:boolean = false;

    public constructor(url:string,width:number = RUIAuto,height:number = RUIAuto){
        super();
        if(url != null && url != ''){
            this.loadImage(url);
        }
        this.width = width;
        this.height = height;

    }

    public get src():string{
        return this.m_image.src;
    }

    public get isvalid():boolean{
        return this.m_valid;
    }

    public set isvalid(v:boolean){
        this.m_valid= v;
    }

    public static Create(ruiimg: RUIImage,width:number= RUIAuto,height:number = RUIAuto){
        var image = new RUIImage(null,width,height);
        image.m_image = ruiimg.m_image;

        RUIBind(ruiimg,'m_valid',v=>image.m_valid = v);
        return image;
    }

    private loadImage(url:string){
        this.m_valid= false;
        let image = new Image();
        image.onload = this.onImageLoaded.bind(this);
        image.src = url;
        this.m_image = image;
    }

    private onImageLoaded(image:HTMLImageElement,e:Event){
        this.m_valid = true;
        this.setDirty();
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);
        let cliprect = this._drawClipRect;
        if(cliprect == null){
            return;
        }

        if(this.m_valid){
            cmd.DrawImage(this.m_image,this._rect,cliprect);
        }
        else{
            cmd.DrawRectWithColor(cliprect,RUI.COLOR_ERROR);
        }
    }
}
