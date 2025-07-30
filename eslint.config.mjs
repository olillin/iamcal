import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

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
    tseslint.configs.recommended
)
