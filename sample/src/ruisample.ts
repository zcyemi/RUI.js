/// <reference path='./../../dist/rui.d.ts'/>

import { RUIContainer, RUIInitContext, RUIDOMCanvas, RUIButton, RUITabView, RUIRectangle, RUIConst } from "rui";
import { RUISampleWidget } from "./RUISampleWidget";


let canvas = <HTMLCanvasElement>document.getElementById('ruisample');

RUIInitContext({
    fontPath :'./resources/consola.ttf'
});


let sample = new RUISampleWidget();




let ruicanvas = new RUIDOMCanvas(canvas,sample);

