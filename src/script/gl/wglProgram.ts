

export class wglProgram{


    public Program: WebGLProgram;
    public Attribute: {[name:string]:number} ={};
    public Uniform:{[name:string]:WebGLUniformLocation} = {};


    public AttrPos :number;
    public AttrColor: number;
    public UniformProj:WebGLUniformLocation;


    constructor(program:WebGLProgram,gl:WebGLRenderingContext){
        this.Program =program;

        //reflect attribute

        const numAttrs = gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);
        for(let i=0;i<numAttrs;i++){
            const attrInfo = gl.getActiveAttrib(program,i);
            const attrLoca = gl.getAttribLocation(program,attrInfo.name);
            this.Attribute[attrInfo.name] = attrLoca;
        }

        const numUniforms = gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);
        for(let i=0;i< numUniforms;i++){
            const unifInfo = gl.getActiveUniform(program,i);
            const unifLoca = gl.getUniformLocation(program,unifInfo.name);
            this.Uniform[unifInfo.name] = unifLoca;
        }

        this.AttrPos = this.Attribute['aPosition'];
        this.AttrColor = this.Attribute['aColor'];

        this.UniformProj = this.Uniform['uProj'];

    }

    public static Craete(gl:WebGLRenderingContext,vs:string,ps:string){

        let shadervert = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shadervert,vs);
        gl.compileShader(shadervert);

        if(!gl.getShaderParameter(shadervert,gl.COMPILE_STATUS)){

            console.error('create vertex shader failed:'+ gl.getShaderInfoLog(shadervert));
            gl.deleteShader(shadervert);
            shadervert = null;
        }

        let shaderfrag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shaderfrag,ps);
        gl.compileShader(shaderfrag);

        if(!gl.getShaderParameter(shaderfrag,gl.COMPILE_STATUS)){

            console.error('create fragment shader failed:'+ gl.getShaderInfoLog(shadervert));
            gl.deleteShader(shaderfrag);
            shaderfrag = null;
        }

        if(shadervert == null || shaderfrag == null) return null;

        let program = gl.createProgram();
        gl.attachShader(program,shadervert);
        gl.attachShader(program,shaderfrag);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
            console.error('unable to link shader program: '+ gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            program = null;
        }

        if(program == null) return null;

        return new wglProgram(program,gl);
    }
}