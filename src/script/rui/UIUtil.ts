import { RUIRect } from "./RUIObject";


export class UIUtil{


    public static RandomColor():number[]{
        return [Math.random(),Math.random(),Math.random(),1.0];
    }

    public static ColorUNorm(r:number,g:number,b:number,a:number = 255){
        return [r/255.0,g/255.0,b/255.0,a/255.0];
    }

    public static RectContains(rect:number[],x:number,y:number):boolean{

        if(x< rect[0] || y < rect[1]) return false;
        if(x > (rect[0]+ rect[2]) || y > (rect[1]+rect[3])) return false;
        return true;
    }


    public static RectClip(content:RUIRect,clip:RUIRect):RUIRect| null{

        let x2 = content[0]+ content[2];
        let y2 = confirm[1]+ content[3];

        if(x2 < clip[0]) return null;
        if(y2 < clip[1]) return null;

        let cx2 = clip[0] + clip[2];
        let cy2 = clip[1]+ clip[3];

        if(cx2 < content[0]) return null;
        if(cy2 < confirm[1]) return null;

        //TODO 

        throw new Error("not implemented!");

        return null;
    }

    public static RectMinus(recta:RUIRect,offset:RUIRect):RUIRect{
        return [
            recta[0] - offset[0],
            recta[1] - offset[1],
            recta[2] - offset[2],
            recta[3] - offset[3]
        ];
    }
}

