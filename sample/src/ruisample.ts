/// <reference path='./../js/rui.d.ts'/>
import rui = require('rui');
import { RUIInitContext } from 'rui/RUIContext';

let canvas = <HTMLCanvasElement>document.getElementById('ruisample');

RUIInitContext({
    fontPath :'./../resources/consola.ttf'
});

let ruicanvas = new rui.RUIDOMCanvas(canvas);

console.log(ruicanvas);


window['sample'] = canvas;