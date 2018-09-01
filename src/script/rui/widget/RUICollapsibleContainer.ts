import { RUIContainer } from "../RUIContainer";
import { RUIButton } from "./RUIButton";
import { RUIObject } from "../RUIObject";
import { RUIStyle } from "../RUIStyle";
import { RUIOrientation } from "../RUIDefine";
import { RUIUtil } from "../RUIUtil";

export class RUICollapsibleContainer extends RUIContainer {
    private m_show: boolean;
    private m_button: RUIButton;
    private m_container: RUIContainer;

    public constructor(label: string, show: boolean,orientation:RUIOrientation = RUIOrientation.Vertical) {
        super();
        this.m_show = show;
        this.boxBorder = RUIStyle.Default.border0;
        this.boxBackground = RUIStyle.Default.background1;
        this.boxOrientation = orientation;

        let button = new RUIButton(label, this.onButtonClick.bind(this));
        button.margin = [1,0,1,0];
        super.addChild(button);

        let container = new RUIContainer();
        container.boxSideExtens = true;
        container.padding = RUIUtil.Vector(2);
        this.m_container = container;
        if (this.m_show) super.addChild(container);
    }

    private onButtonClick(b: RUIButton) {
        if (this.m_show) {
            super.removeChild(this.m_container);
            this.m_show = false;
        }
        else {
            super.addChild(this.m_container);
            this.m_show = true;
        }
    }

    public addChild(ui: RUIObject) {
        this.m_container.addChild(ui);
    }

    public removeChild(ui: RUIObject) {
        this.m_container.removeChild(ui);
    }
}