import { type ConfigWithExtends, type ConfigWithExtendsArray, defineConfig } from '@eslint/config-helpers'
import js from '@eslint/js'
import globals from 'globals'

async function nddeps(
    options: {
        plugins?: {
            next?: boolean
            perfectionist?: boolean
            react?: boolean
            typescript?: boolean
            vue?: boolean
        }
        prepend?: ConfigWithExtendsArray
    } = {},
    ...userConfig: ConfigWithExtendsArray
): Promise<ConfigWithExtendsArray> {
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

    if (options.plugins?.typescript && !options.plugins?.next) {
        const typescript = await import('typescript-eslint')
        baseConfig.push(typescript.configs.recommended)
    }

    if (options.plugins?.react && !options.plugins?.next) {
        const react = await import('eslint-plugin-react')
        baseConfig.push(react.configs.flat.recommended as ConfigWithExtends)
    }

    if (options.plugins?.next) {
        const next = await import('eslint-config-next/core-web-vitals').then((m) => m.default)
        baseConfig.push(...next)
    }

    if (options.plugins?.next && options.plugins.typescript) {
        const nextTypescript = await import('eslint-config-next/typescript').then((m) => m.default)
        baseConfig.push(...nextTypescript)
    }

    if (options.plugins?.vue) {
        const vue = await import('eslint-plugin-vue')
        baseConfig.push(vue.configs['flat/recommended'])
    }

    if (options.plugins?.perfectionist) {
        const perfectionist = await import('eslint-plugin-perfectionist')
        baseConfig.push(perfectionist.configs['recommended-alphabetical'])
    }

    return defineConfig(baseConfig, userConfig)
}

export { nddeps }
