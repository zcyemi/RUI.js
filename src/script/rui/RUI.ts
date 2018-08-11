import { RUIRect, RUIRectP } from "./RUIObject";


export type RUIColor = number[];

export class RUI{

    public static readonly RED:RUIColor = [1,0,0,1];
    public static readonly BLACK:RUIColor =[0,0,0,1];
    public static readonly WHITE:RUIColor = [1,1,1,1];
    public static readonly GREY:RUIColor = RUI.ColorUNorm(200,200,200,255);

    public static RectClip(content:RUIRect,clip:RUIRect) : RUIRect | null{
        let x2 = content[0]+ content[2];
        let y2 = content[1]+ content[3];

        if(x2 <= clip[0]) return null;
        if(y2 <= clip[1]) return null;

        let cx2 = clip[0] + clip[2];
        let cy2 = clip[1] + clip[3];

        if(cx2 <= content[0]) return null;
        if(cy2 <= content[1]) return null;

        let x = Math.max(content[0],clip[0]);
        let y = Math.max(content[1],clip[1]);

        return [x,y,Math.min(x2,cx2) -x,Math.min(y2,cy2)-y];
    }

    public static RectClipP(content:RUIRectP,clip:RUIRectP) : RUIRectP{
        if(content[2] <= clip[0]) return null;
        if(content[3] <= clip[1]) return null;
        if(clip[2] <= content[0]) return null;
        if(clip[3] <= content[1]) return null;

        return [
            Math.max(content[0],clip[0]),
            Math.max(content[1],clip[1]),
            Math.min(content[2],clip[2]),
            Math.min(content[3],clip[3]),
        ]
    }

    public static toRect(rect:RUIRectP):RUIRect{
        return [rect[0],rect[1],rect[2]- rect[0],rect[3]-rect[1]];
    }

    public static Vector(v:number):number[]{
        return [v,v,v,v];
    }

    public static ColorUNorm(r:number,g:number,b:number,a:number = 255):RUIColor{
        return [r/255.0,g/255.0,b/255.0,a/255.0];
    }

    public static RandomColor():number[]{
        return [Math.random(),Math.random(),Math.random(),1.0];
    }

    public static RectContains(rect:number[],x:number,y:number):boolean{

        if(x< rect[0] || y < rect[1]) return false;
        if(x > (rect[0]+ rect[2]) || y > (rect[1]+rect[3])) return false;
        return true;
    }

    

}