import { nddeps } from './packages/eslint-config/src/index.ts'

export default nddeps({
    plugins: {
        next: true,
        perfectionist: true,
        typescript: true,
    },
})
