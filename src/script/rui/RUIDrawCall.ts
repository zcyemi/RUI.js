// import { UIObject, UIOrientation, UIDisplayMode, UIPosition } from "./UIObject";
// import { UIInput } from "./widget/UIInput";
// import { RUICanvas } from "./RUICanvas";



// export enum DrawCmdType {
//     rect,
//     text,
//     border,
//     line
// }

// export class DrawCmd {

//     public Rect: number[] = [];
//     public Color: number[];
//     public Text: string;

//     public Index:number = 0;

//     public type: DrawCmdType = DrawCmdType.rect;

    
//     public constructor(rect?: number[]) {
//         this.Rect = rect;
//     }

//     public static CmdRect(rect: number[], color: number[]): DrawCmd {
//         let cmd = new DrawCmd();
//         cmd.Rect = rect;
//         cmd.Color = color;
//         return cmd;
//     }

//     public static CmdText(text: string, cliprect: number[], color?: number[]) {
//         let cmd = new DrawCmd();
//         cmd.Text = text;
//         cmd.Rect = cliprect;
//         cmd.Color = color;
//         cmd.type = DrawCmdType.text;
//         return cmd;
//     }

//     public static CmdBorder(rect: number[], color: number[]): DrawCmd {
//         let cmd = new DrawCmd();
//         cmd.Rect = rect;
//         cmd.Color = color;
//         cmd.type = DrawCmdType.border;
//         return cmd;
//     }

//     public static CmdLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
//         let cmd = new DrawCmd();
//         cmd.Rect = [x1, y1, x2, y2];
//         cmd.Color = color;
//         cmd.type = DrawCmdType.line;
//         return cmd;
//     }

// }

// export class RUIDrawCall {


//     public drawList: DrawCmd[] = [];
    
//     private m_maxCount: number =0 ;
//     private m_curzorder:number =0 ;
//     private m_curCount:number = 0;
//     public static readonly LEVEL_OFFSET:number = 1000;
//     public static readonly LAYER_DEFAULT:number = 0;
//     public static readonly LAYER_OVERLAY:number = 5;

//     public isDirty: boolean = true;

//     public canvas: RUICanvas;

//     constructor() {

//     }

//     public get MaxDrawCount():number{
//         return this.m_maxCount;
//     }


//     public Rebuild(ui: UIObject, isResize: boolean = false) {

//         this.m_maxCount = 0;
//         this.m_curCount = 0;
//         this.drawList = [];
//         this.RebuildNode(ui);
//         this.ExecNodesDisplay(ui, this.PostRebuild.bind(this), this.PostRebuildFinal.bind(this));

//         ui.isDirty = false;
//         this.isDirty = true;

//     }

//     private ExecNodes(uiobj: UIObject, fpre: (ui: UIObject) => void, fpost?: (UIObject) => void) {
//         fpre(uiobj);
//         let c = uiobj.children;
//         let cc = c.length;
//         for (let i = 0; i < cc; i++) {
//             let cu = c[i];
//             this.ExecNodes(cu, fpre, fpost);
//         }
//         if (fpost) fpost(uiobj);
//     }

//     private ExecNodesDisplay(uiobj: UIObject, fpre: (ui: UIObject) => void, fpost?: (UIObject) => void) {
//         if(uiobj.displayMode == UIDisplayMode.None){
//             return;
//         }
//         fpre(uiobj);
//         let c = uiobj.children;
//         let cc = c.length;
//         for (let i = 0; i < cc; i++) {
//             let cu = c[i];
//             this.ExecNodesDisplay(cu, fpre, fpost);
//         }
//         if (fpost) fpost(uiobj);
//     }

//     //Process all child ui and self rect
//     private RebuildNode(ui: UIObject) {
//         switch (ui.displayMode) {
//             case UIDisplayMode.Default:
//                 this.RebuildNodeDefault(ui);
//                 break;
//             case UIDisplayMode.Flex:
//                 this.RebuildNodeFlex(ui);
//                 break;
//         }
//     }

//     private fillFlexSize(ui: UIObject) {
//         if (ui._flexHeight != null) {
//             ui._height = ui._flexHeight;
//         }
//         else {
//             ui._height = ui.height;
//         }
//         if (ui._flexWidth != null) {
//             ui._width = ui._flexWidth;
//         }
//         else {
//             ui._width = ui.width;
//         }
//     }


//     //Post process rect
//     private RebuildNodeDefault(ui: UIObject) {
//         this.fillFlexSize(ui);

//         let children = ui.children;
//         let parent = ui.parent;

