
export type RUIInitConfig = {
    fontPath?: string,
    fontSize?: number,
}


export var RUI_CONFIG: RUIInitConfig;



export function RUIInitContext(config:RUIInitConfig){
    RUI_CONFIG = config;
}

