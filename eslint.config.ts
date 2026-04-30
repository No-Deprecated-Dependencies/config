import { nddeps } from './packages/eslint-config/src/index.ts'

export default nddeps({
    plugins: {
        perfectionist: true,
        typescript: true,
        vue: true,
    },
})
