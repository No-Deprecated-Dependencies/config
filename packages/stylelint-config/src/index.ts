import type { Config } from 'stylelint'

const config: Config = {
    extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recess-order'],
    plugins: ['stylelint-order'],
}

export { config }
