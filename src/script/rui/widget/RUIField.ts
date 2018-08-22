import { RUIObject, RUIOrientation } from "../RUIObject";
import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUILabel } from "./RUILabel";
import { RUITextInput, RUITextInputFormat } from "./RUITextInput";



export class RUIField<T extends RUIObject> extends RUIFlexContainer{

    protected m_label : RUILabel;
    protected m_widget :T;

    public constructor(label:string,t:T){
        super();
        this.boxOrientation = RUIOrientation.Horizontal;
        this.margin = [1,0,1,0];
        let clabel = new RUILabel(label);
        clabel.width = 100;
        this.m_label = clabel;
        this.addChild(clabel);

        let cwidget = t;
        cwidget.flex = 1;
        this.m_widget = cwidget;
        this.addChild(cwidget);
    }
}

export class RUITextField extends RUIField<RUITextInput>{

    public constructor(label:string,content:string,format: RUITextInputFormat = RUITextInputFormat.DEFAULT){
        let textinput = new RUITextInput(content,format);
        super(label,textinput);
    }

    public get label():string{
        return this.m_label.label;
    }
    public set label(l:string){
        this.m_label.label = l;
    }

    public get content():string{
        return this.m_widget.content;
    }
    public set content(content:string){
        this.m_widget.content = content;
    }
}