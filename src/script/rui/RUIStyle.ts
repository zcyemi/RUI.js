import { UIUtil } from "./UIUtil";

type RUIColor = number[];

export class RUIStyle{

    public static Default: RUIStyle = new RUIStyle();

    public background0:RUIColor =UIUtil.ColorUNorm(30,30,30,255);
    public background1: RUIColor = UIUtil.ColorUNorm(37,37,38);
    public background2:RUIColor = UIUtil.ColorUNorm(51,51,51);
    public primary:RUIColor = UIUtil.ColorUNorm(0,122,204);
    public primary0:RUIColor = UIUtil.ColorUNorm(9,71,113);

    public inactive:RUIColor = UIUtil.ColorUNorm(63,63,70);
    public border0:RUIColor = UIUtil.ColorUNorm(3,3,3);

}