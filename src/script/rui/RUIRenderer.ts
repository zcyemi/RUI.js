import { RUICanvas } from "./RUICanvas";
import { RUIDrawCall } from "./RUIDrawCall";
import { GLContext, GLProgram } from "wglut";
import { RUIDrawCallBuffer } from "./RUIDrawCallBuffer";
import { RUIFontTexture } from "./RUIFontTexture";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR } from "../gl/wglShaderLib";


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

        RUIFontTexture.Init(this.glctx);
        this.SetupGL();
        
    }

    public isValid():boolean{
        return true;
    }

    private SetupGL(){

        let gl = this.gl;
        if(gl == null) return;

        let glctx = this.glctx;


        //shaders
        

        //pipeline
        gl.disable(gl.DEPTH_TEST);
        //parameter
        this.m_projectParam = [2/800.0,2/600.0,0,0];

        gl.viewport(0,0,800.0,600.0);
    }

    public Draw(drawcall:RUIDrawCall){
        if(drawcall == null) return;
        if(this.m_drawcallBuffer == null){
            this.m_drawcallBuffer = new RUIDrawCallBuffer(this.glctx,drawcall);
        }

        if(drawcall.isDirty){
            this.m_drawcallBuffer.SyncBuffer(this.gl);
            drawcall.isDirty = false;
        }

        //do draw
        let drawbuffer:RUIDrawCallBuffer = this.m_drawcallBuffer;
        
        if(!drawbuffer.isDirty) return;
        drawbuffer.isDirty = false;

        let gl = this.gl;

        gl.clearColor(0.95,0.95,0.95,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        

        //draw drawcall buffer
        let drawRectCount = drawbuffer.drawCountRect;
        if(drawRectCount>0){
            let programRect : GLProgram |any = drawbuffer.programRect;
            gl.useProgram(programRect.Program);
            gl.uniform4fv(programRect.uProj,this.m_projectParam);

            gl.bindVertexArray(this.m_drawcallBuffer.vaoRect);
            gl.drawElements(gl.TRIANGLES,drawRectCount*6,gl.UNSIGNED_SHORT,0);
        }

        let drawTextCount = drawbuffer.drawCountText;
        if(drawTextCount > 0){

            let fonttex = RUIFontTexture.ASIICTexture;



            if(fonttex.isTextureValid){
                let programText: GLProgram|any = drawbuffer.programText;
                gl.useProgram(programText.Program);
                gl.uniform4fv(programText.uProj,this.m_projectParam);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D,fonttex.m_glTexture);
                gl.uniform1i(programText.uSampler,0);

                gl.bindVertexArray(drawbuffer.vaoText);
                gl.drawElements(gl.TRIANGLES,drawTextCount *6, gl.UNSIGNED_SHORT,0)
            }
            else{
                drawbuffer.isDirty = true;
            }
        }

        

    }
}