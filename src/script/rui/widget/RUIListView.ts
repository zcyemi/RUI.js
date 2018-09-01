import { RUIContainer } from './../RUIContainer';
import { RUIOrientation } from '../RUIDefine';
import { RUICmdList } from '../RUICmdList';
import { RUIUtil } from '../RUIUtil';
import { RUIStyle } from '../RUIStyle';
import { RUILabel } from './RUILabel';
import { RUIMouseEvent, RUIEventEmitter } from '../RUIEvent';

export class RUIListView extends RUIContainer{

    private m_list:string[];
    private m_labels: RUISelectableLabel[] = [];

    private m_selectedLabel:RUISelectableLabel = null;

    public EventOnSelectChange:RUIEventEmitter<string> = new RUIEventEmitter();

    public constructor(list:string[]){
        super();
        this.m_list= list;
        this.boxOrientation = RUIOrientation.Vertical;
        this.boxBorder = RUIStyle.Default.border0;
        this.padding = RUIUtil.Vector(1);

        var self = this;

        for(var i=0,len = list.length;i<len;i++){
            var label = new RUISelectableLabel(list[i],true);
            label.EventOnSelect.on((e)=>{
                self.onSelectChange(e.object);
            });
            this.m_labels.push(label);
            this.addChild(label);
        }
    }

    private onSelectChange(label:RUISelectableLabel){

        let selected = label.selected;
        if(selected){
            let cursel = this.m_selectedLabel;
            if(cursel !=label){
                if(cursel != null) cursel.selected =false;
                this.m_selectedLabel = label;
                this.EventOnSelectChange.emitRaw(this.m_selectedLabel.label);
            }
        }
        else{
            
        }
    }

}

class RUISelectableLabel extends RUILabel{

    private m_onhover:boolean =false;
    private m_onselect:boolean = false;

    public EventOnSelect: RUIEventEmitter<RUISelectableLabel> = new RUIEventEmitter();
    public constructor(label:string,autowidth:boolean = false){
        super(label,autowidth);
        this.responseToMouseEvent = true;
        this.m_fitTextWidth =false;
    }

    public get selected():boolean{
        return this.m_onselect;
    }
    public set selected(val:boolean){
        if(this.m_onselect != val){
            this.m_onselect = val;
            this.setDirty();
        }
    }

    public onMouseEnter(){
        this.m_onhover =true;
        this.setDirty();
    }

    public onMouseLeave(){
        this.m_onhover =false;
        this.setDirty();
    }

    public onMouseClick(e:RUIMouseEvent){
        this.m_onselect = !this.m_onselect;
        this.EventOnSelect.emitRaw(this);
        this.setDirty();
    }

    public onDraw(cmd:RUICmdList):boolean{
        let draw = super.onDraw(cmd);
        if(!draw) return false;

        if(this.m_onselect){
            cmd.DrawRectWithColor(this._rect,RUIStyle.Default.background0,this._drawClipRect);
        }
        else{
            if(this.m_onhover)
                cmd.DrawRectWithColor(this._rect,RUIStyle.Default.primary0,this._drawClipRect);
        }

        
        return true;
    }
}