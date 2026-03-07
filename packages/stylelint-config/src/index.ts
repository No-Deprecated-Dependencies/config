import type { Config } from 'stylelint'

export default {
    extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recess-order'],
    plugins: ['stylelint-order'],
} satisfies Config
