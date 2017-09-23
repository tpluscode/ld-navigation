// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

const pkg = require('./package');

export default {
    name: pkg.name,
    input: 'src/index.ts',
    output: {
        format: 'umd',
        file: pkg.main,
        sourcemap: true,
    },
    plugins: [
        typescript({
            typescript: require('typescript'), // use local version
            outDir: 'dist',
            rootDir: './',
            module: 'es6',
            target: 'es6',
            declaration: false,
            removeComments: true,
            lib: [
                'dom',
                'es6'
            ],
            exclude: [
                "node_modules",
                "wwwroot/lib",
                "bower_components"
            ]
        }),
        nodeResolve({
            module: true,
            jsnext: true,
            browser: true,
            extensions: [ '.js', '.json' ],
            preferBuiltins: false
        })
    ]
};
