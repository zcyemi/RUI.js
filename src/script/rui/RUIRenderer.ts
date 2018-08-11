import { RUICanvas } from "./RUICanvas";
import { GLContext, GLProgram } from "wglut";
import { RUIDrawCallBuffer } from "./RUIDrawCallBuffer";
import { RUIFontTexture } from "./RUIFontTexture";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR } from "../gl/wglShaderLib";
import { RUIStyle } from "./RUIStyle";
import { RUICmdList } from "./RUICmdList";


export class RUIRenderer{

    private gl:WebGL2RenderingContext;
    private glctx: GLContext;

    private m_drawcallBuffer :RUIDrawCallBuffer|any = null;
    private m_indicesBuffer :WebGLBuffer = null;
    private m_projectParam: number[] = [0,0,0,0];

    private m_programRect: GLProgram | any;

    private m_isvalid :boolean = false;

    private m_isResized: boolean = false;

    private m_uicanvas:RUICanvas;


    private m_needRedraw: boolean = false;


    public constructor(uicanvas: RUICanvas){
        this.m_uicanvas = uicanvas;
        this.glctx = GLContext.createFromCanvas(uicanvas.canvas);

        

        if(!this.glctx){
            return;
        }

        this.m_isvalid =true;
        this.gl = this.glctx.gl;

        var self = this;
        RUIFontTexture.EventOnTextureLoaded.on((ft)=>{
            self.m_needRedraw = true;
        });
        RUIFontTexture.Init(this.glctx);
        this.SetupGL();

        let canvas = uicanvas.canvas;
        this.resizeCanvas(window.innerWidth,window.innerHeight);
        
    }

    public resizeCanvas(w:number,h:number){
        this.gl.canvas.width =w;
        this.gl.canvas.height = h;

        //this.m_uicanvas.setSize(w,h);

        this.m_projectParam = [2.0/w,2.0/h,0,0];
        this.gl.viewport(0,0,w,h);

        this.m_isResized = true;
    }

    public get isResized():boolean{
        return this.m_isResized;
    }

    public get needRedraw():boolean{
        return this.m_needRedraw;
    }

    public useResized(){
        this.m_isResized = false;
    }

    public isValid():boolean{
        return true;
    }

    private SetupGL(){

        let gl = this.gl;
        if(gl == null) return;

        let glctx = this.glctx;

        //pipeline
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);

        let clearColor = RUIStyle.Default.background0;
        gl.clearColor(clearColor[0],clearColor[1],clearColor[2],clearColor[3]);
    }

    public DrawCmdList(cmdlist:RUICmdList){

        
        if(cmdlist == null) return;
        if(this.m_drawcallBuffer == null){
            this.m_drawcallBuffer = new RUIDrawCallBuffer(this.glctx,cmdlist);
        }

        let fonttex = RUIFontTexture.ASIICTexture;


        if(cmdlist.isDirty ||fonttex.isDirty){
            this.m_drawcallBuffer.SyncBuffer(this.gl);
            cmdlist.isDirty = false;
            fonttex.isDirty= false;
        }

        //do draw
        let drawbuffer:RUIDrawCallBuffer = this.m_drawcallBuffer;
        
        if(!drawbuffer.isDirty) return;
        drawbuffer.isDirty = false;

        let gl = this.gl;

       
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
                console.log('texture not valid');
                drawbuffer.isDirty = true;
            }
        }
        this.m_needRedraw = false;

    }
    
}