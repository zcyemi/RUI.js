import { UIObject, UIAlign } from "../UIObject";
import { RUIDrawCall } from "../RUIDrawCall";
import { RUIStyle } from "../RUIStyle";
import { RUIMouseEvent } from "../RUIEventSys";
import { UIUtil } from "../UIUtil";


export class UICheckbox extends UIObject{

    private m_checked:boolean = false;

    private m_align: UIAlign = UIAlign.Center;

    private static readonly BoxSize:number = 16;

    private m_rectOuter:number[];
    private m_active:boolean =false;

    public constructor(checked?:boolean,align?:UIAlign){
        super();
        if(checked != null){
            this.m_checked = checked;
        }

        if(align != null){
            this.m_align = align;
        }
    }

    public onBuild(){
        this.height = 23;
        this.visible =true;
    }

    public onMouseClick(e:RUIMouseEvent){
        if(UIUtil.RectContains(this.m_rectOuter,e.mousex,e.mousey)){
            this.m_checked = !this.m_checked;
            this.setDirty(true);
        }
    }

    public onActive(){
        this.m_active = true;
    }

    public onInactive(){
        this.m_active = false;
        this.setDirty(true);
    }

    public onDraw(cmd:RUIDrawCall){

        let offsetx = 3;
        if(this.m_align == UIAlign.Center){
            offsetx = (this._width - UICheckbox.BoxSize)/2;
        }else if(this.m_align == UIAlign.Right){
            offsetx = this._width - 3 - UICheckbox.BoxSize;
        }

        let offsety = (this._height - UICheckbox.BoxSize) / 2;

        let rectOuter = [this._calculateX + offsetx,this._calculateY+ offsety,UICheckbox.BoxSize,UICheckbox.BoxSize];
        this.m_rectOuter = rectOuter;

        cmd.DrawBorder(rectOuter,RUIStyle.Default.inactive);

        if(this.m_checked){
            let rectInner = [rectOuter[0]+2,rectOuter[1]+2,rectOuter[2]-4,rectOuter[3]-4];
            cmd.DrawRectWithColor(rectInner,this.m_active? RUIStyle.Default.primary: RUIStyle.Default.primary0);
        }

    }
}