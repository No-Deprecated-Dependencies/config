import {
    type ConfigWithExtends,
    type ConfigWithExtendsArray,
    defineConfig,
    globalIgnores,
} from '@eslint/config-helpers'
import js from '@eslint/js'
import globals from 'globals'
import typescript from 'typescript-eslint'

type Options = {
    extends?: ConfigWithExtendsArray
    ignores?: string[]
    plugins?: {
        /**
         * @description Enable JSON plugin
         */
        json?: boolean
        /**
         * @description Enable Next.js plugin
         */
        next?: boolean
        /**
         * @description Enable Perfectionist plugin
         */
        perfectionist?: boolean
        /**
         * @description Enable React plugin
         */
        react?: boolean
        /**
         * @description Enable TypeScript plugin
         */
        typescript?: boolean
        /**
         * @description Enable Vue plugin
         */
        vue?: boolean
        /**
         * @description Enable YAML plugin
         */
        yaml?: boolean
    }
}

async function createConfig(options: Options = {}) {
    const baseConfig: ConfigWithExtendsArray = [
        {
            files: ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx,vue}'],
        },
        {
            extends: [js.configs.recommended],
            languageOptions: {
                globals: {
                    ...globals.browser,
                    ...globals.node,
                },
            },
        },
        globalIgnores(
            [
                '**/.cache',
                '**/.next',
                '**/.nuxt',
                '**/.turbo',
                '**/*-lock.json',
                '**/*-lock.yaml',
                '**/dist',
                '**/node_modules',
                '**/package.json',
            ].concat(options.ignores ?? []),
        ),
    ]

    if (options.plugins?.typescript) {
        baseConfig.push(typescript.configs.recommended)
    }

    if (options.plugins?.react) {
        const [react, reactHooks] = await Promise.all([
            interopDefault(import('eslint-plugin-react')),
            interopDefault(import('eslint-plugin-react-hooks')),
        ])
        baseConfig.push(
            react.configs.flat.recommended as ConfigWithExtends,
            react.configs.flat['jsx-runtime'] as ConfigWithExtends,
            reactHooks.configs.flat.recommended,
            {
                rules: {
                    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
                    'react/jsx-sort-props': 'off',
                },
            },
        )
    }

    if (options.plugins?.next) {
        const plugin = await interopDefault(import('@next/eslint-plugin-next'))
        baseConfig.push(plugin.configs['core-web-vitals'])
    }

    if (options.plugins?.vue) {
        const plugin = await interopDefault(import('eslint-plugin-vue'))
        baseConfig.push(...plugin.configs['flat/recommended'], {
            rules: {
                // https://eslint.vuejs.org/rules/html-indent.html
                'vue/html-indent': 'off',
            },
        })
    }

    if (options.plugins?.vue && options.plugins.typescript) {
        const parser = await interopDefault(import('vue-eslint-parser'))
        baseConfig.push({
            files: ['**/*.vue'],
            languageOptions: {
                parser,
                parserOptions: {
                    parser: typescript.parser,
                },
            },
        })
    }

    if (options.plugins?.perfectionist) {
        const plugin = await interopDefault(import('eslint-plugin-perfectionist'))
        baseConfig.push(plugin.configs['recommended-alphabetical'], {
            rules: {
                // https://perfectionist.dev/rules/sort-jsx-props
                'perfectionist/sort-jsx-props': [
                    'error',
                    {
                        customGroups: [
                            {
                                elementNamePattern: '^on.+',
                                groupName: 'callbacks',
                            },
                        ],
                        groups: ['unknown', 'callbacks'],
                    },
                ],
                // https://perfectionist.dev/rules/sort-objects
                'perfectionist/sort-objects': ['error', { newlinesBetween: 0 }],
            },
        })
    }

    if (options.plugins?.json) {
        const plugin = await interopDefault(import('eslint-plugin-jsonc'))
        baseConfig.push(...plugin.configs['recommended-with-jsonc'], {
            rules: {
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-bracket-newline.html
                'jsonc/array-bracket-newline': ['error', { multiline: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-bracket-spacing.html
                'jsonc/array-bracket-spacing': ['error', 'never'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/array-element-newline.html
                'jsonc/array-element-newline': ['error', { minItems: 2, multiline: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-dangle.html
                'jsonc/comma-dangle': ['error', 'never'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/comma-style.html
                'jsonc/comma-style': ['error', 'last'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/indent.html
                'jsonc/indent': ['error', 4],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/key-spacing.html
                'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false, mode: 'strict' }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-curly-newline.html
                'jsonc/object-curly-newline': ['error', { consistent: true }],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-curly-spacing.html
                'jsonc/object-curly-spacing': ['error', 'always'],
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/object-property-newline.html
                'jsonc/object-property-newline': 'error',
                // https://ota-meshi.github.io/eslint-plugin-jsonc/rules/sort-keys.html
                'jsonc/sort-keys': [
                    'error',
                    'asc',
                    {
                        allowLineSeparatedGroups: false,
                        caseSensitive: true,
                        minKeys: 2,
                        natural: false,
                    },
                ],
            },
        })
    }

    if (options.plugins?.yaml) {
        const plugin = await interopDefault(import('eslint-plugin-yml'))
        baseConfig.push(
            ...plugin.configs.standard,
            {
                rules: {
                    // https://ota-meshi.github.io/eslint-plugin-yml/rules/indent.html
                    'yml/indent': ['error', 4, { indicatorValueIndent: 2 }],
                    // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-keys.html
                    'yml/sort-keys': [
                        'error',
                        'asc',
                        {
                            allowLineSeparatedGroups: false,
                            caseSensitive: true,
                            minKeys: 2,
                            natural: false,
                        },
                    ],
                    // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-sequence-values.html
                    'yml/sort-sequence-values': [
                        'error',
                        {
                            order: {
                                caseSensitive: true,
                                natural: false,
                                type: 'asc',
                            },
                            pathPattern: '.*',
                        },
                    ],
                },
            },
            {
                files: ['**/workflows/**/*.yaml', '**/workflows/**/*.yml'],
                rules: {
                    // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-keys.html
                    'yml/sort-keys': 'off',
                    // https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-sequence-values.html
                    'yml/sort-sequence-values': 'off',
                },
            },
        )
    }

    return defineConfig(baseConfig, options?.extends ?? [])
}

async function interopDefault<T>(promise: Promise<{ default: T }>): Promise<T> {
    const module = await promise
    return module.default
}

export { createConfig }
