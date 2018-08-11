import { RUIRect, RUIRectP } from "./RUIObject";


export class RUI{

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

    public static RectClipP(content:RUIRectP,clip:RUIRectP){
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
}