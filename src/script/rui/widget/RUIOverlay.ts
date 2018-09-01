import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIColor } from "../RUIColor";
import { RUIPosition } from "../RUIDefine";


export class RUIOverlay extends RUIContainer{

    public constructor(){
        super();
        this.position = RUIPosition.Relative;
        this.boxClip = RUIContainerClipType.ClipSelf;

    }
}