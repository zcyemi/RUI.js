import { RUIObject } from "../RUIObject";
import { RUIRoot } from "../RUIRoot";
import { RUIContainer } from "../RUIContainer";
import { RUICmdList } from "../RUICmdList";
import { RUILayouter } from "../RUILayouter";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseDragEvent } from "../EventSystem";


export class RUINodeCanvas extends RUIObject{


    private m_canvasRoot:RUIRoot;
    private m_canvasContianer:RUIContainer;
    private m_layouter: RUILayouter;

    public constructor(){
        super();

        this.init();
    }

    private init(){

        this.m_layouter = new RUILayouter();

        // this.width = 200;
        // this.height = 200;

        this.height = 300;

        let container = new RUIContainer();

        let rect1 = new RUIRectangle();
        rect1.width = 20;
        rect1.height = 20;
        container.addChild(rect1);

        let canvasroot= new RUIRoot(container,true);

        this.m_canvasContianer = container;
        this.m_canvasRoot = canvasroot;

    }

    public onMouseDrag(e:RUIMouseDragEvent){
    }


    public onLayoutPost(){

        //sync uiobject
        let container = this.m_canvasContianer;
        container._calx = this._calx;
        container._caly = this._caly;
        
        this.m_canvasRoot.resizeRoot(this._calwidth,this._calheight);
        this.m_layouter.build(this.m_canvasRoot);
    }

    public onDraw(cmd:RUICmdList){
        this.m_canvasContianer.onDraw(cmd);
    }


}