import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const isProduction = process.env.NODE_ENV === 'production';

const baseConfig = {
    input: 'src/index.ts',
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: false,
            exportConditions: ['browser', 'module', 'import', 'default']
        }),
        commonjs({
            include: ['node_modules/**']
        }),
        json(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: './dist/types',
            rootDir: './src'
        })
    ],
    external: [
        // Keep AI models external for lazy loading
        '@xenova/transformers'
    ],
    onwarn: (warning, warn) => {
        // Suppress circular dependency warnings for known safe cases
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
            return;
        }
        warn(warning);
    }
};

const configs = [
    // ESM build
    {
        ...baseConfig,
        output: {
            file: 'dist/mathrok.esm.js',
            format: 'es',
            sourcemap: true,
            exports: 'named'
        },
        plugins: [
            ...baseConfig.plugins,
            ...(isProduction ? [terser({
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.debug']
                },
                mangle: {
                    reserved: ['Mathrok']
                }
            })] : [])
        ]
    },

    // CommonJS build
    {
        ...baseConfig,
        output: {
            file: 'dist/mathrok.cjs.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        plugins: [
            ...baseConfig.plugins,
            ...(isProduction ? [terser({
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.debug']
                },
                mangle: {
                    reserved: ['Mathrok']
                }
            })] : [])
        ]
    },

    // UMD build for browsers
    {
        ...baseConfig,
        output: {
            file: 'dist/mathrok.umd.js',
            format: 'umd',
            name: 'Mathrok',
            sourcemap: true,
            exports: 'named',
            globals: {
                '@xenova/transformers': 'Transformers'
            }
        },
        plugins: [
            ...baseConfig.plugins,
            ...(isProduction ? [terser({
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.log', 'console.debug']
                },
                mangle: {
                    reserved: ['Mathrok']
                }
            })] : [])
        ]
    }
];

export default configs;