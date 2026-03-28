import { runAsWorker } from 'synckit'

let oxfmt: typeof import('oxfmt')

runAsWorker(async (...args: Parameters<typeof oxfmt.format>) => {
    if (oxfmt === undefined) {
        oxfmt = await import('oxfmt')
    }

    return oxfmt.format(...args)
})
