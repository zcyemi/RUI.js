import { RUIEventEmitter, RUIObjEvent, RUIKeyboardEvent, RUIMouseEvent, RUIWheelEvent, RUIEventType } from "./RUIEvent";

export type RUIInitConfig = {
    fontPath?: string,
    fontSize?: number,
    forceFullLayout?:boolean,
}


export var RUI_CONFIG: RUIInitConfig;
export var RUIEVENT_ONFRAME: RUIEventEmitter<number> = new RUIEventEmitter();
export var RUIEVENT_ONUI: RUIEventEmitter<RUIObjEvent> = new RUIEventEmitter();

var RUI_INITED:boolean = false;


export function RUIInitContext(config:RUIInitConfig){
    RUI_CONFIG = config;
    
    if(config.forceFullLayout == null) config.forceFullLayout = true;

    if(!RUI_INITED){
        RUI_INITED = true;
        window.requestAnimationFrame(onRequestAnimationFrame);
        registerInputEvent();
    }
}

function registerInputEvent(){
    window.addEventListener('keydown',(e)=>RUIEVENT_ONUI.emit(new RUIKeyboardEvent(e)));
    window.addEventListener('mousedown',(e)=>RUIEVENT_ONUI.emit(new RUIMouseEvent(e,RUIEventType.MouseDown)));
    window.addEventListener('mouseup',(e)=>RUIEVENT_ONUI.emit(new RUIMouseEvent(e,RUIEventType.MouseUp)));
    window.addEventListener('mousemove',(e)=>RUIEVENT_ONUI.emit(new RUIMouseEvent(e,RUIEventType.MouseMove)));
    window.addEventListener('mousewheel',(e)=>{RUIEVENT_ONUI.emit(new RUIWheelEvent(e))});
}


function onRequestAnimationFrame(f:number){
    RUIEVENT_ONFRAME.emitRaw(f);
    window.requestAnimationFrame(onRequestAnimationFrame);
}