//         let isVertical = ui.orientation == UIOrientation.Vertical;
//         let childOffset = 0;

//         let childMaxSecond = 0;

//         let clen = children.length;

//         let floatingObject: UIObject[] = [];

//         for (var i = 0, len = clen; i < len; i++) {
//             let c = children[i];

//             if(c.displayMode == UIDisplayMode.None) continue;

//             if (c.position != UIPosition.Default) {
//                 floatingObject.push(c);
//                 continue;
//             }

//             c._flexWidth = null;
//             c._flexHeight = null;


//             //TODO: set size for flex child
//             this.RebuildNode(c);


//             let cwidth = c._width;
//             let cheight = c._height;
//             if (cwidth == undefined || cheight == undefined) throw new Error('child size not full calculated!');

//             if (isVertical) {
//                 c._offsetX = 0;
//                 c._offsetY = childOffset;
//                 childOffset += c._height;


//                 childMaxSecond = Math.max(childMaxSecond, c._width);
//             } else {
//                 c._offsetX = childOffset;
//                 c._offsetY = 0;
//                 childOffset += c._width;
//                 childMaxSecond = Math.max(childMaxSecond, c._height);
//             }
//         }

//         if (clen > 0) {
//             //set ui size
//             if (ui._width == undefined) {
//                 ui._width = isVertical ? childMaxSecond : childOffset;
//             }
//             if (ui._height == undefined) {
//                 ui._height = isVertical ? childOffset : childMaxSecond;
//             }
//         }
//         else {

//             let pisVertical = parent.orientation == UIOrientation.Vertical;
//             if (ui._width == undefined) {
//                 ui._width = pisVertical ? parent._width : 100;
//             }
//             if (ui._height == undefined) {
//                 ui._height = pisVertical ? 23 : parent._height;
//             }
//         }

//         //floating object
//         for (var i = 0, len = floatingObject.length; i < len; i++) {
//             let fui = floatingObject[i];
//             this.RebuildFloatingUI(fui);
//         }

//     }

//     private RebuildFloatingUI(fui: UIObject) {

//         let left = fui.floatLeft;
//         let right = fui.floatRight;
//         let top = fui.floatTop;
//         let bottom = fui.floatBottom;

//         let p = fui.parent;

//         let isAbsolute = fui.position == UIPosition.Absolute;
//         let pwidth = p == null || isAbsolute ? fui._canvas.m_width : p._width;
//         let pheight = p == null || isAbsolute ? fui._canvas.m_height : p._height;

//         if (left != null && right != null) {
//             if (fui.width == null) {
//                 fui._width = (pwidth - left - right);
//             }
//         }

//         if (bottom != null && top != null) {
//             if (fui.height == null) {
//                 fui._height = (pheight - top - bottom);
//             }
//         }

//         this.RebuildNode(fui);
//         if (left != null) {
//             fui._offsetX = left;
//         }
//         else if (right != null) {
//             fui._offsetX = pwidth - right - fui._width;
//         }
//         else {
//             throw new Error("floating ui missing left/right property");
//         }

//         if (top != null) {
//             fui._offsetY = top;
//         }
//         else if (bottom != null) {
//             fui._offsetY = pheight - bottom - fui._height;
//         }
//         else {
//             throw new Error("floating ui missing top/bottom property");
//         }

//     }


//     //Pre process rect
//     private RebuildNodeFlex(ui: UIObject) {
//         this.fillFlexSize(ui);

//         //checkfor root
//         let parent = ui.parent;
//         if (parent == null) {
//             let canvas = ui._canvas;
//             ui._width = canvas.m_width;
//             ui._height = canvas.m_height;
//         }

//         let isVertical = ui.orientation == UIOrientation.Vertical;
//         //check size
//         if (ui._height == null) {
//             if (ui.height != null) {
//                 ui._height = ui.height;
//             }
//             else if (parent.orientation == UIOrientation.Horizontal) {
//                 ui._height = parent.height;
//             }
//             else {
//                 console.error(ui);
//                 throw new Error('flex proces error');
//             }
//         }
//         if (ui._width == null) {
//             if (ui.width != null) {
//                 ui._width = ui.width;
//             }
//             else if (parent.orientation == UIOrientation.Vertical) {
//                 ui._width = parent._width;
//             }
//             else {
//                 console.error(ui);
//                 throw new Error('flex proces error');
//             }
//         }
//         let fsizeTotal = isVertical ? ui._height : ui._width;
//         let fsizeSecond = isVertical ? ui._width : ui._height;


