import { defineConfig } from 'tsdown'

export default defineConfig({
    clean: true,
    entry: './src/index.ts',
    format: 'es',
    minify: false,
    outDir: 'dist',
    target: 'esnext',
    unbundle: true,
})
