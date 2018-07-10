import { RUIDrawCall } from "../rui/RUIDrawCall";

export class wglDrawCallBuffer {

    public vertexBufferRect: WebGLBuffer;
    public drawCountRect: number = 0;

    private m_drawcall: RUIDrawCall;

    public isDirty: boolean = true;


    constructor(gl: WebGLRenderingContext, drawcall: RUIDrawCall) {

        this.m_drawcall = drawcall;
        if (drawcall == null) return;

        let vbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);

        this.vertexBufferRect = vbuffer;


    }

    public SyncBuffer(gl: WebGLRenderingContext) {

        this.isDirty = true;
        let drawcall: RUIDrawCall = this.m_drawcall;
        let drawlist = drawcall.drawList;

        this.drawCountRect =drawlist.length;
        if (drawlist.length == 0) {
            return;
        }
        else{
            let vertices = [];
            for (var i = 0; i < drawlist.length; i++) {
                let cmd = drawlist[i];
                let rect = cmd.Rect;
                
                let x =rect[0];
                let y = rect[1];
                let w = rect[2];
                let h =rect[3];
                vertices.push(x,y,x+w,y,x+w,y+h,x,y+h);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

            console.log('sync vertex buffer');
        }
    }
}