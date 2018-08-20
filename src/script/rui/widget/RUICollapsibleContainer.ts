import { RUIContainer } from "../RUIContainer";
import { RUIButton } from "./RUIButton";
import { RUIPosition, RUIObject } from "../RUIObject";
import { RUI } from "../RUI";
import { RUIRectangle } from "../RUIRectangle";
import { RUIStyle } from "../RUIStyle";

export class RUICollapsibleContainer extends RUIContainer {
    private m_show: boolean;
    private m_button: RUIButton;
    private m_container: RUIContainer;

    public constructor(label: string, show: boolean) {
        super();
        this.m_show = show;
        this.boxBorder = RUIStyle.Default.border0;
        this.boxBackground = RUIStyle.Default.background0;

        let button = new RUIButton(label, this.onButtonClick.bind(this));
        super.addChild(button);

        let container = new RUIContainer();
        container.boxSideExtens = true;
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