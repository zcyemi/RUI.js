
export class UILayout {

    public padding: number | number[];
    public margin: number | number[];
    public width: number = 50;
    public height :number =23;

    public isDirty: boolean = false;
    private m_rect :number[] = [0,0,50,23];


    public get rect():number[]{
        if(this.isDirty){
            this.m_rect = [0,0,this.width,this.height];
            this.isDirty =false;
        }
        return this.m_rect;
    }
}