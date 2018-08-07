import { RUIObject } from "./RUIObject";

export class RUIRoot{

    public root: RUIObject;

    public isdirty: boolean = false;

    public expandSize: boolean = false;

    public constructor(ui:RUIObject,expandSize:boolean = false){
        if(ui.parent != null) throw new Error("root ui must have no parent.");

        this.expandSize = expandSize;
        this.root = ui;
        ui._root = this;
    }

    public resizeRoot(width:number,height:number){
        this.isdirty =true;
        
        if(this.expandSize){
            this.root.width = width;
            this.root.height = height;
        }
        
    }
}
