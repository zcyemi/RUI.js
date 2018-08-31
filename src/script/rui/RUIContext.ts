import { RUIEventEmitter } from "./RUIEvent";

export type RUIInitConfig = {
    fontPath?: string,
    fontSize?: number,
}


export var RUI_CONFIG: RUIInitConfig;
export var RUIEVENT_ONFRAME: RUIEventEmitter<number> = new RUIEventEmitter();
var RUI_INITED:boolean = false;


export function RUIInitContext(config:RUIInitConfig){
    RUI_CONFIG = config;

    if(!RUI_INITED){
        RUI_INITED = true;
        window.requestAnimationFrame(onRequestAnimationFrame);
    }
}


function onRequestAnimationFrame(f:number){
    RUIEVENT_ONFRAME.emitRaw(f);
    window.requestAnimationFrame(onRequestAnimationFrame);
}




