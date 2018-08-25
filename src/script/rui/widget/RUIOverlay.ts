import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIPosition } from "../RUIObject";
import { RUILabel } from "./RUILabel";
import { RUI } from "../RUI";


export class RUIOverlay extends RUIContainer{

    public constructor(){
        super();
        this.position = RUIPosition.Relative;
        this.boxBackground = RUI.RED;
        this.width = 100;
        this.height = 100;
        this.boxClip = RUIContainerClipType.ClipSelf;

    }
}