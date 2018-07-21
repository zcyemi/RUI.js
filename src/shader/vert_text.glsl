#version 300 es
precision mediump float;
in vec2 aPosition;
in vec4 aColor;
in vec2 aUV;
in vec4 aClip;

uniform vec4 uProj;
out vec4 vColor;
out vec2 vUV;

void main(){
    vec2 pos = aPosition * uProj.xy;
    pos.y = 2.0 - pos.y;
    pos.xy -=1.0;
    gl_Position = vec4(pos,0,1);
    vColor = aColor;
    vUV =aUV;
}