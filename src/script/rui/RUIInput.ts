import { UIObject } from "./UIObject";
import { RUICanvas } from "./RUICanvas";
import { RUIEvent, RUIMouseEvent, RUIEventEmitter } from "./RUIEventSys";


export class IInputUI{

    public onKeyPress(e:KeyboardEvent){

    }

    public onKeyDown(e:KeyboardEvent){

    }
}


export class RUIInput{

    private m_target : RUICanvas;

    private m_activeMouseUI: UIObject = null;

    public EvtMouseEnter: RUIEventEmitter;
    public EvtMouseLeave: RUIEventEmitter;


    public constructor(uicanvas:RUICanvas){

        this.m_target = uicanvas;
        this.EvtMouseEnter = new RUIEventEmitter();
        this.EvtMouseLeave = new RUIEventEmitter();

        this.RegisterEvent();
    }

    private RegisterEvent(){
        let c = this.m_target.canvas;
        let tar = this.m_target;

        window.addEventListener('keypress',this.onKeyboardEvent.bind(this));
        window.addEventListener('keydown',this.onKeyboardDown.bind(this));

        c.addEventListener('mousedown',(e)=>{
            let tar = this.m_target;
            let newActiveUI = tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_DOWN);
            let curActiveUI = this.m_activeMouseUI;

            if(curActiveUI == newActiveUI) return;

            if(curActiveUI != null) curActiveUI.onInactive();
            if(newActiveUI != null){
                newActiveUI.onActive();
                this.m_activeMouseUI = newActiveUI;
            }
        });
        c.addEventListener('mouseup',(e)=>{
            let tar = this.m_target;
            let tarui = tar.qtree.DispatchEvtMouseEvent(e.offsetX,e.offsetY,RUIEvent.MOUSE_UP);
            
            if(tarui && tarui == this.m_activeMouseUI){
                tarui.onMouseClick(new RUIMouseEvent(tarui,RUIEvent.MOUSE_CLICK,e.offsetX,e.offsetY,tar));
            }
        });
        c.addEventListener('mousemove',(e)=>{
            this.m_target.qtree.DispatchEvtMouseMove(e.offsetX,e.offsetY);
        })

        c.addEventListener('mouseenter',(e)=>{
            this.EvtMouseEnter.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_ENTER,tar));
        });

        c.addEventListener('mouseleave',(e)=>{
            this.EvtMouseLeave.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_LEAVE,tar));
        });
    }

    private onKeyboardEvent(e:KeyboardEvent){
        let activeUI = this.m_target.activeUI;
        if(activeUI != null) activeUI.onKeyPress(e);
    }
    private onKeyboardDown(e:KeyboardEvent){
        let activeUI = this.m_target.activeUI;
        if(activeUI != null) activeUI.onKeyDown(e);
    }

    public static ProcessTextKeyPress(text:string,e:KeyboardEvent):string{
        return text +e.key;
    }

    public static ProcessTextKeyDown(text:string,e:KeyboardEvent): string{
        if(text == null || text.length == 0) return text;
        if(e.key == 'Backspace'){
            if(e.shiftKey){
                return '';
            }
            text = text.slice(0,text.length-1);
        }
        return text;
    }
}