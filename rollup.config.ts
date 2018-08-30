import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from "rollup-plugin-terser";
import process from 'process';

const libraryName = 'rui';

var fileUMD = 'dist/rui.js';
var fileESM = 'dist/rui.es5.js';

if(process.env.TERSER === 'true'){
    fileUMD = 'dist/rui.min.js';
    fileESM = 'dist/rui.es5.min.js';
}

export default{
    input: `src/script/${libraryName}.ts`,
    output: [
        {file: fileUMD, name: camelCase(libraryName), format: 'umd',sourcemap: true}
    ],
    external: [],
    plugins: [
        typescript({useTsconfigDeclarationDir:true}),
        commonjs(),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        sourceMaps(),
        (process.env.TERSER === 'true' && terser())
    ]
}