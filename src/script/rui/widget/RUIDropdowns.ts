import { RUIButton } from "./RUIButton";
import { RUIContainer } from "../RUIContainer";
import { RUIOrientation } from "../RUIDefine";
import { RUIOverlay } from "./RUIOverlay";
import { RUILayoutData } from "../RUIObject";


export class RUIDropdowns extends RUIContainer{

    private m_button:RUIButton;
    private m_overlay:RUIDropdownsOverlay;

    public constructor(label:string){
        super(RUIOrientation.Vertical);

        let button = new RUIButton(label,this.onButtonClick.bind(this));
        this.addChild(button);
        this.m_button = button;

        let overlay = new RUIDropdownsOverlay();
        overlay.layer = 1;
        overlay.enable = false;
        overlay.top = 0;
        overlay.left =0;
        this.addChild(overlay);
        this.m_overlay = overlay;

    }

    public LayoutPost(data:RUILayoutData){
        super.LayoutPost(data);

        this.m_overlay.rOffy += this.m_button.rCalHeight;
    }

    private onButtonClick(btn:RUIButton){
        let overlay = this.m_overlay;
        if(!overlay.enable){
            overlay.enable = true;
            this._root.setActiveUI(overlay);
        }
    }
}

class RUIDropdownsOverlay extends RUIOverlay{
    
    public onActive(){
        console.log('on active');
    }

    public onInactive(){
        this.enable = false;
        this.setDirty();
    }
}