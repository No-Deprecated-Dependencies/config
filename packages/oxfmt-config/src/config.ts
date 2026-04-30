import { defineConfig } from 'oxfmt'

const config = defineConfig({
    ignorePatterns: [
        '.agents/**',
        '.cursor/**',
        '.next/**',
        'AGENTS.md',
        'CLAUDE.md',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'skills-lock.json',
        'skills.json',
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
