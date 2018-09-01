import { RUIDOMCanvas } from "./RUIDOMCanvas";
import { RUIDrawCallBuffer } from "./RUIDrawCallBuffer";
import { RUIFontTexture } from "./RUIFontTexture";
import { RUIStyle } from "./RUIStyle";
import { RUICmdList } from "./RUICmdList";

import * as wglut from 'wglut';

type GLContext = wglut.GLContext;
type GLProgram = wglut.GLProgram;


export class RUIRenderer {

    private gl: WebGL2RenderingContext;
    private glctx: GLContext;

    private m_drawcallBuffer: RUIDrawCallBuffer = null;
    private m_projectParam: number[] = [0, 0, 0, 0];

    private m_programRect: GLProgram | any;

    private m_isvalid: boolean = false;

    private m_isResized: boolean = false;

    private m_uicanvas: RUIDOMCanvas;


    private m_needRedraw: boolean = false;

    private m_textureStorage: RUITextureStorage;


    public constructor(uicanvas: RUIDOMCanvas) {
        this.m_uicanvas = uicanvas;
        this.glctx = wglut.GLContext.createFromCanvas(uicanvas.canvas);
        this.m_textureStorage = new RUITextureStorage(this.glctx);

        if (!this.glctx) {
            return;
        }

        this.m_isvalid = true;
        this.gl = this.glctx.gl;

        var self = this;
        RUIFontTexture.EventOnTextureLoaded.on((ft) => {
            self.m_needRedraw = true;
        });
        RUIFontTexture.Init(this.glctx);
        this.SetupGL();

        let canvas = uicanvas.canvas;
        this.resizeCanvas(canvas.width,canvas.height);

    }

    public resizeCanvas(w: number, h: number) {
        let canvas = this.gl.canvas;
        if(canvas.width != w)canvas.width = w;
        if(canvas.height != h) canvas.height =h;

        this.m_uicanvas.setSize(w, h);

        this.m_projectParam = [2.0 / w, 2.0 / h, 0, 0];
        this.gl.viewport(0, 0, w, h);

        this.m_isResized = true;
    }

    public get isResized(): boolean {
        return this.m_isResized;
    }

    public get needRedraw(): boolean {
        return this.m_needRedraw;
    }

    public useResized() {
        this.m_isResized = false;
    }

    public isValid(): boolean {
        return true;
    }

    private SetupGL() {

        let gl = this.gl;
        if (gl == null) return;

        let glctx = this.glctx;

        //pipeline
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        //gl.blendFunc(gl.SRC_ALPHA,gl.ONE);    //overdraw test

        let clearColor = RUIStyle.Default.background1;
        gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);

    }

    public DrawCmdList(cmdlist: RUICmdList) {


        if (cmdlist == null) return;
        if (this.m_drawcallBuffer == null) {
            this.m_drawcallBuffer = new RUIDrawCallBuffer(this.glctx, cmdlist);
        }

        let fonttex = RUIFontTexture.ASIICTexture;


        if (cmdlist.isDirty || fonttex.isDirty) {
            this.m_drawcallBuffer.SyncBuffer(this.gl, this.m_textureStorage);
            cmdlist.isDirty = false;
            fonttex.isDirty = false;
        }

        //do draw
        let drawbuffer: RUIDrawCallBuffer = this.m_drawcallBuffer;

        if (!drawbuffer.isDirty) return;
        drawbuffer.isDirty = false;

        let gl = this.gl;


        gl.clear(gl.COLOR_BUFFER_BIT);





        //draw rect
        let drawRectCount = drawbuffer.drawCountRect;
        if (drawRectCount > 0) {
            let programRect: GLProgram | any = drawbuffer.programRect;
            gl.useProgram(programRect.Program);
            gl.uniform4fv(programRect.uProj, this.m_projectParam);

            gl.bindVertexArray(drawbuffer.vaoRect);
            gl.drawElements(gl.TRIANGLES, drawRectCount * 6, gl.UNSIGNED_SHORT, 0);
        }

        //draw text
        let drawTextCount = drawbuffer.drawCountText;
        if (drawTextCount > 0) {
            if (fonttex.isTextureValid) {

                let programText: GLProgram | any = drawbuffer.programText;
                gl.useProgram(programText.Program);
                gl.uniform4fv(programText.uProj, this.m_projectParam);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, fonttex.m_glTexture);
                gl.uniform1i(programText.uSampler, 0);

                gl.bindVertexArray(drawbuffer.vaoText);
                gl.drawElements(gl.TRIANGLES, drawTextCount * 6, gl.UNSIGNED_SHORT, 0)
            }
            else {
                console.log('texture not valid');
                drawbuffer.isDirty = true;
            }
        }

        //draw image
        let drawTextureData = drawbuffer.textureDrawData;
        if (drawTextureData.length > 0) {
            let programImage: GLProgram | any = drawbuffer.programImage;
            gl.useProgram(programImage.Program);
            gl.uniform4fv(programImage.uProj, this.m_projectParam);
            gl.bindVertexArray(drawbuffer.vaoImage);

            for (var i = 0, len = drawTextureData.length; i < len; i++) {
                let data = drawTextureData[i];

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                gl.uniform1i(programImage.uSampler, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.vertexBufferImage);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.data), gl.DYNAMIC_DRAW);

                gl.bindBuffer(gl.ARRAY_BUFFER, drawbuffer.uvBufferImage);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.uv), gl.DYNAMIC_DRAW);

                gl.drawElements(gl.TRIANGLES, data.count * 6, gl.UNSIGNED_SHORT, 0);
            }
        }

        this.m_needRedraw = false;
    }

}

export class RUITextureStorage {

    private m_glctx: wglut.GLContext;

    private m_map: { key: HTMLImageElement, value: WebGLTexture }[] = [];

    public constructor(glctx: wglut.GLContext) {
        this.m_glctx = glctx;
    }

    public getTexture(image: HTMLImageElement): WebGLTexture {

        let map = this.m_map;
        let tex: WebGLTexture = null;
        for (var i = 0, len = map.length; i < len; i++) {
            let pair = map[i];
            if (pair.key == image) {
                tex = pair.value;
                break;
            }
        }
        if (tex == null) {
            let gl = this.m_glctx.gl;
            tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);

            map.push({key:image,value:tex});
        }
        return tex;
    }
}