/// <reference path='./../../dist/rui.d.ts'/>
import rui = require('rui');

let canvas = <HTMLCanvasElement>document.getElementById('ruisample');

rui.RUIInitContext({
    fontPath :'./resources/consola.ttf'
});

let ruicanvas = new rui.RUIDOMCanvas(canvas);

console.log(ruicanvas);


window['sample'] = canvas;