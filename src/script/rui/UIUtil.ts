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
}

