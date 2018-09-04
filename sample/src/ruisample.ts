/// <reference path='./../../dist/rui.d.ts'/>

import { RUIContainer, RUIInitContext, RUIDOMCanvas, RUIButton, RUITabView, RUIRectangle, RUIConst } from "rui";
import { RUISampleWidget } from "./RUISampleWidget";

export var webglcontext:WebGL2RenderingContext = null;

let canvas = <HTMLCanvasElement>document.getElementById('ruisample');

RUIInitContext({
    fontPath :'./resources/firacode.ttf'
});





let ruicanvas = new RUIDOMCanvas(canvas,null);
webglcontext = ruicanvas.renderer.GLContext;

let sample = new RUISampleWidget();
ruicanvas.setRootUI(sample);