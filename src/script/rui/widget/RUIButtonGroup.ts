import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIButton } from "./RUIButton";
import { RUIObject, RUIOrientation, RUIAuto, CLAMP } from "../RUIObject";
import { RUIStyle } from "../RUIStyle";
import { RUIWheelEvent } from "../RUIEvent";



export class RUIButtonGroup extends RUIContainer{
    public static readonly BUTTON_WIDTH:number = 100;

    public buttonSize:number = RUIButtonGroup.BUTTON_WIDTH;

    private m_buttons: RUIButton[];

    private m_isVertical:boolean;
    private m_btnTotalSize:number;
    private m_initResized:boolean =false;

    private m_btnScrollOffset:number =0;
    private m_hasBtnScroll:boolean = false;


    public constructor(buttons:RUIButton[],orientation:RUIOrientation){
        super();
        this.m_buttons = buttons;
        this.boxOrientation = orientation;
        this.boxBorder = RUIStyle.Default.primary0;
        this.boxClip = RUIContainerClipType.Clip;
        this.padding = [1,1,1,1];


        for(var i=0,len=buttons.length;i<len;i++){
            let btn = buttons[i];
            this.addButton(btn);
        }

        this.m_isVertical = orientation == RUIOrientation.Vertical;

        this.resizeButtons();
    }


    public addChild(ui:RUIObject){
        console.error('use addButton');
    }
    public removeChild(ui:RUIObject){
        console.error('use removeButton');
    }

    public addButton(btn:RUIButton){
        super.addChild(btn);
    }

    public removeButton(btn:RUIButton){
        super.removeChild(btn);
    }

    public getButtonIndex(btn:RUIButton){
        return this.m_buttons.indexOf(btn);
    }

    public onLayoutPost(){
        super.onLayoutPost();

        if(!this.m_initResized){
            this.resizeButtons();
            this.setDirty();
            this.m_initResized =true;
        }
        else{
            let newisVertical = this.boxOrientation == RUIOrientation.Vertical;
            if(newisVertical != this.m_isVertical){
                this.m_isVertical = newisVertical;
                this.resizeButtons();
                this.setDirty();
            }
        }
        
    }

    public resizeButtons(){
        let isvertical = this.m_isVertical;
        
        if(isvertical)
        {
            this.padding[3] = 1;

            if(this.width != RUIAuto){
                this.m_buttons.forEach(b => {
                    b.width = this.width;
                });
            }

            let totalsize= 0;
            this.m_buttons.forEach(b=>{
                totalsize += b._calheight;
            })

            this.m_btnTotalSize = totalsize;
        }
        else{
            this.padding[0] = 1;

            if(this.width == RUIAuto){
                this.m_buttons.forEach(b=>{
                    b.width = this.buttonSize;
                })

                this.m_btnTotalSize = this.m_buttons.length * this.buttonSize;
            }
            else{
                let btnCounts = this.m_buttons.length;
                let btnPerSize = this._calwidth / btnCounts;
                if(btnPerSize < this.buttonSize){
                    btnPerSize = this.buttonSize;
                }

                this.m_buttons.forEach(b=>{
                    b.width = btnPerSize;
                });

                this.m_btnTotalSize = this.m_buttons.length * btnPerSize;
            }
        }
    }

    public onMouseWheel(e:RUIWheelEvent){
        if(this.m_isVertical){
            let offset = this.m_btnScrollOffset;
            if(this.m_btnTotalSize > this._calheight){
                let maxoffset = this.m_btnTotalSize - this._calheight;

                offset -= e.delta *0.25;
                offset = CLAMP(offset,-maxoffset,0);
                this.m_hasBtnScroll = true;
            }
            else{
                this.m_hasBtnScroll = false;
                offset = 1;
            }

            if(offset != this.m_btnScrollOffset){
                this.m_btnScrollOffset = offset;
                this.padding[0] = offset;
                this.setDirty();
            }
        }
        else{

            let offset = this.m_btnScrollOffset;
            if(this.m_btnTotalSize > this._calwidth){
                let maxoffset = this.m_btnTotalSize - this._calwidth;

                offset -= e.delta *0.25;
                offset = CLAMP(offset,-maxoffset,0);
                this.m_hasBtnScroll = true;
            }
            else{
                this.m_hasBtnScroll = false;
                offset = 1;
            }

            if(offset != this.m_btnScrollOffset){
                this.m_btnScrollOffset = offset;
                this.padding[3] = offset;
                this.setDirty();
            }
            
        }
    }
    

}