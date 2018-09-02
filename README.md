# RUI.js
UI library for WebGL/Browser.

RUI.js defines a DOM-like UI hierachy structure which can be rendered by using WebGL.
Some basic UI widgets are provided for preview.

For layout,a seperated layout engine solves the flex-box-model layout for the entire UI tree. 
DIV-like flow layouting and flex are supported currently.

![image](https://github.com/soyemi/RUI.js/blob/master/sample/resources/sample-image.png)

---

**This project is still under pre-alpha stage**

## Quick Start

Run sample project.
```
//clone repo
git clone git@github.com:soyemi/RUI.js.git
npm install

//build lib
npm run build

//run sample
npm run build-sample
npm start
```

## Usage

```html
<canvas id="ruisample"></canvas>
```
```typescript
import { RUISampleWidget } from "./RUISampleWidget";

let canvas = <HTMLCanvasElement>document.getElementById('ruisample');
//load font
RUIInitContext({
    fontPath :'./resources/firacode.ttf'
});
//create RUIObject
let sample = new RUISampleWidget();

//Setup for DOMCanvas
let ruicanvas = new RUIDOMCanvas(canvas,sample);
```

more details : [sample](https://github.com/soyemi/RUI.js/tree/master/sample)

## License 
MIT
