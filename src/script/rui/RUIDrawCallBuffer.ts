import { GLProgram, GLContext } from "wglut";
import { GLSL_VERT_DEF, GLSL_FRAG_COLOR, GLSL_VERT_TEXT, GLSL_FRAG_TEXT, GLSL_VERT_IMAGE, GLSL_FRAG_IMAGE } from "../gl/wglShaderLib";
import { RUIFontTexture } from "./RUIFontTexture";
import { RUICmdList, RUIDrawCmdType } from "./RUICmdList";
import { RUI } from "./RUI";
import { RUITextureStorage } from "./RUIRenderer";


const COLOR_ERROR: number[] = [1, 0, 1, 1];
const MAX_RECT_COUNT = 512;


type TypedArray = ArrayLike<any> & {
    set(array: ArrayLike<any>, offset?: number): void;
}

type TypedArrayConstructor<T> = {
    new(): T;
    new(len: number): T;
}

class RUIArrayBuffer<T extends TypedArray>{
    public buffer: T;
    private m_size: number;
    public pos: number = 0;

    private m_tctor: { new(s: number): T };
    public constructor(TCtor: { new(s: number): T }, size: number = 512) {
        this.m_size = size;
        this.m_tctor = TCtor;
        this.buffer = new this.m_tctor(size);
    }

    public push(ary: number[]) {
        let len = ary.length;

        let newpos = this.pos + len;
        this.checkExten(newpos);
        this.buffer.set(ary, this.pos);
        this.pos = newpos;
    }

    public checkExten(size: number) {
        let cursize = this.m_size;
        if (size >= cursize) {
            let newbuffer = new this.m_tctor(cursize * 2);
            newbuffer.set(this.buffer, 0);
            this.buffer = newbuffer;
            this.m_size = cursize * 2;
        }
    }

    public resetPos(): RUIArrayBuffer<T> {
        this.pos = 0;
        return this;
    }
}

class RUIArrayBufferF32 extends RUIArrayBuffer<Float32Array>{ }
class RUIArrayBufferUI16 extends RUIArrayBuffer<Uint16Array>{ }

export class RUITextureDrawData {
    public texture: WebGLTexture;
    public data: number[]  =[];
    public uv:number[] = [];
    public count = 0;
}

export class RUIDrawCallBuffer {

    // v0 -- v1
    // |     |
    // v3 -- v2

    public vaoRect: WebGLVertexArrayObject;
    public vaoText: WebGLVertexArrayObject;
    public vaoImage: WebGLVertexArrayObject;

    public vertexBufferRect: WebGLBuffer;
    public colorBufferRect: WebGLBuffer;
    public clipBufferRect: WebGLBuffer;
    public drawCountRect: number = 0;

    public vertexBufferText: WebGLBuffer;
    public colorBufferText: WebGLBuffer;
    public uvBufferText: WebGLBuffer;
    public clipBufferText: WebGLBuffer;
    public drawCountText: number = 0;

    public vertexBufferImage:WebGLBuffer;
    public uvBufferImage: WebGLBuffer;

    public indicesBuffer: WebGLBuffer;

    private m_drawcall: RUICmdList;

    public isDirty: boolean = true;

    public programRect: GLProgram;
    public programText: GLProgram;
    public programImage:GLProgram;

    private m_indicesBufferArray: RUIArrayBufferUI16 = new RUIArrayBufferUI16(Uint16Array);

