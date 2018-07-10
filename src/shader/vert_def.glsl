precision mediump float;
attribute vec2 aPosition;

void main(){
    vec4 pos = vec4(aPosition,0,1);
    gl_Position = pos;
}