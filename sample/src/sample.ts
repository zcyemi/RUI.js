import {RUIDOMCanvas, RUIRoot, RUICmdList, RUIContainer, RUI} from '../../src/script/rui';
import { RUISampleWidget } from './ruidebug';


export class RUISample{

    private m_ruiroot:RUIRoot = null;
    private m_ruicmdlist: RUICmdList = null;

    private m_ruicanvas: RUIDOMCanvas;

    private m_sampleWidget:RUISampleWidget;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUIDOMCanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        this.m_ruicmdlist = new RUICmdList();

        var ui = new RUIContainer();

        let sampleWdiget = new RUISampleWidget();
        this.m_sampleWidget = sampleWdiget;


        ui.addChild(sampleWdiget);

        var root = new RUIRoot(ui,false);
        root.root = ui;

        root.resizeRoot(this.m_ruicanvas.m_width,this.m_ruicanvas.m_height);
        this.m_ruicanvas.EventOnResize.on((e)=>{
            root.resizeRoot(e.object.width,e.object.height);
        });
        
        this.m_ruicanvas.EventOnUIEvent.on((e)=>root.dispatchEvent(e));

        this.m_ruiroot = root;
    }

    public OnFrame(ts:number){
        
        let uiroot = this.m_ruiroot;
        let renderer= this.m_ruicanvas.renderer;
        if(uiroot.isdirty || renderer.needRedraw){
            let start = Date.now();
            uiroot.layout();
            //console.log(uiroot.root);
            console.log('> ' + (Date.now() - start));
            this.m_ruicmdlist.draw(uiroot);
            renderer.DrawCmdList(this.m_ruicmdlist);
        }
    }
}


function sample(){
    let canvas = document.createElement("canvas");
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.backgroundColor = '#333';

    RUI.Init({
        fontPath: 'resources/consola.ttf',
        fontSize: 16
    });

    let ruisample = new RUISample(canvas);


    var f = (ts:number)=>{
        ruisample.OnFrame(ts);
        window.requestAnimationFrame(f);
    }
    window.requestAnimationFrame(f);

    return canvas;

}

document.body.appendChild(sample());

