import { RUI } from "./RUI";

type RUIColor = number[];

export class RUIStyle{

    public static Default: RUIStyle = new RUIStyle();

    public background0:RUIColor =RUI.ColorUNorm(15,15,15,255);
    public background1:RUIColor =RUI.ColorUNorm(30,30,30,255);
    public background2: RUIColor = RUI.ColorUNorm(37,37,38);
    public background3:RUIColor = RUI.ColorUNorm(51,51,51);
    public primary:RUIColor = RUI.ColorUNorm(0,122,204);
    public primary0:RUIColor = RUI.ColorUNorm(9,71,113);

    public inactive:RUIColor = RUI.ColorUNorm(63,63,70);
    public border0:RUIColor = RUI.ColorUNorm(3,3,3);

}