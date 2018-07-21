import * as opentype from 'opentype.js';


export class RUIFontTexture{

    private static s_inited =false;
    private static ASIICTexture: RUIFontTexture;

    private m_font:opentype.Font;
    private m_ctx2d:CanvasRenderingContext2D;


    constructor(){
        
        this.CrateTexture();
        this.LoadFont();
    }

    public static Init(){
        if(RUIFontTexture.s_inited) return;

        RUIFontTexture.ASIICTexture = new RUIFontTexture();
        RUIFontTexture.s_inited = true;

        

    }

    private LoadFont(){
        opentype.load('arial.ttf',(e,f)=>{
            this.m_font = f;
            
            this.FillTexture();
        });

    }

    private FillTexture(){

        let f = this.m_font;
        let ctx2d = this.m_ctx2d;

        let fontsize = 16.0;
        let upx = fontsize / f.unitsPerEm;

        let linh = 0;
        let linw = 0;

        let maxh = 0;

        for(var i= 33;i<=126;i++){
            let c = String.fromCharCode(i);
            let g = f.charToGlyph(c);
            let m =g.getMetrics();

            let y = Math.ceil(upx *(m.yMax));
            let x= Math.ceil(upx*(m.xMax - m.xMin)) + 1;

            if(linw + x > 128){
                linw =0;
                linh += 16;
                maxh = 0;
            }

            let p = g.getPath(linw,linh+y,fontsize);
            p['fill'] = "white";
            p.draw(ctx2d);
            linw += x;
            maxh = Math.max(maxh,y);
        }
    }

    private CrateTexture(){

        let texw = 128;
        let texh = 128;
        
        let canvas2d = document.createElement("canvas");
        canvas2d.style.backgroundColor="#000";
        canvas2d.width = texw;
        canvas2d.height = texh;

        let h:number = 14;

        let lineh = h;
        let linew = 0;

        let ctx : CanvasRenderingContext2D = canvas2d.getContext('2d');
        // ctx.font = '14px arial';
        // for(var i= 33;i<=126;i++){
        //     let c = String.fromCharCode(i);
        //     let w = ctx.measureText('H').width;

        //     console.log(w);
            
        //     if(linew +w > texw){
        //         lineh += h;
        //         linew = 0;
        //     }
            
        //     ctx.fillText(c,linew,lineh);

        //     linew+=w;
        // }

        this.m_ctx2d = ctx;

        document.body.appendChild(canvas2d);
    }
}