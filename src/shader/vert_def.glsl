precision mediump float;
attribute vec2 aPosition;

uniform vec4 uProj;

void main(){
    vec2 pos = aPosition * uProj.xy;
    pos.y = 2.0 - pos.y;
    pos.xy -=1.0;
    gl_Position = vec4(pos,0,1);
}