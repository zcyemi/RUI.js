import { RUIDOMCanvas } from "./RUIDOMCanvas";
import { RUIObjEvent, RUIKeyboardEvent, RUIMouseEvent, RUIWheelEvent, RUIEventType } from "./RUIEvent";

export class IInputUI{

    public onKeyPress(e:KeyboardEvent){

    }
    public onKeyDown(e:KeyboardEvent){

    }
}

export class RUIInput{

    private m_target : RUIDOMCanvas;

    // private m_activeMouseUI: UIObject = null;
    // private m_activeMouseUIDrag:boolean = false;
    // private m_onMouseDown:boolean = false;

    // public EvtMouseEnter: RUIEventEmitter;
    // public EvtMouseLeave: RUIEventEmitter;

    public static readonly MOUSE_DOWN:string = "onMouseDown";
    public static readonly MOUSE_UP:string = "onMouseUp";
    public static readonly MOUSE_CLICK:string = "onMouseClick";
    public static readonly MOUSE_ENTER:string = "onMouseEnter";
    public static readonly MOUSE_LEAVE:string = "onMouseLeave";
    public static readonly MOUSE_DRAG:string = "onMouseDrag";
    public static readonly MOUSE_DROP:string = "onMouseDrop";


    public constructor(uicanvas:RUIDOMCanvas){

        this.m_target = uicanvas;
        // this.EvtMouseEnter = new RUIEventEmitter();
        // this.EvtMouseLeave = new RUIEventEmitter();

        this.RegisterEvent();
    }

    // public setActiveUI(ui:UIObject){
    //     let curActiveUI = this.m_activeMouseUI;
    //     if(ui == curActiveUI) return;
    //     if(curActiveUI != null){
    //         curActiveUI.onInactive();
    //     }

    //     ui.onActive();
    //     this.m_activeMouseUI = ui;
    // }

    private RegisterEvent(){
        let c = this.m_target;
        let tar = this.m_target;

        window.addEventListener('keydown',(e)=>c.EventOnUIEvent.emit(new RUIKeyboardEvent(e)));
        window.addEventListener('mousedown',(e)=>c.EventOnUIEvent.emit(new RUIMouseEvent(e,RUIEventType.MouseDown)));
        window.addEventListener('mouseup',(e)=>c.EventOnUIEvent.emit(new RUIMouseEvent(e,RUIEventType.MouseUp)));
        window.addEventListener('mousemove',(e)=>c.EventOnUIEvent.emit(new RUIMouseEvent(e,RUIEventType.MouseMove)));
        window.addEventListener('mousewheel',(e)=>c.EventOnUIEvent.emit(new RUIWheelEvent(e)));
        // window.addEventListener('keypress',this.onKeyboardEvent.bind(this));
        // window.addEventListener('keydown',this.onKeyboardDown.bind(this));

        // c.addEventListener('mousedown',(e)=>{
        //     this.m_onMouseDown = true;
        //     let tar = this.m_target;
        //     let newActiveUI = tar.qtree.DispatchEvtMouseEvent(e,RUIEvent.MOUSE_DOWN);
        //     let curActiveUI = this.m_activeMouseUI;

        //     if(curActiveUI == newActiveUI) return;
        //     if(curActiveUI != null) curActiveUI.onInactive();

        //     if(newActiveUI != null){
        //         newActiveUI.onActive();
        //         this.m_activeMouseUI = newActiveUI;
        //     }

        //     this.m_activeMouseUIDrag =false;
            
        // });
        // c.addEventListener('mouseup',(e)=>{
        //     let tar = this.m_target;
        //     let tarui = tar.qtree.DispatchEvtMouseEvent(e,RUIEvent.MOUSE_UP);

        //     let activeUI = this.m_activeMouseUI;
            
        //     if(tarui && tarui == this.m_activeMouseUI){
        //         let eventClick = new RUIMouseEvent(tarui,RUIEvent.MOUSE_CLICK,e.offsetX,e.offsetY,tarui._canvas);
        //         eventClick.button = <RUIButton>e.button;
        //         tarui.onMouseClick(eventClick);
        //     }

        //     if(activeUI != null && this.m_activeMouseUIDrag){
        //         activeUI.onMouseDrag(new RUIMouseDragEvent(activeUI,RUIEvent.MOUSE_DRAG,e.offsetX,e.offsetY,true,tar));
        //     }

        //     this.m_onMouseDown = false;
        // });
        // c.addEventListener('mousemove',(e)=>{
        //     this.m_target.qtree.DispatchEvtMouseMove(e.offsetX,e.offsetY);

        //     let activeUI = this.m_activeMouseUI;
        //     if(this.m_onMouseDown && activeUI != null){
                
        //         activeUI.onMouseDrag(new RUIMouseDragEvent(activeUI,RUIEvent.MOUSE_DRAG,e.offsetX,e.offsetY,false,tar));
        //         this.m_activeMouseUIDrag = true;
        //     }
        // })

        // c.addEventListener('mouseenter',(e)=>{
        //     this.EvtMouseEnter.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_ENTER,tar));
        // });

        // c.addEventListener('mouseleave',(e)=>{
        //     this.EvtMouseLeave.emit(new RUIEvent(this.m_target.rootui,RUIEvent.MOUSE_LEAVE,tar));
        // });
    }

    // private onKeyboardEvent(e:KeyboardEvent){
    //     // let activeUI = this.m_target.activeUI;
    //     // if(activeUI != null) activeUI.onKeyPress(e);
    // }
    // private onKeyboardDown(e:KeyboardEvent){
    //     // let activeUI = this.m_target.activeUI;
    //     // if(activeUI != null) activeUI.onKeyDown(e);
    // }

    public static ProcessTextKeyDown(text:string,e:RUIKeyboardEvent): string{
        let raw = e.raw;
        let key = raw.key;

        if(key == 'Backspace'){
            if(raw.shiftKey){
                return '';
            }
            if(text == null || text.length == 0) return text;
            text = text.slice(0,text.length-1);
        }
        else if(key.length == 1) {
            return text + raw.key;
        }
        return text;
    }
}