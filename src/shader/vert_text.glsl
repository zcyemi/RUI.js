#version 300 es
precision mediump float;
in vec3 aPosition;
in vec4 aColor;
in vec2 aUV;
in vec4 aClip;

uniform vec4 uProj;
out vec4 vColor;
out vec2 vUV;

void main(){
    vec2 pos = aPosition.xy * uProj.xy;
    pos.y = 2.0 - pos.y;
    pos.xy -=1.0;
    gl_Position = vec4(pos,aPosition.z,1);
    vColor = aColor;
    vUV =aUV;
}