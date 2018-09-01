import { RUIButton } from "./RUIButton";
import { RUIContainer } from "../RUIContainer";
import { RUIOrientation, RUIAuto } from "../RUIDefine";
import { RUIOverlay } from "./RUIOverlay";
import { RUILayoutData } from "../RUIObject";
import { RUIListView } from "./RUIListView";
import { RUIStyle } from "../RUIStyle";
import { RUIEventEmitter, RUIEvent } from "../RUIEvent";
import { RUIUtil } from "../RUIUtil";


export class RUIDropdowns extends RUIContainer{

    private m_button:RUIButton;
    private m_overlay:RUIDropdownsSelector;

    private m_options :string[];

    private m_value:string = null;

    public EventOnValueChange: RUIEventEmitter<string> = new RUIEventEmitter();

    public constructor(options:string[],selected:string = null){
        super(RUIOrientation.Vertical);

        if(selected == null){
            selected = '(select)';
        }
        this.m_value = null;

        let button = new RUIButton(selected,this.onButtonClick.bind(this));
        this.addChild(button);
        this.m_button = button;
        this.m_options = options;

        let overlay = new RUIDropdownsSelector(options);
        overlay.layer = 1;
        overlay.enable = false;
        overlay.top = RUIUtil.LINE_HEIGHT_DEFAULT;
        overlay.left =0;
        overlay.right = 0;

        overlay.EventOnSelect.on(this.onSelect.bind(this));

        this.addChild(overlay);
        this.m_overlay = overlay;
    }

    public get value():string{
        return this.m_value;
    }

    public set value(val:string){
        if(this.m_value == val) return;
        this.EventOnValueChange.emitRaw(val);
        this.m_value = val;
        this.m_button.label = val;
        this.m_button.setDirty();
    }

    private onSelect(value: RUIEvent<string>){
        this.value = value.object;
    }


    private onButtonClick(btn:RUIButton){
        let overlay = this.m_overlay;
        if(!overlay.enable){
            //adjust size
            //TODO
            overlay.enable = true;
            this._root.setActiveUI(overlay);
        }
    }
}

class RUIDropdownsSelector extends RUIOverlay{
    
    private m_listview:RUIListView;

    public EventOnSelect:RUIEventEmitter<string> = new RUIEventEmitter();

    public constructor(options:string[]){
        super();
        
        let self = this;

        this.boxBackground = RUIStyle.Default.background1;
        let listview = new RUIListView(options);
        listview.EventOnSelectChange.on((e)=>{
            self.EventOnSelect.emitRaw(e.object);
        })
        listview.boxBorder = RUIStyle.Default.primary;
        listview.boxSideExtens = true;
        this.m_listview = listview;
        this.addChild(listview);
    }


    public onInactive(){
        this.enable = false;
        this.setDirty();
    }
}