import { RUIObject, RUIOverflow, RUIOrientation, RUIConst, RUIAuto } from "./RUIObject";
import { RUICmdList } from "./RUICmdList";
import { RUIStyle } from "./RUIStyle";
import { UIUtil } from "./UIUtil";


export class RUIContainer extends RUIObject{
    public boxClip: boolean = true;
    public boxOverflow: RUIOverflow = RUIOverflow.Clip;
    public boxOrientation: RUIOrientation = RUIOrientation.Vertical;

    public children: RUIObject[] = [];


    public addChild(ui:RUIObject){
        if(ui == null) return;
        let c = this.children;
        if(c.indexOf(ui)>=0) return;

        ui.parent =this;
        ui._root = this._root;
        c.push(ui);

        ui.setDirty();
    }

    public removeChild(ui:RUIObject){
        if(ui == null) return;
        let c = this.children;
        let index= c.indexOf(ui);
        if(index <0) return;
        this.children = c.splice(index,1);

        this.isdirty =true;
        ui.parent = null;
        ui._root = null;
    }

    public onLayout(){

        let isVertical = this.boxOrientation == RUIOrientation.Vertical;

        let children = this.children;

        let offset = 0;
        let maxsize = 0;

        let offsetside = 0;

        //padding
        let padding = this.padding;
            offset += padding[isVertical? RUIConst.TOP : RUIConst.LEFT];
            offsetside = padding[isVertical? RUIConst.LEFT: RUIConst.TOP];

        //margin
        let marginLast = 0;

        if(children.length != 0){
            for(var i=0,len = children.length;i<len;i++){
                let c= children[i];

                c.onLayout();

                let cw = c._calwidth;
                let ch = c._calheight;
                if(cw == null) throw new Error("children width is null");
                if(ch == null) throw new Error("children height is null");

                let cmargin = c.margin;
                if(isVertical){
                    marginLast = Math.max(marginLast, cmargin[RUIConst.TOP]);

                    c._caloffsety = offset + marginLast;
                    c._caloffsetx = offsetside + cmargin[RUIConst.LEFT];
                    offset += ch + marginLast;
                    marginLast = cmargin[RUIConst.BOTTOM];
                    maxsize = Math.max(maxsize,cw + cmargin[RUIConst.LEFT]+ cmargin[RUIConst.RIGHT]);
                }
                else{
                    marginLast = Math.max(marginLast,cmargin[RUIConst.LEFT]);

                    c._caloffsetx = offset + marginLast;
                    c._caloffsety = offsetside + cmargin[RUIConst.TOP];
                    offset +=cw + marginLast;
                    marginLast = cmargin[RUIConst.RIGHT];
                    maxsize = Math.max(maxsize,ch+ cmargin[RUIConst.TOP] + cmargin[RUIConst.BOTTOM]);
                }

                c.fillPositionOffset();
            }
            
            offset += marginLast;
        }
        else{

        }

        if(isVertical){
            this._calwidth = maxsize + padding[RUIConst.RIGHT] + padding[RUIConst.LEFT];
            this._calheight = offset +padding[RUIConst.BOTTOM];
        }
        else{
            this._calheight = maxsize + padding[RUIConst.BOTTOM] + padding[RUIConst.TOP];
            this._calwidth = offset + padding[RUIConst.RIGHT];
        }

        if(this.width != RUIAuto) this._calwidth = this.width;
        if(this.height != RUIAuto) this._calheight = this.height;
    }


    public onDraw(cmd:RUICmdList){
        this.onDrawPre(cmd);

        let children= this.children;
        for(var i=0,clen = children.length;i<clen;i++){
            let c=  children[i];
            c.onDraw(cmd);
        }

        this.onDrawPost(cmd);
    }

    public onDrawPre(cmd:RUICmdList){

        let rect =[this._calx,this._caly,this._calwidth,this._calheight];
        this._rect = rect;

        cmd.DrawBorder(rect,RUIStyle.Default.primary);

        if(this.boxClip) cmd.PushClipRect(UIUtil.RectMinus(rect,this.padding));
    }

    public onDrawPost(cmd:RUICmdList){
        if(this.boxClip) cmd.PopClipRect();
    }
}
