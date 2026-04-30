import type { ESLint } from 'eslint'

import { rule } from './oxfmt-rule'

const plugin: ESLint.Plugin = {
    rules: {
        oxfmt: rule,
    },
}

export { plugin }
