import { defineConfig } from 'oxfmt'

const config = defineConfig({
    ignorePatterns: [
        '**/*.json',
        '**/*.json5',
        '**/*.jsonc',
        '**/*.yaml',
        '**/*.yml',
        '.agents/**',
        '.cursor/**',
        '.next/**',
        'AGENTS.md',
        'CLAUDE.md',
        '!package.json',
    ],
    printWidth: 120,
    proseWrap: 'always',
    quoteProps: 'consistent',
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    sortPackageJson: {
        sortScripts: true,
    },
    sortTailwindcss: {
        functions: ['clsx', 'cn', 'twMerge'],
    },
    tabWidth: 4,
    trailingComma: 'all',
})

export { config }
