import { RUIRect, RUIRectP, RUIObject, RUIAuto } from "./RUIObject";


if(Array.prototype['includes'] == null){
    Array.prototype['includes'] = function(o){
        if(o==null) return false; 
        let index= this.indexOf(o);
        if(index < 0) return false;
        return true;
    }
}

export function RUICHECK(ui:RUIObject,name:string){
    if(ui._debugname === name) console.error(ui);
}

export type RUIColor = number[];
export type RUIVal = number;


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

// export class RUIVal{
//     private m_val?:number;

//     public constructor(v:number){
//         this.m_val= v;
//     }

//     public get value():number{
//         return this.m_val;
//     }
//     public set value(v:number){
//         this.m_val= v;
//     }

//     private static s_auto: RUIVal = new RUIVal(null);
//     public static get Auto():RUIVal{
//         return this.s_auto;
//     }

//     public Equals(size:RUIVal):boolean{
//         if(size === this) return true;
//         if(size.m_val == this.m_val) return true;
//         return false;
//     }

//     public get Clone():RUIVal{
//         if(this === RUIAuto) return RUIAuto;
//         return new RUIVal(this.m_val);
//     }
// }


export type RUISizePair = {width:RUIVal,height:RUIVal};

export interface RUILayouter{

    /**
     * calculate ui.LayoutWidth ui.LayoutHeight
     * @param ui Target UI object.
     */
    Layout(ui:RUIObject);
    LayoutPost(ui:RUIObject,data:RUILayoutData);
}

export class RUILayoutData{

    /** should not be RUIAuto */
    public containerWidth:RUIVal;
    /** should not be RUIAuto */
    public containerHeight:RUIVal;
    public flexWidth?:number;
    public flexHeight?:number;

    public verify(){
        if(Number.isNaN(this.containerWidth)) throw new Error('container width is NaN');
        if(Number.isNaN(this.containerHeight)) throw new Error('container height is NaN');
        if(this.containerWidth == RUIAuto || this.containerHeight == RUIAuto) throw new Error('coantiner size can not be RUIAuto'); 
    }
}

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

    public static IntersectNull(a:RUIRect,b:RUIRect):boolean{
        if(a[0] > b[0] + b[2]) return true;
        if(a[1] > b[1] +b[3]) return true;
        if(b[0] > a[0]+ a[2]) return true;
        if(b[1] > a[1]+ a[3]) return true;
        return false;
    }

    

}