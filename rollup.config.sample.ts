import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from "rollup-plugin-terser";


export default{
    input: "sample/src/sample.ts",
    output: [
        {file: "sample/dist/rui.sample.js",name: 'ruisample',format: 'umd',sourcemap:true}
    ],
    plugins: [
        typescript(),
        commonjs(),
        resolve({
            jsnext:true,
            extensions: ['.ts','.js']
        }),
        sourceMaps(),
        terser()
    ]
}