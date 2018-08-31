import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIButton } from "./RUIButton";
import { RUILayoutData } from "../RUIObject";
import { RUIStyle } from "../RUIStyle";
import { RUIAuto, RUIOrientation } from "../RUIDefine";

export class RUIButtonGroup extends RUIContainer {

    private m_buttons: RUIButton[];

    public constructor(buttons: RUIButton[], orientation: RUIOrientation) {
        super();

        this.m_buttons = buttons;
        this.boxBorder = RUIStyle.Default.border0;
        this.boxBackground = RUIStyle.Default.background0;
        this.boxOrientation = orientation;

        buttons.forEach(b => {
            this.addChild(b);
        });
    }

    public getButtonIndex(btn: RUIButton) {
        return this.m_buttons.indexOf(btn);
    }

    public LayoutPost(data: RUILayoutData) {

        if (!this.isVertical) {
            let clen = this.m_buttons.length;
            if (clen == 0) return;
            if (this.layoutWidth == RUIAuto) {
                this.layoutWidth = data.containerWidth;
            } let csize = this.layoutWidth / clen;
            this.m_buttons.forEach(b => {
                b.layoutWidth = csize;
            })
        }
        super.LayoutPost(data);
    }
}