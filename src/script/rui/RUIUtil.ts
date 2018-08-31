import { RUIRect, RUIRectP } from "./RUIDefine";


if(Array.prototype['includes'] == null){
    Array.prototype['includes'] = function(o){
        if(o==null) return false; 
        let index= this.indexOf(o);
        if(index < 0) return false;
        return true;
    }
}

export function ROUND(x:number){
    return Math.round(x);
}

export function CLAMP(val:number,min:number,max:number){
    return Math.min(Math.max(min, val), max);
}

export function SATURATE(val:number){
    return Math.max(0,Math.min(1,val));
}

export function SIZE(val:number){
    return Math.max(0,val);
}

export type RUISizePair = {width:number,height:number};


export type RUIAlign = number;


export class RUIUtil{


    public static readonly ALIGN_CENTER: RUIAlign = 0;
    public static readonly ALIGN_LEFT:RUIAlign = 1;
    public static readonly ALIGN_RIGHT:RUIAlign = 2;

    public static readonly LINE_HEIGHT_DEFAULT:number = 23;


    public static RectClip(content:RUIRect,clip:RUIRect) : RUIRect | null{
        if(clip == null || content == null) return null;
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

    public static RectClipP(content:RUIRectP,clip:RUIRectP) : RUIRectP|null{
        if(content == null || clip == null) return null;
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

    public static toRectP(rect:RUIRect): RUIRectP{
        if(rect == null) return null;
        let x1 = rect[0];
        let y1 = rect[1];
        return [x1,y1,rect[2]+x1,rect[3]+y1];
    }

    public static Vector(v:number):number[]{
        return [v,v,v,v];
    }

    public static ColorUNorm(r:number,g:number,b:number,a:number = 255):number[]{
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

    public static IntersectNull(a:RUIRect,b:RUIRect):boolean{
        if(a[0] > b[0] + b[2]) return true;
        if(a[1] > b[1] +b[3]) return true;
        if(b[0] > a[0]+ a[2]) return true;
        if(b[1] > a[1]+ a[3]) return true;
        return false;
    }

    public static RectIndent(r:RUIRect,off:number){
        let off2 = off *2;
        return [r[0]+off,r[1]+ off,r[2] - off2,r[3]- off2];
    }

}
