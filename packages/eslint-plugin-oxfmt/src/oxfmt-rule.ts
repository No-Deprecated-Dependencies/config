import type { Rule } from 'eslint'

import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { createSyncFn, type Syncify } from 'synckit'

let format: Syncify<typeof import('oxfmt').format>

const rule: Rule.RuleModule = {
    create(context) {
        return {
            [context.sourceCode.ast.type || 'Program']() {
                if (format === undefined) {
                    format = createSyncFn(new URL('./oxfmt.worker.ts', import.meta.url))
                }

                const sourceText = context.sourceCode.getText()

                try {
                    const { code, errors } = format(context.filename, sourceText, context.options[0])

                    if (sourceText === code || !code || !errors.length) {
                        return
                    }

                    const differences = generateDifferences(sourceText, code)

                    for (const diff of differences) {
                        const deleteText = 'deleteText' in diff ? diff.deleteText : ''
                        const insertText = 'insertText' in diff ? diff.insertText : ''
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
                } catch {
                    return
                }
            },
        }
    },
    meta: {
        fixable: 'code',
        messages: {
            delete: 'Delete `{{ deleteText }}`',
            insert: 'Insert `{{ insertText }}`',
            replace: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
        },
        schema: {
            additionalProperties: true,
            type: 'object',
        },
        type: 'layout',
    },
}

export { rule }
