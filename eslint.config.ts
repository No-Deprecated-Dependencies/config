import { nddeps } from './packages/eslint-config/src/index.ts'

export default nddeps({
    plugins: {
        json: true,
        perfectionist: true,
        typescript: true,
        vue: true,
        yaml: true,
    },
})
