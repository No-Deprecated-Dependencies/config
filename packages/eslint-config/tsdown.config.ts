import { defineConfig } from 'tsdown'

export default defineConfig([
    {
        entry: './src/index.ts',
        outDir: 'dist',
    },
    {
        entry: './src/cli/index.ts',
        outDir: 'bin',
    },
])
