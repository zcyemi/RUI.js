export class UIUtil{


    public static RandomColor():number[]{
        return [Math.random(),Math.random(),Math.random(),1.0];
    }

    public static ColorUNorm(r:number,g:number,b:number,a:number = 255){
        return [r/255.0,g/255.0,b/255.0,a/255.0];
    }
}

