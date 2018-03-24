const rollupPluginCommonJS = require('rollup-plugin-commonjs');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginNodeBuiltins = require('rollup-plugin-node-builtins');
const rollupPluginNodeGlobals = require('rollup-plugin-node-globals');

export default {
    input: 'node_modules/jsverify/lib/jsverify.js',
    output: {
        file: 'jsverify.js',
        format:'es'
    },
    plugins: [
        rollupPluginNodeBuiltins(),
        rollupPluginNodeGlobals(),
        rollupPluginNodeResolve({
            preferBuiltins: false,
            browser: true
        }),
        rollupPluginCommonJS()
    ]
}
