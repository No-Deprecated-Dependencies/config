import {
    type ConfigWithExtends,
    type ConfigWithExtendsArray,
    defineConfig,
    globalIgnores,
} from '@eslint/config-helpers'
import js from '@eslint/js'
import globals from 'globals'
import typescript from 'typescript-eslint'

async function nddeps(
    options: {
        plugins?: {
            json?: boolean
            next?: boolean
            perfectionist?: boolean
            react?: boolean
            typescript?: boolean
            vue?: boolean
            yaml?: boolean
        }
        prepend?: ConfigWithExtendsArray
    } = {},
    ...userConfig: ConfigWithExtendsArray
) {
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
        globalIgnores(['**/dist', '**/node_modules', '**/package.json']),
    ]

    if (options.plugins?.typescript && !options.plugins?.next) {
        baseConfig.push(typescript.configs.recommended)
    }

    if (options.plugins?.react && !options.plugins?.next) {
        const react = await import('eslint-plugin-react').then((m) => m.default)
        const reactHooks = await import('eslint-plugin-react-hooks').then((m) => m.default)
        baseConfig.push(
            react.configs.flat.recommended as ConfigWithExtends,
            react.configs.flat['jsx-runtime'] as ConfigWithExtends,
            reactHooks.configs.flat.recommended,
            {
                name: 'nddeps/react',
                rules: {
                    'react/jsx-sort-props': [
                        'error',
                        {
                            callbacksLast: true,
                            reservedFirst: true,
                            shorthandLast: true,
                        },
                    ],
                },
            },
        )
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
        const vue = await import('eslint-plugin-vue').then((m) => m.default)
        baseConfig.push(...vue.configs['flat/recommended'], {
            name: 'nddeps/vue',
            rules: {
                'vue/html-indent': 'off',
            },
        })
    }

    if (options.plugins?.vue && options.plugins.typescript) {
        const vueParser = await import('vue-eslint-parser').then((m) => m.default)
        baseConfig.push({
            files: ['*.vue', '**/*.vue'],
            languageOptions: {
                parser: vueParser,
                parserOptions: {
                    parser: typescript.parser,
                },
            },
        })
    }

    if (options.plugins?.perfectionist) {
        const perfectionist = await import('eslint-plugin-perfectionist').then((m) => m.default)
        baseConfig.push(perfectionist.configs['recommended-alphabetical'], {
            name: 'nddeps/perfectionist',
            rules: {
                'perfectionist/sort-jsx-props': [
                    'off',
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
                'perfectionist/sort-objects': ['error', { newlinesBetween: 0 }],
            },
        })
    }

    if (options.plugins?.json) {
        const json = await import('eslint-plugin-jsonc').then((m) => m.default)
        baseConfig.push(
            ...json.configs['recommended-with-jsonc'],
            {
                name: 'nddeps/json',
                rules: {
                    'jsonc/array-bracket-newline': ['error', { multiline: true }],
                    'jsonc/array-bracket-spacing': ['error', 'never'],
                    'jsonc/array-element-newline': ['error', { minItems: 2, multiline: true }],
                    'jsonc/comma-dangle': ['error', 'never'],
                    'jsonc/comma-style': ['error', 'last'],
                    'jsonc/indent': ['error', 4],
                    'jsonc/key-spacing': ['error', { afterColon: true, beforeColon: false, mode: 'strict' }],
                    'jsonc/object-curly-newline': ['error', { consistent: true }],
                    'jsonc/object-curly-spacing': ['error', 'always'],
                    'jsonc/object-property-newline': 'error',
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
            },
            globalIgnores(['**/*.lock.json']),
        )
    }

    if (options.plugins?.yaml) {
        const yaml = await import('eslint-plugin-yml').then((m) => m.default)
        baseConfig.push(
            ...yaml.configs.standard,
            {
                name: 'nddeps/yaml',
                rules: {
                    'yml/indent': ['error', 4, { indicatorValueIndent: 2 }],
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
                    'yml/sort-sequence-values': [
                        'error',
                        {
                            order: {
                                caseSensitive: true,
                                natural: false,
                                type: 'asc',
                            },
                            pathPattern: '^$',
                        },
                    ],
                },
            },
            {
                files: ['**/workflows/**/*.yaml', '**/workflows/**/*.yml'],
                name: 'nddeps/yaml/workflows',
                rules: {
                    'yml/sort-keys': 'off',
                    'yml/sort-sequence-values': 'off',
                },
            },
            globalIgnores(['**/*-lock.yaml']),
        )
    }

    return defineConfig(baseConfig, userConfig)
}

export { nddeps }
