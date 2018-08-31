export class RUIConst{
    public static readonly TOP:number = 0;
    public static readonly RIGHT:number = 1;
    public static readonly BOTTOM:number = 2;
    public static readonly LEFT: number = 3;
}

export const RUIAuto: number= -Infinity;

export type RUIRect = number[];
export type RUIRectP = number[];
export const RUICLIP_MAX = [0,0,5000,5000];
export const RUICLIP_NULL = null;


export enum RUIPosition{
    Default = 0,
    Relative = 1,
    Absolute = 2,
    Offset = 3
}

export enum RUIBoxFlow{
    Flow,
    Flex
}

export enum RUIOverflow{
    Clip,
    Scroll
}

export enum RUIOrientation{
    Vertical,
    Horizontal
}