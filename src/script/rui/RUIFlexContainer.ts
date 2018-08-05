import { RUIContainer, RUIOrientation, RUIAuto, RUIConst, ROUND } from "./RUI";

export class RUIFlexContainer extends RUIContainer{


    public onLayout(){

        let isVertical = this.boxOrientation == RUIOrientation.Vertical;
        let children = this.children;


        this.fillSize();

        if(null == (isVertical? this._calheight: this._calwidth)) throw new Error();

        let clen = children.length;

        if(clen != 0){
            //accumulate flex
            let flexaccu = 0;
            let fixedaccu = 0;

            let contentTotal =0;
            let contentSide =0;

            let contentwidth = contentTotal = this._calwidth - this.padding[RUIConst.LEFT] - this.padding[RUIConst.RIGHT];
            let contentheight =  this._calheight - this.padding[RUIConst.TOP] - this.padding[RUIConst.BOTTOM];


            let sideIsAuto = false;

            if(isVertical){
                contentTotal = contentheight;
                contentSide = contentwidth;

                sideIsAuto = this._calwidth == null;
            }
            else{
                contentTotal = contentwidth;
                contentSide = contentheight;

                sideIsAuto = this._calheight == null;
            }


            let childMaxSide = RUIAuto;

            let marginAry:number[] = [];
            let marginValue = 0;
            let marginPos = isVertical ? RUIConst.TOP: RUIConst.LEFT;
            let marginPosSide = isVertical ? RUIConst.BOTTOM: RUIConst.RIGHT;
            let marginTotal = 0;

            for(var i=0;i<clen;i++){
                let c = children[i];

                if(c.flex == null){
                    let cfixed = isVertical? c.height :c.width;
                    if(cfixed == RUIAuto) {
                        throw new Error("flex object must have fixed size");
                    }
                    else{
                        fixedaccu += cfixed;
                    }
                }
                else{
                    flexaccu += c.flex;
                }

                let cmargin = c.margin;

                let cmarginValue = cmargin[marginPos];
                marginValue = Math.max(marginValue,cmarginValue);
                
                marginAry.push(marginValue);
                marginTotal += marginValue;
                marginValue = cmargin[marginPosSide];

                let cmaxside = 0;
                if(isVertical){
                    cmaxside = c.width + cmargin[RUIConst.LEFT] + cmargin[RUIConst.RIGHT];
                }
                else{
                    cmaxside = c.height + cmargin[RUIConst.TOP] + cmargin[RUIConst.BOTTOM];
                }
                childMaxSide = Math.max(childMaxSide,cmaxside);
            }

            marginAry.push(marginValue);
            marginTotal += marginValue;

            let sizePerFlex = (contentTotal - fixedaccu - marginTotal) / flexaccu;

            let offset = this.padding[isVertical? RUIConst.TOP : RUIConst.LEFT];
            let offsetside = this.padding[isVertical? RUIConst.LEFT: RUIConst.TOP];



            if(childMaxSide != RUIAuto && sideIsAuto){
                contentSide = childMaxSide;

                if(isVertical){
                    this._calwidth = childMaxSide + this.padding[RUIConst.LEFT] + this.padding[RUIConst.RIGHT];
                }
                else{
                    this._calheight = childMaxSide + this.padding[RUIConst.TOP] + this.padding[RUIConst.BOTTOM];
                }
            }

            for(var i=0;i<clen;i++){
                let c= children[i];

                let flowsize = c.flex == null ? ( isVertical ? c.height: c.width ): ROUND(c.flex * sizePerFlex);
                
                if(isVertical){
                    c._flexheight = flowsize;
                    c._flexwidth = (c.width == RUIAuto) ? contentSide : c.width;
                }
                else{
                    c._flexheight = (c.height == RUIAuto) ? contentSide: c.height;
                    c._flexwidth = flowsize;
                }

                c.onLayout();
                
                offset += marginAry[i];

                if(isVertical){
                    c._caloffsety = offset;
                    c._caloffsetx = offsetside +c.margin[RUIConst.LEFT];
                    offset += c._calheight;
                }
                else{
                    c._caloffsety= offsetside + c.margin[RUIConst.TOP];
                    c._caloffsetx = offset;

                    offset += c._calwidth;
                }
            }
        }

    }

}