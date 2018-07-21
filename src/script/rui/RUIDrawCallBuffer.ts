import { RUIDrawCall, DrawCmdType } from "./RUIDrawCall";
import { GLProgram, GLContext } from "wglut";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR, GLSL_VERT_TEXT, GLSL_FRAG_TEXT } from "../gl/wglShaderLib";
import { RUIFontTexture } from "./RUIFontTexture";


const COLOR_ERROR: number[] = [1, 0, 1, 1];
const MAX_RECT_COUNT = 512;

export class RUIDrawCallBuffer {

    // v0 -- v1
    // |     |
    // v3 -- v2

    public vaoRect: WebGLVertexArrayObject;
    public vaoText: WebGLVertexArrayObject;

    public vertexBufferRect: WebGLBuffer;
    public colorBufferRect: WebGLBuffer;
    public drawCountRect: number = 0;

    public vertexBufferText: WebGLBuffer;
    public colorBufferText: WebGLBuffer;
    public uvBufferText: WebGLBuffer;
    public clipBufferText: WebGLBuffer;
    public drawCountText: number = 0;

    public indicesBuffer: WebGLBuffer;

    private m_drawcall: RUIDrawCall;

    public isDirty: boolean = true;

    public programRect: GLProgram;
    public programText: GLProgram;



    constructor(glctx: GLContext, drawcall: RUIDrawCall) {
        let gl = glctx.gl;
        this.m_drawcall = drawcall;
        if (drawcall == null) return;

        //Shaders
        this.programRect = glctx.createProgram(GLSL_VERT_DEF, GLSL_FRAG_COLOR);
        this.programText = glctx.createProgram(GLSL_VERT_TEXT, GLSL_FRAG_TEXT);


        //IndicesBuffer
        {
            let ibuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
            let idata: number[] = [];

            let ic = 0;
            for (var i = 0; i < MAX_RECT_COUNT; i++) {
                idata.push(ic, ic + 2, ic + 1, ic, ic + 3, ic + 2);
                ic += 4;
            }
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idata), gl.STATIC_DRAW);
            this.indicesBuffer = ibuffer;
        }

        //Rect
        {
            let program: GLProgram | any = this.programRect;
            let vao = gl.createVertexArray();
            this.vaoRect = vao;
            gl.bindVertexArray(vao);

            //position
            let vbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            this.vertexBufferRect = vbuffer;
            gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aPosition);

            //color
            let cbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
            this.colorBufferRect = cbuffer;
            gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(program.aColor);

            //indices buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

            gl.bindVertexArray(null);
        }

        //Text
        {

            let program: GLProgram | any = this.programText;
            let vao = gl.createVertexArray();
            this.vaoText = vao;
            gl.bindVertexArray(vao);

            //Position
            let vbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
            this.vertexBufferText = vbuffer;
            gl.vertexAttribPointer(program.aPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aPosition);

            //UV
            let uvbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
            this.uvBufferText = uvbuffer;
            gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(program.aUV);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

            gl.bindVertexArray(null);
        }

    }

    public SyncBuffer(gl: WebGL2RenderingContext) {


        this.isDirty = true;
        let drawcall: RUIDrawCall = this.m_drawcall;
        let drawlist = drawcall.drawList;

        let fonttex = RUIFontTexture.ASIICTexture;


        if (drawlist.length == 0) {
            return;
        }
        else {
            let rect_vert = [];
            let rect_color = [];

            let text_vert = [];
            let text_uv = [];

            let rectCount = 0;
            let textCount = 0;

            for (var i = 0,cmdlen = drawlist.length; i < cmdlen; i++) {
                let cmd = drawlist[i];
                let rect = cmd.Rect;
                let color = cmd.Color;

                switch (cmd.type) {
                    case DrawCmdType.rect:
                        {
                            if (color == null) color = COLOR_ERROR;
                            let r = color[0];
                            let g = color[1];
                            let b = color[2];
                            let a = color[3];
                            rect_color.push(r, g, b, a);
                            rect_color.push(r, g, b, a);
                            rect_color.push(r, g, b, a);
                            rect_color.push(r, g, b, a);

                            let x = rect[0];
                            let y = rect[1];
                            let w = rect[2];
                            let h = rect[3];
                            rect_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                            rectCount++;
                        }
                        break;
                    case DrawCmdType.text:
                        {
                            let content = cmd.Text;
                            if (content == null || content === '') break;

                            let x = rect[0];
                            let y = rect[1];
                            let w = rect[2];
                            let h = rect[3];

                            let contentW = fonttex.MeasureTextWith(content);

                            x += Math.max(3,Math.floor((w - contentW)/2.0));
                            y = y + h - (h - fonttex.fontSize);

                            for (var j = 0, len = content.length; j < len; j++) {

                                let glyph = fonttex.glyphs[content.charCodeAt(j)];
                                if (glyph == null) {
                                    // text_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                                    // text_uv.push(0, 0, 1, 0, 1, 1, 0, 1);
                                }
                                else {

                                    let drawy = y + glyph.offsetY;

                                    let drawy1 = drawy + glyph.height;
                                    let drawx1 = x + glyph.width;

                                    text_vert.push(x, drawy, drawx1, drawy, drawx1, drawy1, x, drawy1);
                                    text_uv = text_uv.concat(glyph.uv);

                                    x += glyph.width;
                                    textCount++;
                                }
                            }
                        }
                        break;
                        
                }

            }

            //Rect
            {
                this.drawCountRect = rectCount;

                if (rectCount != 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect_vert), gl.STATIC_DRAW);

                    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect_color), gl.STATIC_DRAW);
                }
            }

            //Text{
            this.drawCountText = textCount;
            if (textCount != 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferText);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_vert), gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferText);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(text_uv), gl.STATIC_DRAW);
            }
        }

    }
}