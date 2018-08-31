import { RUIObject } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIBind } from "../RUIBinder";
import { RUIColor } from "../RUIColor";
import { RUIAuto } from "../RUIDefine";

export enum RUIImageSize{
    Initial,
    Cover,
    Contain,
    ScaleToFit
}

export class RUIImage extends RUIObject{

    private m_image:HTMLImageElement;
    private m_valid:boolean = false;
    private m_size:RUIImageSize;

    public imageBackground?:number[];

    public constructor(url:string,width:number = RUIAuto,height:number = RUIAuto,size:RUIImageSize = RUIImageSize.Initial){
        super();
        if(url != null && url != ''){
            this.loadImage(url);
        }
        this.width = width;
        this.height = height;
        this.m_size = size;

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

    public get imageSize():RUIImageSize{
        return this.m_size;
    }

    public set imageSize(size:RUIImageSize){
        if(this.m_size == size) return;
        this.m_size = size;
        this.updateImageSize();
    }

    public static Create(ruiimg: RUIImage,width:number= RUIAuto,height:number = RUIAuto,size:RUIImageSize = RUIImageSize.Initial){
        var image = new RUIImage(null,width,height,size);
        image.m_image = ruiimg.m_image;

        RUIBind(ruiimg,'m_valid',v=>{
            image.m_valid = v;
            image.updateImageSize();
        });
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
        this.updateImageSize();
    }

    private updateImageSize(){

        let image = this.m_image;
        let size =this.m_size
        switch(size){
            case RUIImageSize.Initial:
            {
                this.width = image.width;
                this.height = image.height;
            }
            break;
            default:
            {
                let w = this.width;
                let h = this.height;
                let aspectRatio = image.width *1.0 / image.height;
                if(w == RUIAuto){
                    if(h != RUIAuto){
                        this.width = aspectRatio * this.height;
                    }
                }
                else{
                    if(h == RUIAuto){
                        this.height = this.width / aspectRatio;
                    }
                }
            }
            break;
        }
        this.setDirty();
    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);
        let cliprect = this._drawClipRect;
        if(cliprect == null){
            return;
        }

        let rect = this._rect;
        if(this.m_valid){

            cmd.DrawImage(this.m_image,rect,cliprect,null,this.m_size);
            
            if(this.imageBackground != null){
                cmd.DrawRectWithColor(rect,this.imageBackground,cliprect);
            }
        }
        else{
            cmd.DrawRectWithColor(cliprect,RUIColor.COLOR_ERROR);
        }
    }
}
