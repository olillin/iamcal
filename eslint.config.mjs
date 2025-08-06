import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'
import jsdoc from 'eslint-plugin-jsdoc'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default tseslint.config(
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    {
        files: ['**/*.ts'],
    },
    {
        languageOptions: { globals: globals.node },
    },
    eslint.configs.recommended,
    jsdoc.configs['flat/contents-typescript'],
    jsdoc.configs['flat/logical-typescript'],
    jsdoc.configs['flat/requirements-typescript'],
    jsdoc.configs['flat/stylistic-typescript'],
    {
        rules: {
            'jsdoc/require-throws': 'warn',
            'jsdoc/require-description-complete-sentence': 'warn',
            'jsdoc/sort-tags': 'warn',
            'jsdoc/require-example': 'off',
        },
    },
    tseslint.configs.recommended
)
