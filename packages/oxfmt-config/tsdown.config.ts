import { defineConfig } from 'tsdown'

export default defineConfig({
    clean: true,
    entry: './src/index.ts',
    fixedExtension: false,
    format: 'es',
    minify: false,
    outDir: 'dist',
    target: 'esnext',
    unbundle: true,
})
