import { RUIFlexContainer } from "../RUIFlexContainer";
import { RUIUtil } from "../RUIUtil";
import { RUISlider } from "./RUISlider";
import { RUITextInput, RUITextInputFormat } from "./RUITextInput";
import { RUIAuto, RUIOrientation } from "../RUIObject";
import { RUIEvent } from "../RUIEvent";




export class RUISliderInput extends RUIFlexContainer{

    private m_slider:RUISlider;
    private m_input :RUITextInput;

    private m_isinteger:boolean = false;
    private m_min:number;
    private m_max:number;

    public constructor(val:number,min:number = 0,max:number=1.0,isInteger:boolean = false){
        super();
        this.height = RUIUtil.LINE_HEIGHT_DEFAULT;
        this.boxOrientation = RUIOrientation.Horizontal;
        this.m_isinteger = isInteger;
        this.m_min = min;
        this.m_max = max;

        let slider = new RUISlider(val,RUIUtil.LINE_HEIGHT_DEFAULT);
        slider.EventOnValue.on(this.onValue.bind(this));
        slider.flex= 1;
        this.addChild(slider);
        this.m_slider = slider;

        let input = new RUITextInput(val.toString(),RUITextInputFormat.NUMBER);
        input.width = 60;
        input.EventOnTextChange.on(this.onInputChange.bind(this));
        this.addChild(input);
        this.m_input = input;
    }

    public get value():number{
        return Number(this.m_input.content);
    }

    private onInputChange(e:RUIEvent<string>){
        let text = e.object;
        let val = Number(text);
        if(val === NaN) return;

        let min = this.m_min;
        val = (val - min)/ (this.m_max - min);
        this.m_slider.setValue(val);
    }

    private onValue(e:RUIEvent<number>){
        let val = e.object;
        let min = this.m_min;
        let fval = val *(this.m_max - min) + min;
        let str = null;
        if(this.m_isinteger) {
            str = Math.round(fval).toFixed(0);
        }
        else{
            str = fval.toString()
        }
        if(str === 'NaN') return;
        this.m_input.content = str;
    }
}