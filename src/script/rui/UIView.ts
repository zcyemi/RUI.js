import { UIObject } from "./UIObject";


export class UIView extends UIObject{

    public padding: number | number[];
    public margin: number | number[];
    public width: number = 50;
    public height :number =23;

    public backgroundColor: number[];
    public color: number[];

}