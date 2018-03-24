const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCommonJS = require('rollup-plugin-commonjs');
const rollupPluginNodeBuiltins = require('rollup-plugin-node-builtins');
const rollupPluginNodeGlobals = require('rollup-plugin-node-globals');

export default {
    input: 'node_modules/jsverify/lib/jsverify.js',
    output: {
        file: 'jsverify.js',
        format:'es'
    },
    plugins: [
        rollupPluginNodeResolve({
            preferBuiltins: false,
            browser: true
        }),
        rollupPluginCommonJS(),
        rollupPluginNodeBuiltins(),
        rollupPluginNodeGlobals()
    ]
}
