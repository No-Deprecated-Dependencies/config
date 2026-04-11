import type { Rule } from 'eslint'

import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { createSyncFn, type Syncify } from 'synckit'

let format: Syncify<typeof import('oxfmt').format>

const plugin: Rule.RuleModule = {
    create(context) {
        return {
            [context.sourceCode.ast.type || 'Program']() {
                if (format === undefined) {
                    format = createSyncFn(new URL('./oxfmt.worker.ts', import.meta.url))
                }

                const sourceText = context.sourceCode.getText()

                let formatted: string

                try {
                    formatted = format(context.filename, sourceText).code
                } catch {
                    return
                }

                if (sourceText === formatted) {
                    return
                }

                const differences = generateDifferences(sourceText, formatted)

                for (const diff of differences) {
                    const deleteText = diff.operation === 'delete' ? diff.deleteText : ''
                    const insertText = diff.operation === 'insert' ? diff.insertText : ''
                    const range: [number, number] = [diff.offset, diff.offset + deleteText.length]
                    const start = context.sourceCode.getLocFromIndex(range[0])
                    const end = context.sourceCode.getLocFromIndex(range[1])

                    context.report({
                        data: {
                            deleteText: showInvisibles(deleteText),
                            insertText: showInvisibles(insertText),
                        },
                        fix: (fixer) => fixer.replaceTextRange(range, insertText),
                        loc: { end, start },
                        messageId: diff.operation,
                    })
                }
            },
        }
    },
    meta: {
        fixable: 'whitespace',
        messages: {
            delete: 'Delete `{{ deleteText }}`',
            insert: 'Insert `{{ insertText }}`',
            replace: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
        },
        type: 'layout',
    },
}

export { plugin }
