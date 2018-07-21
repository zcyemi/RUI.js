import { RUIDrawCall, DrawCmdType } from "../rui/RUIDrawCall";


const COLOR_ERROR:number[] = [1,0,1,1];

export class wglDrawCallBuffer {

    public vertexBufferRect: WebGLBuffer;
    public colorBufferRect: WebGLBuffer;
    public drawCountRect: number = 0;

    private m_drawcall: RUIDrawCall;

    public isDirty: boolean = true;



    constructor(gl: WebGLRenderingContext, drawcall: RUIDrawCall) {

        this.m_drawcall = drawcall;
        if (drawcall == null) return;

        let vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
        this.vertexBufferRect = vbuffer;

        let cbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,cbuffer);
        this.colorBufferRect = cbuffer;

    }

    public SyncBuffer(gl: WebGLRenderingContext) {

        this.isDirty = true;
        let drawcall: RUIDrawCall = this.m_drawcall;
        let drawlist = drawcall.drawList;

        
        if (drawlist.length == 0) {
            return;
        }
        else{
            let vertices = [];
            let colorary = [];

            let rectCount = 0;

            for (var i = 0; i < drawlist.length; i++) {
                let cmd = drawlist[i];
                let rect = cmd.Rect;
                let color = cmd.Color;

                switch(cmd.type){
                    case DrawCmdType.rect:
                    if(color == null) color = COLOR_ERROR;
                    let r = color[0];
                    let g = color[1];
                    let b = color[2];
                    let a = color[3];
                    colorary.push(r,g,b,a);
                    colorary.push(r,g,b,a);
                    colorary.push(r,g,b,a);
                    colorary.push(r,g,b,a);
                    
                    let x =rect[0];
                    let y = rect[1];
                    let w = rect[2];
                    let h =rect[3];
                    vertices.push(x,y,x+w,y,x+w,y+h,x,y+h);
                    rectCount++;

                    break;
                    case DrawCmdType.text:

                    break;
                }
                
            }


            this.drawCountRect = rectCount;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER,this.colorBufferRect);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colorary),gl.STATIC_DRAW);

            console.log('sync vertex buffer');
        }
    }
}