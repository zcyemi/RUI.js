import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIColor } from "../RUIColor";
import { RUIPosition } from "../RUIDefine";


export class RUIOverlay extends RUIContainer{

    public constructor(){
        super();
        this.position = RUIPosition.Relative;
        this.boxBackground = RUIColor.RED;
        this.width = 100;
        this.height = 100;
        this.boxClip = RUIContainerClipType.ClipSelf;

    }
}