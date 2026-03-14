import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier/recommended'
import { type Config, defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

function nddeps(): Config[] {
    return defineConfig([
        {
            extends: ['js/recommended'],
            files: ['**/*.{cjs,cts,js,jsx,mjs,mts,ts,tsx,vue}'],
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
        tseslint.configs.recommended,
        perfectionist.configs['recommended-alphabetical'],
        prettier,
    ])
}

export { nddeps }
