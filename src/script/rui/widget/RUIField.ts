import { RUIObject, RUIOrientation } from "../RUIObject";
import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUILabel } from "./RUILabel";
import { RUITextInput, RUITextInputFormat } from "./RUITextInput";
import { RUICheckBox } from "./RUICheckBox";
import { RUIAlign, RUI } from "../RUI";
import { RUIEventEmitter } from "../RUIEvent";
import { RUISliderInput } from "./RUISliderInput";


const FIELD_LABEL_WIDTH = 100;

export class RUIField<T extends RUIObject> extends RUIFlexContainer {

    protected m_label: RUILabel;
    protected m_widget: T;

    public constructor(label: string, t: T) {
        super();
        this.boxOrientation = RUIOrientation.Horizontal;
        this.margin = [1, 0, 1, 0];
        let clabel = new RUILabel(label);
        clabel.width = FIELD_LABEL_WIDTH;
        this.m_label = clabel;
        this.addChild(clabel);

        let cwidget = t;
        cwidget.flex = 1;
        this.m_widget = cwidget;
        this.addChild(cwidget);
    }
}

export class RUITextField extends RUIField<RUITextInput>{

    public constructor(label: string, content: string, format: RUITextInputFormat = RUITextInputFormat.DEFAULT) {
        let textinput = new RUITextInput(content, format);
        super(label, textinput);
    }

    public get label(): string {
        return this.m_label.label;
    }
    public set label(l: string) {
        this.m_label.label = l;
    }

    public get content(): string {
        return this.m_widget.content;
    }
    public set content(content: string) {
        this.m_widget.content = content;
    }
}

export class RUICheckBoxField extends RUIField<RUICheckBox>{
    public constructor(label: string, checked: boolean, align: RUIAlign = RUI.ALIGN_LEFT) {
        let checkbox = new RUICheckBox(checked, align);
        super(label, checkbox);
    }

    public get isChecked(): boolean { return this.m_widget.isChecked; }
    public set isChecked(c: boolean) { this.m_widget.isChecked = c; }
    public get EventOnClick(): RUIEventEmitter<boolean> {
        return this.m_widget.EventOnClick;
    }
}


export class RUIIntegerField extends RUIField<RUISliderInput>{
    public constructor(label:string,value:number,min:number=0,max:number=100){
        let sliderinput = new RUISliderInput(value,min,max,true);
        super(label,sliderinput);
    }
}

export class RUIFloatField extends RUIField<RUISliderInput>{
    public constructor(label:string,value:number,min:number=0,max:number=1.0){
        let sliderinput = new RUISliderInput(value,min,max,false);
        super(label,sliderinput);
    }
}