import {RUIDOMCanvas, RUIRoot, RUICmdList, RUIContainer, RUIDebug} from '../../src/script/rui';


export class RUISample{

    private m_ruiroot: RUIRoot;
    private m_ruicmdlist: RUICmdList;

    private m_ruicanvas: RUIDOMCanvas;

    public constructor(canvas:HTMLCanvasElement){
        this.m_ruicanvas = new RUIDOMCanvas(canvas);
        this.buildUI();
    }

    private buildUI(){
        this.m_ruicmdlist = new RUICmdList();

        var ui = new RUIContainer();


        ui.addChild(new RUIDebug());

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

    let ruisample = new RUISample(canvas);


    var f = (ts:number)=>{
        ruisample.OnFrame(ts);
        window.requestAnimationFrame(f);
    }
    window.requestAnimationFrame(f);

    return canvas;

}

document.body.appendChild(sample());

