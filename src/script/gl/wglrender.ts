import { RUIDrawCall } from "../rui/RUIDrawCall";
import { wglDrawCallBuffer } from "./wglDrawCallBuffer";


const MAX_RECT_COUNT = 512;

export class WGLRender{
    
    private gl: WebGLRenderingContext;
    private m_drawcallBuffer :wglDrawCallBuffer|any = null;
    private m_indicesBuffer :WebGLBuffer = null;

    private constructor(wgl:WebGLRenderingContext){
        this.gl = wgl;

        this.SetupWGL();
    }

    public static InitWidthCanvas(canvas: HTMLCanvasElement): WGLRender{

        let wgl = canvas.getContext('webgl');
        if(wgl == null){
            throw new Error('get webgl context failed!');
        }

        let wglrender = new WGLRender(wgl);
        return wglrender;
    }
    public static InitWidthWGL(wgl:WebGLRenderingContext) :WGLRender{

        let wglrender = new WGLRender(wgl);
        return wglrender;
    }

    private SetupWGL(){
        let gl = this.gl;
        if(gl == null) return;

        //indices buffer
        let ibuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibuffer);
        let idata:number[] = [];

        let ic = 0;
        for(var i=0;i< MAX_RECT_COUNT;i++){
            idata.push(ic,ic+1,ic+2,ic,ic+2,ic+3);
            ic+=4;
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idata),gl.STATIC_DRAW);
        this.m_indicesBuffer = ibuffer;

        //shaders

    }

    public Draw(drawcall :RUIDrawCall){
        if(drawcall == null) return;
        if(this.m_drawcallBuffer == null){
            this.m_drawcallBuffer = new wglDrawCallBuffer(this.gl,drawcall);
        }

        if(drawcall.isDirty){
            this.m_drawcallBuffer.SyncBuffer(this.gl);
            drawcall.isDirty = false;
        }

        //do draw

        let drawbuffer:wglDrawCallBuffer = this.m_drawcallBuffer;
        
        if(!drawbuffer.isDirty) return;

        let gl = this.gl;
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //draw drawcall buffer
        let drawRectCount = drawbuffer.drawCountRect;

        drawbuffer.isDirty = false;

    }
}