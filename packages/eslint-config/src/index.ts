import { type ConfigWithExtendsArray, defineConfig } from '@eslint/config-helpers'
import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

function nddeps(
    options: {
        plugins?: {
            perfectionist?: boolean
            react?: boolean
            typescript?: boolean
        }
        prepend?: ConfigWithExtendsArray
    } = {},
    ...userConfig: ConfigWithExtendsArray
): ConfigWithExtendsArray {
    const baseConfig: ConfigWithExtendsArray = [
        ...(options.prepend ?? []),
        {
            extends: ['js/recommended'],
            files: ['**/*.{astro,cjs,cts,js,jsx,mjs,mts,ts,tsx,vue}'],
            languageOptions: {
                globals: {
                    ...globals.browser,
                    ...globals.node,
                },
            },
            plugins: {
                js,
            },
        },
    ]

    if (options.plugins?.typescript) {
        baseConfig.push(tseslint.configs.recommended)
    }

    if (options.plugins?.react) {
        baseConfig.push({
            files: ['**/*.{jsx,tsx}'],
            ...react.configs.flat.recommended,
        })
    }

    if (options.plugins?.perfectionist) {
        baseConfig.push(perfectionist.configs['recommended-alphabetical'])
    }

    return defineConfig([...baseConfig, ...userConfig])
}

export { nddeps }

export default nddeps
