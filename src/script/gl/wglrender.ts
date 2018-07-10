import { RUIDrawCall } from "../rui/RUIDrawCall";
import { wglDrawCallBuffer } from "./wglDrawCallBuffer";
import { wglProgram } from "./wglProgram";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR } from "./wglShaderLib";
import { RUIFontTexture } from "../rui/RUIFontTexture";


const MAX_RECT_COUNT = 512;

export class WGLRender{
    
    private gl: WebGLRenderingContext;
    private m_drawcallBuffer :wglDrawCallBuffer|any = null;
    private m_indicesBuffer :WebGLBuffer = null;

    private m_programRect: wglProgram;

    private m_projectParam: number[] = [0,0,0,0];

    private constructor(wgl:WebGLRenderingContext){
        this.gl = wgl;
        RUIFontTexture.Init();

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
            idata.push(ic,ic+2,ic+1,ic,ic+3,ic+2);
            ic+=4;
        }
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(idata),gl.STATIC_DRAW);
        this.m_indicesBuffer = ibuffer;

        //shaders
        this.m_programRect = wglProgram.Craete(gl,GLSL_VERT_DEF,GLSL_FRAG_COLOR);

        //pipeline
        gl.disable(gl.DEPTH_TEST);
        //parameter
        this.m_projectParam = [2/800.0,2/600.0,0,0];

        gl.viewport(0,0,800.0,600.0);
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
        if(drawRectCount>0){

            gl.bindBuffer(gl.ARRAY_BUFFER,drawbuffer.vertexBufferRect);
            gl.vertexAttribPointer(this.m_programRect.AttrPos,2,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(this.m_programRect.AttrPos);

            //color
            gl.bindBuffer(gl.ARRAY_BUFFER,drawbuffer.colorBufferRect);
            gl.vertexAttribPointer(this.m_programRect.AttrColor,4,gl.FLOAT,true,0,0);
            gl.enableVertexAttribArray(this.m_programRect.AttrColor);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.m_indicesBuffer);

            gl.useProgram(this.m_programRect.Program);
            gl.uniform4fv(this.m_programRect.UniformProj,this.m_projectParam);
            
            gl.drawElements(gl.TRIANGLES,drawRectCount*6,gl.UNSIGNED_SHORT,0);
        }

        drawbuffer.isDirty = false;

    }
}