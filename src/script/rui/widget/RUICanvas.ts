import { RUIObject, RUIPosition } from "../RUIObject";
import { RUIRoot } from "../RUIRoot";
import { RUIContainer } from "../RUIContainer";
import { RUICmdList } from "../RUICmdList";
import { RUILayouter } from "../RUILayouter";
import { RUIRectangle } from "../RUIRectangle";
import { RUIMouseDragEvent, RUIMouseDragStage } from "../EventSystem";


export class RUICanvas extends RUIObject{


    private m_canvasRoot:RUIRoot;
    private m_canvasContianer:RUIContainer;
    private m_layouter: RUILayouter;

    private m_rect1 : RUIObject;
    private m_canvasOriginX: number = 0;
    private m_canvasOriginY :number = 0;

    public constructor(){
        super();

        this.init();
    }

    private init(){

        this.m_layouter = new RUILayouter();
        this.height = 300;

        let container = new RUIContainer();

        let rect1 = new RUIRectangle();
        rect1.width = 20;
        rect1.height = 20;
        rect1.position = RUIPosition.Offset;
        this.m_rect1= rect1;
        container.addChild(rect1);

        let canvasroot= new RUIRoot(container,true);

        this.m_canvasContianer = container;
        this.m_canvasRoot = canvasroot;

    }


    private m_dragStartX :number;
    private m_dragStartY :number;
    public onMouseDrag(e:RUIMouseDragEvent){

        if(e.stage == RUIMouseDragStage.Begin){
            this.m_dragStartX = e.mousex;
            this.m_dragStartY = e.mousey;
        }
        else if(e.stage == RUIMouseDragStage.Update){
            let offx = e.mousex - this.m_dragStartX;
            let offy = e.mousey - this.m_dragStartY;

            this.m_rect1.left = this.m_canvasOriginX + offx;
            this.m_rect1.top = this.m_canvasOriginY + offy;
            this.setDirty();
            this.m_rect1.setDirty();
        }
        else{
            this.m_canvasOriginX += (e.mousex - this.m_dragStartX);
            this.m_canvasOriginY +=(e.mousey - this.m_dragStartY);
        }
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