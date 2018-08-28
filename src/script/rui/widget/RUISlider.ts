import { RUIObject, RUIOrientation } from "../RUIObject";
import { RUICmdList } from "../RUICmdList";
import { RUIStyle } from "../RUIStyle";
import { SATURATE } from "../RUIUtil";
import { RUIMouseEvent, RUIMouseDragEvent, RUIMouseDragStage, RUIEventEmitter } from "../RUIEvent";


export class RUISlider extends RUIObject{

    public static readonly SLIDER_HEIGHT: number = 10;

    private m_value :number = 0;

    public EventOnValue: RUIEventEmitter<number> = new RUIEventEmitter();

    public constructor(val:number,height:number = RUISlider.SLIDER_HEIGHT){
        super();
        this.value =val;
        this.height = height;
    }

    public get value():number{
        return this.m_value;
    }

    public set value(val:number){
        if(val === NaN) return;
        val = SATURATE(val);
        if(this.m_value == val) return;
        this.m_value = val;
        this.setDirty();
        this.EventOnValue.emitRaw(val);
    }

    public setValue(val:number){
        if(val === NaN) return;
        val = SATURATE(val);
        if(this.m_value == val) return;
        this.m_value = val;
        this.setDirty();
    }

    public onMouseDown(e:RUIMouseEvent){
        e.Use();
        let val =  (e.mousex - this.rCalx) / this.rCalWidth;
        if(val === NaN) return;
        this.value = val;    
    }

    public onMouseDrag(e:RUIMouseDragEvent){
        e.Use();
        let stage = e.stage;
        if(stage == RUIMouseDragStage.Update){
            let val = (e.mousex - this.rCalx) / this.rCalWidth;
            if(val === NaN) return;
            this.value = val;
        }

    }

    public onDraw(cmd:RUICmdList){
        super.onDraw(cmd);
        
        let cliprect= this._drawClipRect;
        if(cliprect == null) return;

        let rect = this._rect;
        

        let val = this.m_value;
        if(val != 0){
            let vrect = rect.slice(0);
            vrect[2] *= val;
            cmd.DrawRectWithColor(vrect,RUIStyle.Default.primary0,cliprect);
        }
        cmd.DrawRectWithColor(rect,RUIStyle.Default.background0,cliprect);

    }
}