    private m_aryBufferRectColor: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);
    private m_aryBufferRectPos: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);
    private m_aryBufferRectClip: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);

    private m_aryBufferTextPos: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);
    private m_aryBufferTextUV: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);
    private m_aryBufferTextClip: RUIArrayBufferF32 = new RUIArrayBufferF32(Float32Array);

    public textureDrawData: RUITextureDrawData[] = [];


    constructor(glctx: GLContext, drawcall: RUICmdList) {
        let gl = glctx.gl;
        this.m_drawcall = drawcall;
        if (drawcall == null) return;

        //Shaders
        this.programRect = glctx.createProgram(GLSL_VERT_DEF, GLSL_FRAG_COLOR);
        this.programText = glctx.createProgram(GLSL_VERT_TEXT, GLSL_FRAG_TEXT);
        this.programImage = glctx.createProgram(GLSL_VERT_IMAGE,GLSL_FRAG_IMAGE);


        //IndicesBuffer
        {
            let ibuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuffer);
            let idata: RUIArrayBufferUI16 = this.m_indicesBufferArray;

            let ic = 0;
            for (var i = 0; i < MAX_RECT_COUNT; i++) {
                idata.push([ic, ic + 2, ic + 1, ic, ic + 3, ic + 2]);
                ic += 4;
            }
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idata.buffer, gl.STATIC_DRAW);
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
            gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aPosition);

            //color
            let cbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, cbuffer);
            this.colorBufferRect = cbuffer;
            gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(program.aColor);

            //clip
            let clipbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, clipbuffer);
            this.clipBufferRect = clipbuffer;
            gl.vertexAttribPointer(program.aClip, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aClip);


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
            gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aPosition);

            //Color
            gl.disableVertexAttribArray(program.aColor);


            //UV
            let uvbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
            this.uvBufferText = uvbuffer;
            gl.vertexAttribPointer(program.aUV, 2, gl.FLOAT, true, 0, 0);
            gl.enableVertexAttribArray(program.aUV);

            //Clip
            let clipbuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, clipbuffer);
            this.clipBufferText = clipbuffer;
            gl.vertexAttribPointer(program.aClip, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.aClip);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

            gl.bindVertexArray(null);
        }

        //Image
        {
            let program : GLProgram | any = this.programImage;
            let vao = gl.createVertexArray();
            this.vaoImage = vao;
            gl.bindVertexArray(vao);

            //position
            let vbuffer = gl.createBuffer();
            this.vertexBufferImage = vbuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER,vbuffer);
            gl.vertexAttribPointer(program.aPosition,3,gl.FLOAT,false,0,0);
            gl.enableVertexAttribArray(program.aPosition);

            //uv
            let uvbuffer =gl.createBuffer();
            this.uvBufferImage = uvbuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER,uvbuffer);
            gl.vertexAttribPointer(program.aUV,2,gl.FLOAT,true,0,0);
            gl.enableVertexAttribArray(program.aUV);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indicesBuffer);

            gl.bindVertexArray(null);
        }

    }

    public SyncBuffer(gl: WebGL2RenderingContext,textureStorage: RUITextureStorage) {


        this.isDirty = true;
        let drawcall: RUICmdList = this.m_drawcall;
        let drawlist = drawcall.drawList;

        let fonttex = RUIFontTexture.ASIICTexture;

        if (drawlist.length == 0) {
            return;
        }


        let textureDraw: RUITextureDrawData[] = [];
        this.textureDrawData = textureDraw;

        let drawDepthMax = drawcall.MaxDrawCount;

        let rect_vert = this.m_aryBufferRectPos.resetPos();
        let rect_color = this.m_aryBufferRectColor.resetPos();
        let rect_clip = this.m_aryBufferRectClip.resetPos();

        let text_vert = this.m_aryBufferTextPos.resetPos();
        let text_uv = this.m_aryBufferTextUV.resetPos();
        let text_clip = this.m_aryBufferTextClip.resetPos();

        let rectCount = 0;
        let textCount = 0;

        let maxClip = [0, 0, 2000, 1000];
        maxClip[2] = maxClip[0] + maxClip[2];
        maxClip[3] = maxClip[1] + maxClip[3];

        let cmdlen = drawlist.length;
        for (var i = cmdlen - 1; i >= 0; i--) {
            let cmd = drawlist[i];
            let rect = cmd.Rect;
            let color = cmd.Color;

            let d = 1.0 - cmd.Index * 1.0 / drawDepthMax;

            let clip = cmd.clip == null ? maxClip : cmd.clip;

            switch (cmd.type) {
                case RUIDrawCmdType.rect:
                    {
                        if (color == null) color = COLOR_ERROR;
                        rect_color.push(color);
                        rect_color.push(color);
                        rect_color.push(color);
                        rect_color.push(color);

                        let x = rect[0];
                        let y = rect[1];
                        let w = rect[2];
                        let h = rect[3];
                        rect_vert.push([x, y, d, x + w, y, d, x + w, y + h, d, x, y + h, d]);


                        rect_clip.push(clip);
                        rect_clip.push(clip);
                        rect_clip.push(clip);
                        rect_clip.push(clip);

                        rectCount++;
                    }
                    break;
                case RUIDrawCmdType.line:
                    {
                        if (color == null) color = RUI.GREY;

                        rect_color.push(color);
                        rect_color.push(color);
                        rect_color.push(color);
                        rect_color.push(color);

                        let x1 = rect[0];
                        let y1 = rect[1];
                        let x2 = rect[2];
                        let y2 = rect[3];

                        let dx = x2 - x1;
                        let dy = y2 - y1;

                        let len = Math.sqrt(dx * dx + dy * dy) * 2;

                        dx = dx / len;
                        dy = dy / len;

                        rect_vert.push([x1 + dx, y1 + dy, d, x2 + dx, y2 + dy, d, x2 - dx, y2 - dy, d, x1 - dx, y1 - dy, d]);

                        rect_clip.push(clip);
                        rect_clip.push(clip);
                        rect_clip.push(clip);
                        rect_clip.push(clip);

                        rectCount++;
                    }
                    break;
                case RUIDrawCmdType.border:
                    {
                        if (color == null) color = COLOR_ERROR;

                        for (let n = 0; n < 16; n++) {
                            rect_color.push(color);
                            rect_clip.push(clip);
                        }

                        let x1 = rect[0];
                        let y1 = rect[1];
                        let x2 = x1 + rect[2];
                        let y2 = y1 + rect[3];
                        rect_vert.push([x1, y1, d, x2, y1, d, x2, y1 + 1, d, x1, y1 + 1, d]);
                        rect_vert.push([x2 - 1, y1, d, x2, y1, d, x2, y2, d, x2 - 1, y2, d]);
                        rect_vert.push([x1, y2 - 1, d, x2, y2 - 1, d, x2, y2, d, x1, y2, d]);
                        rect_vert.push([x1, y1, d, x1 + 1, y1, d, x1 + 1, y2, d, x1, y2, d]);

                        rectCount += 4;
                    }
                    break;
                case RUIDrawCmdType.text:
                    {
                        let content = cmd.Text;
                        if (content == null || content === '') break;

                        let x = rect[0];
                        let y = rect[1];
                        let w = rect[2];
                        let h = rect[3];


                        //clip = cmd.Rect;
                        // clip[2]+= clip[0];
                        // clip[3]+=clip[1];

                        let contentW = fonttex.MeasureTextWith(content);

                        x += Math.max(3, Math.floor((w - contentW) / 2.0));
                        y = y + fonttex.fontSize;

                        for (var j = 0, len = content.length; j < len; j++) {

                            let glyph = fonttex.glyphs[content.charCodeAt(j)];
                            if (glyph == null) {
                                // text_vert.push(x, y, x + w, y, x + w, y + h, x, y + h);
                                // text_uv.push(0, 0, 1, 0, 1, 1, 0, 1);
                                x += 8;
                            }
                            else {

                                let drawy = y - glyph.offsetY;

                                let drawy1 = drawy + glyph.height;
                                let drawx1 = x + glyph.width;

                                text_vert.push([x, drawy, d, drawx1, drawy, d, drawx1, drawy1, d, x, drawy1, d]);
                                text_uv.push(glyph.uv);

                                text_clip.push(clip);
                                text_clip.push(clip);
                                text_clip.push(clip);
                                text_clip.push(clip);

                                x += glyph.width + 1;
                                textCount++;
                            }
                        }
                    }
                    break;
                case RUIDrawCmdType.image:
                    {
                        let image = <HTMLImageElement>cmd.object;
                        let tex = textureStorage.getTexture(image);

                        let drawData:RUITextureDrawData;
                        for(var j=0,len= textureDraw.length;j<len;j++){
                            let tempdrawdata = textureDraw[j];
                            if(tempdrawdata.texture == tex){
                                drawData = tempdrawdata;
                                break;
                            }
                        }

                        if(drawData ==null){
                            drawData = new RUITextureDrawData();
                            drawData.texture = tex;
                            textureDraw.push(drawData);
                        }

                        let rect = cmd.Rect;

                        let x =rect[0];
                        let y = rect[1];
                        let x1 = x+ rect[2];
                        let y1 = y + rect[3];
                        drawData.data.push(x,y,d,x1,y,d,x1,y1,d,x,y1,d);
                        drawData.uv.push(0,0,1,0,1,1,0,1);
                        drawData.count ++;

                    }
                    break;
            }
        }

        //Rect
        {
            this.drawCountRect = rectCount;

            if (rectCount != 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferRect);
                gl.bufferData(gl.ARRAY_BUFFER, rect_vert.buffer, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufferRect);
                gl.bufferData(gl.ARRAY_BUFFER, rect_color.buffer, gl.STATIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.clipBufferRect);
                gl.bufferData(gl.ARRAY_BUFFER, rect_clip.buffer, gl.STATIC_DRAW);

            }
        }

        //Text{
        this.drawCountText = textCount;
        if (textCount != 0) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferText);
            gl.bufferData(gl.ARRAY_BUFFER, text_vert.buffer, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBufferText);
            gl.bufferData(gl.ARRAY_BUFFER, text_uv.buffer, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.clipBufferText);
            gl.bufferData(gl.ARRAY_BUFFER, text_clip.buffer, gl.STATIC_DRAW);
        }

    }
}