import { UIObject, UIOrientation, UIDisplayMode, UIDiv, UIAlign, UIPosition } from "./UIObject";
import { RUIDrawCall } from "./RUIDrawCall";
import {UIButton} from './widget/UIButton';
import {UIRect} from './widget/UIRect';
import { UIUtil } from "./UIUtil";
import { RUIStyle } from "./RUIStyle";
import { UIInput } from "./widget/UIInput";
import { UISlider } from "./widget/UISlider";
import { UIField, UIInputField, UISliderFiled, UICheckboxField } from "./widget/UIField";
import { UILable } from "./widget/UILabel";
import { UICheckbox } from "./widget/UICheckbox";
import { RUIColor } from "./RUIColor";


export class HeaderUI extends UIObject{

    public btnNew:UIButton =new UIButton("New");
    public btnOpen:UIButton = new UIButton("Open");
    public onBuild(){

        this.visible = false;
        this.displayMode = UIDisplayMode.Flex;
        this.orientation = UIOrientation.Horizontal;

        this.addChild(this.btnNew);
        this.addChild(this.btnOpen);
    }

    public onDraw(cmd:RUIDrawCall){
        
    }
}

export class EditorUI extends UIObject{


    public onBuild(){

        this.visible = true;
        this.color = RUIStyle.Default.background1;

        this.addChild(new UIButton('Clear'));
        this.addChild(new UIInputField("Hello"));
        this.addChild(new UISliderFiled("Count",20,10,100));
        this.addChild(new UICheckboxField("Enable",true));
        this.addChild(new FloatingUI());
    }

    public onDraw(cmd:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        cmd.DrawRectWithColor(rect,this.color);
    }

}


export class FloatingUI extends UIObject{

    public onBuild(){
        this.visible = true;

        this.position = UIPosition.Relative;
        this.floatRight = 20;
        this.floatTop = 50;
        this.height= 50;
        this.width = 50;
        this.zorder = 1;
    }

    public onDraw(cmd:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];

        cmd.DrawRectWithColor(rect,RUIColor.Grey);
    }
}

export class DebugUI extends UIObject{

    private m_header:HeaderUI;
    private m_editor: EditorUI;
    private m_renderer:UIObject;

    public onBuild(){


        this.visible = true;

        this.displayMode = UIDisplayMode.Flex;

        let header =new HeaderUI();
        header.height = 23;
        this.m_header = header;
        this.addChild(header);

        
        let main = new UIDiv();
        main.flex = 1;
        main.displayMode = UIDisplayMode.Flex;
        main.orientation=  UIOrientation.Horizontal;
        this.addChild(main);


        let editorui = new EditorUI();
        editorui.flex = 2;
        main.addChild(editorui);

        this.m_editor = editorui;

        let x = new UIObject();
        x.flex = 3;
        main.addChild(x);

        // let btn1 = new UIButton();

        // btn1.EvtMouseClick.on((e)=>{
        //     console.log('btn1 click');
        // });
        // this.addChild(btn1);

        // let c = new UIObject();
        // c.orientation = UIOrientation.Horizontal;
        // c.addChild(new UIRect());
        // c.addChild(new UIRect());

        // this.addChild(c);

        // this.addChild(new UIRect());
    }

    public onDraw(drawcall:RUIDrawCall){
        let rect = [this._calculateX,this._calculateY,this._width,this._height];
        drawcall.DrawRectWithColor(rect,this.color);
    }
}