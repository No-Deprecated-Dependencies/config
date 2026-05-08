import { cancel, isCancel } from '@clack/prompts'

async function ensure<T>(prompt: Promise<symbol | T>) {
    const answer = await prompt

    if (isCancel(answer)) {
        cancel('Operation cancelled')
        process.exit(0)
    }

    return answer
}

export { ensure }
