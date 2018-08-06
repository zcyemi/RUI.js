import { RUIObject } from "./RUIObject";

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = true;

    public constructor(ui:RUIObject){
        if(ui.parent != null) throw new Error("root ui must have no parent.");

        this.root = ui;
        ui._root = this;
    }

    public resizeRoot(width:number,height:number){
        this.isdirty =true;
        this.root.width = width;
        this.root.height = height;
    }
}
