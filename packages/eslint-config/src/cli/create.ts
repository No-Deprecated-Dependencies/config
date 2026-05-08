import { cancel, confirm, intro, multiselect, outro, spinner } from '@clack/prompts'
import dedent from 'dedent'
import { writeFile } from 'fs/promises'
import { addDevDependency } from 'nypm'

import { ensure } from './ensure'
import { exists } from './exists'

const CONFIG_FILENAME = 'eslint.config.ts'

async function create() {
    intro('Creating ESLint config...')

    const configFileExists = await exists(CONFIG_FILENAME)

    if (configFileExists && !(await ensure(confirm({ message: 'Config file already exists. Overwrite?' })))) {
        cancel('Operation cancelled')
        process.exit(0)
    }

    const plugins = await ensure(
        multiselect({
            message: 'Select plugins',
            options: [
                {
                    label: 'JSON',
                    value: {
                        dependencies: ['eslint-plugin-jsonc'],
                        name: 'json',
                    },
                },
                {
                    label: 'Next.js',
                    value: {
                        dependencies: ['@next/eslint-plugin-next'],
                        name: 'next',
                    },
                },
                {
                    label: 'Perfectionist',
                    value: {
                        dependencies: ['eslint-plugin-perfectionist'],
                        name: 'perfectionist',
                    },
                },
                {
                    label: 'React',
                    value: {
                        dependencies: ['eslint-plugin-react'],
                        name: 'react',
                    },
                },
                {
                    label: 'TypeScript',
                    value: {
                        dependencies: ['typescript-eslint'],
                        name: 'typescript',
                    },
                },
                {
                    label: 'Vue',
                    value: {
                        dependencies: ['eslint-plugin-vue', 'vue-eslint-parser'],
                        name: 'vue',
                    },
                },
                {
                    label: 'YAML',
                    value: {
                        dependencies: ['eslint-plugin-yml'],
                        name: 'yaml',
                    },
                },
            ],
        }),
    )

    const configTemplate = dedent.withOptions({ alignValues: true })`
        import { createConfig } from '@nddeps/eslint-config'

        export default createConfig({
            plugins: {
                ${plugins.map((plugin) => `${plugin.name}: true,`).join('\n')}
            },
        })

    `

    await writeFile(CONFIG_FILENAME, configTemplate, { encoding: 'utf-8' })

    const dependencies = plugins.flatMap((plugin) => plugin.dependencies)
    const s = spinner()

    if (dependencies.length) {
        s.start(`Installing dependencies...`)

        await addDevDependency(dependencies, { silent: true })

        s.stop('Installation complete')
    }

    outro(`ESLint config created`)
}

export { create }
