export const GLSL_FRAG_COLOR =  'precision lowp float;\n\nvoid main(){\ngl_FragColor = vec4(0.5,0.5,0.5,1.0);\n}';  
export const GLSL_VERT_DEF = 'precision mediump float;\nattribute vec2 aPosition;\n\nvoid main(){\nvec4 pos = vec4(aPosition,0,1);\ngl_Position = pos;\n}'; 
