import { Typr }from './../../../node_modules/typr-ts/dist/core/Typr';

export class RUIFontTexture{

    private static s_inited =false;

    private static ASIICTexture: RUIFontTexture;
    constructor(){
        this.CrateTexture();
    }

    public static Init(){
        if(RUIFontTexture.s_inited) return;

        RUIFontTexture.ASIICTexture = new RUIFontTexture();
        RUIFontTexture.s_inited = true;
    }

    private CrateTexture(){

        
        let canvas2d = document.createElement("canvas");
        canvas2d.width = 128;
        canvas2d.height = 128;


        let ctx : CanvasRenderingContext2D = canvas2d.getContext('2d');
        ctx.font = '14px arial';
        ctx.fillText('Hello world', 0, 100);

        let m = ctx.measureText('H');

        let p = fetch("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf");
        p.then(resp=>{
            console.log(resp);
        },rej=>{

        });
        document.body.appendChild(canvas2d);
    }
}