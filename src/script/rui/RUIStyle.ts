import { RUIUtil } from "./RUIUtil";


export class RUIStyle{

    public static Default: RUIStyle = new RUIStyle();

    public background0:number[] =RUIUtil.ColorUNorm(15,15,15,255);
    public background1:number[] =RUIUtil.ColorUNorm(30,30,30,255);
    public background2: number[] = RUIUtil.ColorUNorm(37,37,38);
    public background3:number[] = RUIUtil.ColorUNorm(51,51,51);
    public primary:number[] = RUIUtil.ColorUNorm(0,122,204);
    public primary0:number[] = RUIUtil.ColorUNorm(9,71,113);

    public inactive:number[] = RUIUtil.ColorUNorm(63,63,70);
    public border0:number[] = RUIUtil.ColorUNorm(3,3,3);

}