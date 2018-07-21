import { RUICanvas } from "./RUICanvas";
import { RUIDrawCall } from "./RUIDrawCall";
import { GLContext, GLProgram } from "wglut";
import { RUIDrawCallBuffer } from "./RUIDrawCallBuffer";
import { RUIFontTexture } from "./RUIFontTexture";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR } from "../gl/wglShaderLib";

const MAX_RECT_COUNT = 512;

export class RUIRenderer{

    private gl:WebGL2RenderingContext;
    private glctx: GLContext;

    private m_drawcallBuffer :RUIDrawCallBuffer|any = null;
    private m_indicesBuffer :WebGLBuffer = null;
    private m_projectParam: number[] = [0,0,0,0];

    private m_programRect: GLProgram | any;

    private m_isvalid :boolean = false;


    public constructor(uicanvas: RUICanvas){
        this.glctx = GLContext.createFromCanvas(uicanvas.canvas);

        if(!this.glctx){
            return;
        }

        this.m_isvalid =true;
        this.gl = this.glctx.gl;

        RUIFontTexture.Init(this.gl);
        this.SetupGL();
        
    }

    public isValid():boolean{
        return true;
    }

    private SetupGL(){

        let gl = this.gl;
        if(gl == null) return;

        let glctx = this.glctx;

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
        this.m_programRect = glctx.createProgram(GLSL_VERT_DEF,GLSL_FRAG_COLOR);
        console.log(this.m_programRect);

        //pipeline
        gl.disable(gl.DEPTH_TEST);
        //parameter
        this.m_projectParam = [2/800.0,2/600.0,0,0];

        gl.viewport(0,0,800.0,600.0);
    }

    public Draw(drawcall:RUIDrawCall){
        if(drawcall == null) return;
        if(this.m_drawcallBuffer == null){
            this.m_drawcallBuffer = new RUIDrawCallBuffer(this.gl,drawcall);
        }

        if(drawcall.isDirty){
            this.m_drawcallBuffer.SyncBuffer(this.gl);
            drawcall.isDirty = false;
        }

        //do draw
        let drawbuffer:RUIDrawCallBuffer = this.m_drawcallBuffer;
        
        if(!drawbuffer.isDirty) return;

        let gl = this.gl;

        gl.clearColor(0.95,0.95,0.95,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        

        //draw drawcall buffer
        let drawRectCount = drawbuffer.drawCountRect;
        if(drawRectCount>0){

            gl.bindBuffer(gl.ARRAY_BUFFER,drawbuffer.vertexBufferRect);
            gl.vertexAttribPointer(this.m_programRect.aPosition,2,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(this.m_programRect.aPosition);

            //color
            gl.bindBuffer(gl.ARRAY_BUFFER,drawbuffer.colorBufferRect);
            gl.vertexAttribPointer(this.m_programRect.aColor,4,gl.FLOAT,true,0,0);
            gl.enableVertexAttribArray(this.m_programRect.aColor);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.m_indicesBuffer);
            gl.useProgram(this.m_programRect.Program);
            gl.uniform4fv(this.m_programRect.uProj,this.m_projectParam);
            gl.drawElements(gl.TRIANGLES,drawRectCount*6,gl.UNSIGNED_SHORT,0);
        }

        drawbuffer.isDirty = false;

    }
}