precision mediump float;
attribute vec3 aPosition;
attribute vec4 aColor;

uniform vec4 uProj;
varying vec4 vColor;

void main(){
    vec2 pos = aPosition.xy * uProj.xy;
    pos.y = 2.0 - pos.y;
    pos.xy -=1.0;
    gl_Position = vec4(pos,aPosition.z,1);
    vColor = aColor;
}