define("ruisample", ["require", "exports", "rui", "rui/RUIContext"], function (require, exports, rui, RUIContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var canvas = document.getElementById('ruisample');
    RUIContext_1.RUIInitContext({
        fontPath: './../resources/consola.ttf'
    });
    var ruicanvas = new rui.RUIDOMCanvas(canvas);
    console.log(ruicanvas);
    window['sample'] = canvas;
});
//# sourceMappingURL=ruisample.js.map