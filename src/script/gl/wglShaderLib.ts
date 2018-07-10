export const GLSL_FRAG_COLOR =  'precision lowp float;\n\nvoid main(){\ngl_FragColor = vec4(0.5,0.5,0.5,1.0);\n}';  
export const GLSL_VERT_DEF = 'precision mediump float;\nattribute vec2 aPosition;\n\nuniform vec4 uProj;\n\nvoid main(){\nvec2 pos = aPosition * uProj.xy;\npos.y = 2.0 - pos.y;\npos.xy -=1.0;\ngl_Position = vec4(pos,0,1);\n}'; 
