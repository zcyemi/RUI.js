import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json');
const libraryName = 'rui';

export default{
    input: `src/script/${libraryName}.ts`,
    output: [
        {file: pkg.main, name: camelCase(libraryName), format: 'umd',sourcemap: true},
        {file:pkg.module,format: 'es',sourcemap:true}
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
        terser(),
    ]
}