import * as opentype from 'opentype.js';
import { GLContext } from 'wglut';
import { RUIEventEmitter } from './RUIEvent';


export class RUIGlyph{

    public width:number;
    public height:number;
    public advancex: number;

    public offsetY: number;

    public uv:number[];
}

export class RUIFontTexture{

    private static s_inited =false;
    private static s_gl:GLContext;

    public static ASIICTexture: RUIFontTexture;

    private m_font:opentype.Font;
    private m_ctx2d:CanvasRenderingContext2D;

    private m_textureWidth:number;
    private m_textureHeight:number;

    public m_glTexture:WebGLTexture;
    private m_textureValid:boolean = false;

    public glyphs:{[key:number]:RUIGlyph} = {};

    public glyphsWidth:number[] = [];

    public m_isDirty:boolean = false;
    public fontSize:number = 16;

    public static EventOnTextureLoaded: RUIEventEmitter<RUIFontTexture> = new RUIEventEmitter();


    constructor(){
        
        this.CrateTexture();
        this.LoadFont();
    }

    public get isTextureValid():boolean{
        return this.m_textureValid;
    }

    public get isDirty():boolean{
        return this.m_isDirty;
    }
    public set isDirty(d:boolean){
        this.m_isDirty = d;
    }

    public static Init(gl:GLContext){
        if(RUIFontTexture.s_inited) return;

        RUIFontTexture.s_gl = gl;
        RUIFontTexture.ASIICTexture = new RUIFontTexture();
        RUIFontTexture.s_inited = true;

    }

    private LoadFont(){
        opentype.load('consola.ttf',(e,f)=>{
            this.m_font = f;
            
            this.FillTexture();
        });

    }

    public MeasureTextWith(content:string):number{
        let w = 0;
        let gw = this.glyphsWidth;
        for(var i=0,len=content.length;i<len;i++){
           w+= gw[content.charCodeAt(i)]; 
        }
        return w;
    }

    private FillTexture(){

        let f = this.m_font;
        let ctx2d = this.m_ctx2d;

        let fontsize = this.fontSize;
        let upx = fontsize / f.unitsPerEm;

        let linh = 0;
        let linw = 0;

        let maxh = 0;

        let uvunit = 1.0/ this.m_textureWidth;


        let glyphWidth = this.glyphsWidth;
        for(i=0;i<33;i++){
            glyphWidth.push(5);
        }

        for(var i= 33;i<=126;i++){
            let c = String.fromCharCode(i);
            let g = f.charToGlyph(c);
            let m =g.getMetrics();

            let y = Math.ceil(upx *(m.yMax - m.yMin));
            let ybase = Math.ceil(upx *(m.yMax));
            let x= Math.ceil(upx*(m.xMax - m.xMin));

            if(linw + x > 126){
                linw =0;
                linh += fontsize;
                maxh = 0;
            }

            let glyph = new RUIGlyph();
            glyph.width = x;
            glyph.height = y;
            glyph.advancex = g.advanceWidth *upx;
            glyph.offsetY = ybase;
            glyphWidth.push(x);

            let uvx1 = linw * uvunit;
            let uvx2 = (linw + x)* uvunit;
            let uvy1 = linh* uvunit;
            let uvy2 = (linh + y)* uvunit;

            glyph.uv = [uvx1,uvy1,uvx2,uvy1,uvx2,uvy2,uvx1,uvy2];
            
            this.glyphs[i] = glyph;

            let p = g.getPath(linw,linh+ybase,fontsize);
            p['fill'] = "white";
            p.draw(ctx2d);
            linw += x+2;
            maxh = Math.max(maxh,y);
        }

        let url = ctx2d.canvas.toDataURL('image/png');
        let glctx = RUIFontTexture.s_gl;
        let gl = glctx.gl;

        let gltex = this.createTextureImage(glctx,gl.RGBA,gl.RGBA,url,true,true,()=>{
            this.m_textureValid = true;
            this.m_isDirty = true;
            RUIFontTexture.EventOnTextureLoaded.emitRaw(this);
        });

        this.m_glTexture = gltex;
    }

    private createTextureImage(glctx:GLContext,internalFmt:number,format:number,src:string,linear:boolean = true,mipmap:boolean = true,callback:()=>void):WebGLTexture
    {
        let gl = glctx.gl;
        
        var img = new Image();
        var tex = gl.createTexture();
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFmt, format, gl.UNSIGNED_BYTE, img);
            if(mipmap) gl.generateMipmap(gl.TEXTURE_2D);

            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,linear? gl.LINEAR: gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, linear?( mipmap? gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR): gl.NEAREST);

            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D,null);

            if(callback!= null) callback();
        };
        img.src = src;
        return tex;
    }
    private CrateTexture(){

        let texw = 128;
        let texh = 128;
        
        let canvas2d = document.createElement("canvas");
        canvas2d.style.backgroundColor="#00000000";
        canvas2d.width = texw;
        canvas2d.height = texh;

        let h:number = this.fontSize;

        let lineh = h;
        let linew = 0;

        let ctx : CanvasRenderingContext2D = canvas2d.getContext('2d');
        this.m_ctx2d = ctx;

        //document.body.appendChild(canvas2d);

        this.m_textureWidth = texw;
        this.m_textureHeight = texh;

        
    }
}