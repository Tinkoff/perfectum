import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'; 
import packageJsonConfig from './package.json';

export default {
    input: 'lib/transpiled/index.js',
    plugins: [
        resolve(),
        sourcemaps(),
        sizeSnapshot({ printInfo: false }),
        terser()
    ],
    output: [
        { file: packageJsonConfig.main, name: 'PerfectumClient', format: 'cjs', sourcemap: true },
        { file: packageJsonConfig.iife, name: 'PerfectumClient', format: 'iife', sourcemap: true },
        { file: packageJsonConfig.module, name: 'PerfectumClient', format: 'es', sourcemap: true }
    ]
}
