import { defineConfig } from 'oxfmt'

const config = defineConfig({
    printWidth: 120,
    proseWrap: 'always',
    quoteProps: 'consistent',
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    vueIndentScriptAndStyle: false,
})

export { config }
