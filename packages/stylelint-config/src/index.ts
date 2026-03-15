import type { Config } from 'stylelint'

function nddeps(): Config {
    return {
        extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-recess-order'],
        plugins: ['stylelint-order'],
    }
}

export { nddeps }

export default nddeps()
