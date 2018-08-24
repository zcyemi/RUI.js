import { RUIContainer } from "../RUIContainer";
import { RUIPosition } from "../RUIObject";
import { RUI } from "../RUI";
import { RUIStyle } from "../RUIStyle";
import { RUIMouseDragEvent, RUIMouseDragStage, RUIMouseEvent } from "../RUIEvent";
import { RUILabel } from "./RUILabel";

// import { RUIObject, RUIPosition } from "../RUIObject";
// import { RUIRoot } from "../RUIRoot";
// import { RUIContainer } from "../RUIContainer";
// import { RUICmdList } from "../RUICmdList";
// import { RUIRectangle } from "../RUIRectangle";
// import { RUIMouseDragEvent, RUIMouseDragStage } from "../RUIEvent";


// export class RUICanvas extends RUIObject {


//     private m_canvasRoot: RUIRoot;
//     private m_canvasContianer: RUIContainer;
//     private m_layouter: RUILayout;

//     private m_rect1: RUIObject;
//     private m_canvasOriginX: number = 0;
//     private m_canvasOriginY: number = 0;

//     public constructor() {
//         super();

//         this.init();
//     }

//     private init() {

//         this.m_layouter = new RUILayout();
//         this.height = 300;

//         let container = new RUIContainer();

//         let rect1 = new RUIRectangle();
//         rect1.width = 20;
//         rect1.height = 20;
//         rect1.position = RUIPosition.Offset;
//         this.m_rect1 = rect1;
//         container.addChild(rect1);

//         let canvasroot = new RUIRoot(container, true);

//         this.m_canvasContianer = container;
//         this.m_canvasRoot = canvasroot;

//     }


//     private m_dragStartX: number;
//     private m_dragStartY: number;
//     public onMouseDrag(e: RUIMouseDragEvent) {

//         if (e.stage == RUIMouseDragStage.Begin) {
//             this.m_dragStartX = e.mousex;
//             this.m_dragStartY = e.mousey;
//         }
//         else if (e.stage == RUIMouseDragStage.Update) {
//             let offx = e.mousex - this.m_dragStartX;
//             let offy = e.mousey - this.m_dragStartY;

//             this.m_rect1.left = this.m_canvasOriginX + offx;
//             this.m_rect1.top = this.m_canvasOriginY + offy;
//             this.setDirty();
//             this.m_rect1.setDirty();
//         }
//         else {
//             this.m_canvasOriginX += (e.mousex - this.m_dragStartX);
//             this.m_canvasOriginY += (e.mousey - this.m_dragStartY);
//         }
//     }


//     public onLayoutPost() {

//         //sync uiobject
//         let container = this.m_canvasContianer;
//         container._calx = this._calx;
//         container._caly = this._caly;

//         this.m_canvasRoot.resizeRoot(this._calwidth, this._calheight);
//         this.m_layouter.build(this.m_canvasRoot);


//     }

//     public onDraw(cmd: RUICmdList) {
//         this.m_canvasContianer.onDraw(cmd);
//     }


// }

export class RUICanvas extends RUIContainer{

    public constructor(){
        super();

        this.boxBackground = RUIStyle.Default.background3;
    }
}


export class RUICanvasNode extends RUIContainer{

    private m_dragStartPosX:number;
    private m_dragStartPosY:number;
    protected m_draggable:boolean = true;

    public constructor(){
        super();
        this.position = RUIPosition.Relative;
        this.left =0;
        this.top = 0;
    }

    public onMouseDrag(e:RUIMouseDragEvent){
        if(!this.m_draggable) return;
        if(e.stage == RUIMouseDragStage.Begin){
            this.m_dragStartPosX = this.left - e.mousex;
            this.m_dragStartPosY = this.top - e.mousey;
        }
        else{
            this.left = this.m_dragStartPosX + e.mousex;
            this.top = this.m_dragStartPosY + e.mousey;
            this.setDirty();
        }
    }
}


export class RUICanvasContainerNode extends RUICanvasNode{
    
    private m_onactive:boolean = false;
    public constructor(title:string){
        super();
        this.padding = RUI.Vector(3);
        this.boxBorder = RUIStyle.Default.border0;
        this.boxBackground = RUIStyle.Default.background1;
        this.addChild(new RUILabel(title));
    }

    public onActive(){
        this.m_onactive = true;
    }

    public onInactive(){
        this.m_onactive = false;
    }

}
