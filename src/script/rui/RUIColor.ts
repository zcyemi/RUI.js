import { RUIUtil} from './RUIUtil';



export class RUIColor{
    public static readonly RED:number[] = [1,0,0,1];
    public static readonly BLACK:number[] =[0,0,0,1];
    public static readonly WHITE:number[] = [1,1,1,1];
    public static readonly GREEN:number[] = [0,1,0,1];
    public static readonly BLUE:number[] = [0,0,1,1];
    public static readonly YELLOW:number[] = [1,1,0,1];
    public static readonly GREY:number[] = RUIUtil.ColorUNorm(200,200,200,255);
    public static readonly COLOR_ERROR:number[] = [1,0,1,1];
}
