import { UIObject } from "./UIObject";



export class DrawCmd{

    public Rect:number[] = [];
}



export class RUIDrawCall{


    public drawList:DrawCmd[] = [];

    public isDirty: boolean = true;

    constructor(){

    }

    public Rebuild(ui:UIObject){

        console.log('rebuild');
        let cmd =new DrawCmd();
        cmd.Rect = [0,0,100,100];

        this.drawList = [cmd];

        ui.isDirty =false;
    }

    
}