//         let children = ui.children;
//         let clen = children.length;

//         let flexCount = 0;
//         let flexSize = 0;

//         let floatingObject: UIObject[] = [];

//         //calculate size
//         for (var i = 0; i < clen; i++) {
//             let c = children[i];

//             if(c.displayMode == UIDisplayMode.None) continue;

//             if (c.position != UIPosition.Default) {
//                 floatingObject.push(c);
//                 continue;
//             }


//             if (c.flex != null) {
//                 flexCount += c.flex;
//             }
//             else {
//                 let cfsize = isVertical ? c.height : c.width;
//                 if (cfsize == null) {
//                     throw new Error('flexed child has invalid flex or size');
//                 } else {
//                     flexSize += cfsize;
//                 }
//             }
//         }
//         let sizePerFlex = (fsizeTotal - flexSize) / flexCount;

//         let childOffsetY = 0;
//         let childOffsetX = 0;

//         for (var i = 0; i < clen; i++) {
//             let c = children[i];

//             let flexval = c.flex != null;

//             if (isVertical) {
//                 c._flexWidth = fsizeSecond;
//                 c._flexHeight = flexval ? c.flex * sizePerFlex : c.height;
//             }
//             else {
//                 c._flexHeight = fsizeSecond;
//                 c._flexWidth = flexval ? c.flex * sizePerFlex : c.width;
//             }
//             this.RebuildNode(c);
//             c._offsetX = childOffsetX;
//             c._offsetY = childOffsetY;

//             if (isVertical) {
//                 childOffsetY += c._height;
//             } else {
//                 childOffsetX += c._width;
//             }
//         }

//         //floating object
//         for (var i = 0, len = floatingObject.length; i < len; i++) {
//             let fui = floatingObject[i];
//             this.RebuildFloatingUI(fui);
//         }

//     }

//     private PostRebuild(ui: UIObject) {

//         let p = ui.parent;

//         let absolute = ui.position == UIPosition.Absolute;

//         if (p == null) {

//             if(ui.position == UIPosition.Default){
//                 ui._calculateX = 0;
//                 ui._calculateY = 0;
//             }else{
//                 ui._calculateX = ui._offsetX;
//                 ui._calculateY = ui._offsetY;
//             }
            
//             ui._level = 0;
//         }
//         else {

//             if(absolute){
//                 ui._calculateX = ui._offsetX;
//                 ui._calculateY = ui._offsetY;
//             }
//             else{
//                 ui._calculateX = p._calculateX + ui._offsetX;
//                 ui._calculateY = p._calculateY + ui._offsetY;
//             }


//             ui._level = p._level + 1;
//         }

//         if (ui.visibleSelf) {
//             this.m_curzorder = ui.zorder * RUIDrawCall.LEVEL_OFFSET;
//             ui.onDraw(this);
//         }
//     }

//     private PostRebuildFinal(ui: UIObject) {
//         if (ui.visibleSelf) {
//             this.m_curzorder = ui.zorder * RUIDrawCall.LEVEL_OFFSET;
//             //ui.onDrawLate(this);
//         }
//     }
    


//     public DrawRect(x: number, y: number, w: number, h: number) {
//         let cmd = new DrawCmd([x, y, w, h]);

//         cmd.Index = this.CalculateZOrder();

//         this.drawList.push();
//     }

//     public DrawRectWithColor(pos: number[], color: number[]) {
//         let cmd = new DrawCmd(pos);
//         cmd.Color = color;
        
//         cmd.Index = this.CalculateZOrder();

//         this.drawList.push(cmd);
//     }

//     public DrawText(text: string, clirect: number[], color?: number[]) {
//         let cmd = DrawCmd.CmdText(text, clirect, color);

//         cmd.Index = this.CalculateZOrder();

//         this.drawList.push(cmd);
//     }

//     public DrawBorder(rect: number[], color: number[]) {
//         let cmd = DrawCmd.CmdBorder(rect, color);
//         cmd.Index = this.CalculateZOrder();
//         this.drawList.push(cmd);
//     }

//     public DrawLine(x1: number, y1: number, x2: number, y2: number, color: number[]) {
//         let cmd = DrawCmd.CmdLine(x1,y1,x2,y2,color);
//         cmd.Index= this.CalculateZOrder();
//         this.drawList.push(cmd);
//     }

//     private CalculateZOrder():number{
//         let index = this.m_curzorder + this.m_curCount;
//         this.m_curCount ++;
//         this.m_maxCount = Math.max(this.m_maxCount,index);
//         return index;
//     }
// }