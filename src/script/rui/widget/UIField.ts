import { UIObject, UIDisplayMode, UIOrientation } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIFontTexture } from "../RUIFontTexture";
import { UIInput } from "./UIInput";
import { UILable } from "./UILabel";
import { UISlider } from "./UISlider";
import { UICheckbox } from "./UICheckbox";


export abstract class UIField extends UIObject{

    public m_label:string;

    public constructor(label:string){
        super();
        this.m_label = label;
    }

    public onBuild(){
        this.visible = true;
    }

    public get label(): string {
        return this.m_label;
    }
    public set label(val: string) {
        this.m_label = val;
        this.setDirty(true);
    }

    public onDraw(cmd:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];

        let totalWidth = this._width;
        let labelsize = 0;
        let label = this.m_label;
        if(label != null && label != ''){
            labelsize = RUIFontTexture.ASIICTexture.MeasureTextWith(label);
            labelsize = Math.min(labelsize + 10,Math.max(150,totalWidth *0.5));
            let labelRect = [rect[0],rect[1],labelsize,rect[3]];
            cmd.DrawText(label,labelRect);
        }
    }
}

export class UIInputField extends UIObject{

    private m_input:UIInput;
    private m_label:UILable;
    public constructor(label:string,value:string = ''){
        super();
        this.m_input = new UIInput(value);
        this.m_label = new UILable(label);

        
    }

    public onBuild(){
        this.displayMode = UIDisplayMode.Flex;
        this.orientation = UIOrientation.Horizontal;
        this.height = 23;

        this.m_label.width = 100;
        this.m_input.flex = 1;

        this.addChild(this.m_label);
        this.addChild(this.m_input);
    }
}

export class UICheckboxField extends UIObject{
    private m_label:UILable;
    private m_checkbox:UICheckbox;

    public constructor(label:string,checked:boolean){
        super();
        this.m_label = new UILable(label);
        this.m_checkbox = new UICheckbox(checked);
    }

    public onBuild(){
        this.height = 23;
        this.displayMode = UIDisplayMode.Flex;
        this.orientation = UIOrientation.Horizontal;

        this.m_label.width = 100;
        this.m_checkbox.flex = 1;

        this.addChild(this.m_label);
        this.addChild(this.m_checkbox);
    }
}

export class UISliderFiled extends  UIObject{

    private m_label:UILable;
    private m_slider:UISlider;

    private m_max:number;
    private m_min:number;
    public constructor(label:string,value:number,min:number = 0.0,max:number = 1.0){
        super();

        this.m_label= new UILable(label);

        this.m_max = max;
        this.m_min = min;

        let sval = (value - min) / (max - min);
        this.m_slider = new UISlider(sval);

    }

    public onBuild(){
        this.displayMode = UIDisplayMode.Flex;
        this.orientation = UIOrientation.Horizontal;
        this.height = 23;

        this.m_label.width =100;
        this.m_slider.flex = 1;

        this.addChild(this.m_label);
        this.addChild(this.m_slider);
    }
}