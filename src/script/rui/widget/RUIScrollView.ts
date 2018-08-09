import { RUIContainer, RUIContainerClipType } from "../RUIContainer";
import { RUIPosition, RUIObject } from "../RUIObject";


export enum RUIScrollType{
    Enabled,
    Disabled,
    Always
}

export class RUIScrollView extends RUIContainer{

    public scrollVertical: RUIScrollType;
    public scrollHorizontal :RUIScrollType;

    private m_content: RUIContainer;

    public constructor(scrollVertical: RUIScrollType =RUIScrollType.Enabled,scrollHorizontal: RUIScrollType = RUIScrollType.Enabled){
        super();

        this.scrollHorizontal = scrollHorizontal;
        this.scrollVertical = scrollVertical;


        let content = new RUIContainer();
        content.position = RUIPosition.Offset;
        super.addChild(content);

        this.m_content = content;
    }

    public addChild(ui:RUIObject){

        this.m_content.addChild(ui);
    }

    public removeChild(ui:RUIObject){
        this.m_content.removeChild(ui);
    }
}