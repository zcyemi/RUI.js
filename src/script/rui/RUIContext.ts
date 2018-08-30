import { RUIEventEmitter } from "./RUIEvent";

export type RUIInitConfig = {
    fontPath?: string,
    fontSize?: number,
}


export var RUI_CONFIG: RUIInitConfig;
export var RUIEVENT_ONFRAME: RUIEventEmitter<number> = new RUIEventEmitter();
var RUI_INITED:boolean = false;


export function RUIInitContext(config:RUIInitConfig){
    console.log('init');
    RUI_CONFIG = config;

    if(!RUI_INITED){
        console.log('init rui');
        RUI_INITED = true;

        window.requestAnimationFrame(onRequestAnimationFrame);
    }
}


function onRequestAnimationFrame(f:number){
    RUIEVENT_ONFRAME.emitRaw(f);
    window.requestAnimationFrame(onRequestAnimationFrame);
}




