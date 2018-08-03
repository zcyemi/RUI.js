


export const RUIAuto: number= -1;

type RUISize = number;

export enum RUIPosition{
    Default,
    Relative,
    Absolute,
    Offset
}

export enum RUIBoxFlow{
    Flow,
    Flex
}

export enum RUIOverflow{
    Clip,
    Scroll
}

export enum RUIOrientation{
    Vertical,
    Horizontal
}

export class RUIObject{

    public width: RUISize = RUIAuto;
    public height: RUISize = RUIAuto;

    public maxwidth: RUISize = RUIAuto;
    public maxheight: RUISize = RUIAuto;
    public minwidth:RUISize = 70;
    public minheight:RUISize = 23;
    public margin : number[];
    public padding: number[];

    public position : RUIPosition = RUIPosition.Default;
    public left: RUISize;
    public right: RUISize;
    public top: RUISize;
    public bottom:RUISize;

    public visible: boolean = false;
    public zorder: number = 0;
    public flex: number | null;

    public parent: RUIObject = null;

    public id:string;
    public isdirty: boolean = true;

    public _calwidth?: number;
    public _calheight?:number;
    public _caloffsetx:number = 0;
    public _caloffsety:number = 0;

    public _root :RUIRoot;

    public _resized:boolean = false;

    public onBuild(){

    }

    public onDraw(){

    }

    public onLayout(){
        let isRoot = this.isRoot;

        if(!this._resized){
            if(this._calwidth == null) throw new Error();
            if(this._calheight == null) throw new Error();
            return;
        }
        if(this.width != RUIAuto){
            this._calwidth = this.width;
        }
        else{
            if(isRoot){
                throw new Error();
            }
            else{
                this._calwidth = this.minwidth;
            }
        }

        if(this.height != RUIAuto){
            this._calheight = this.height;
        }
        else{
            if(isRoot){
                throw new Error();
            }
            else{
                this._calheight = this.minheight;
            }
        }
        this._resized = false;
    }

    public get isRoot():boolean{
        return this._root.root === this;
    }

}

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

        ui.isdirty = true;
        this.isdirty = true;
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
        if(children.length != 0){
            for(var i=0,len = children.length;i<len;i++){
                let c= children[i];

                c.onLayout();

                let cw = c._calwidth;
                let ch = c._calheight;
                if(cw == null) throw new Error("children width is null");
                if(ch == null) throw new Error("children height is null");

                if(isVertical){
                    c._caloffsety = offset;
                    c._caloffsetx = 0;
                    offset += ch;
                    maxsize = Math.max(maxsize,cw);
                }
                else{
                    c._caloffsetx = offset;
                    c._caloffsety = 0;
                    offset +=cw;
                    maxsize = Math.max(maxsize,ch);
                }
            }
        }
        else{

        }

        if(isVertical){
            this._calwidth = maxsize;
            this._calheight = offset;
        }
        else{
            this._calheight = maxsize;
            this._calwidth = offset;
        }
    }
}

export class RUIFlexContainer extends RUIContainer{


    public onLayout(){

      

    }
}

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = true;
}

export class RUILayouter{

    public static Build(uiroot: RUIRoot){
        let ui = uiroot.root;
        ui.onLayout();
        
    }


}