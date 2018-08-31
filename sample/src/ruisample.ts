/// <reference path='./../../dist/rui.d.ts'/>

import { RUIContainer, RUIInitContext, RUIDOMCanvas, RUIRectangle, RUILabel } from "rui";


let canvas = <HTMLCanvasElement>document.getElementById('ruisample');

RUIInitContext({
    fontPath :'./resources/consola.ttf'
});

let uicontainer = new RUIContainer();
uicontainer.addChild(new RUIRectangle(100,100));
uicontainer.addChild(new RUILabel('demo'));

let ruicanvas = new RUIDOMCanvas(canvas,uicontainer);