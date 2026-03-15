import type { Config } from 'prettier'

function nddeps(): Config {
    return {
        endOfLine: 'auto',
        printWidth: 120,
        proseWrap: 'always',
        semi: false,
        singleAttributePerLine: true,
        singleQuote: true,
        tabWidth: 4,
        trailingComma: 'all',
    }
}

export { nddeps }

export default nddeps()
