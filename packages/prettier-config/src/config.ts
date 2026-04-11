import type { Config } from 'prettier'

const config: Config = {
    endOfLine: 'auto',
    printWidth: 120,
    proseWrap: 'always',
    quoteProps: 'consistent',
    semi: false,
    singleAttributePerLine: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    vueIndentScriptAndStyle: false,
}

export { config }
