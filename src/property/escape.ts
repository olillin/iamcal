/**
 * Escape special characters in a TEXT property value.
 *
 * Note: This method converts both CRLF and LF to '\n'.
 * @param value The property value to escape.
 * @returns The escaped property value.
 * @see {@link unescapeTextPropertyValue}
 */
export function escapeTextPropertyValue(value: string): string {
    return value.replace(/(?=[,;\\])/g, '\\').replace(/\r?\n/g, '\\n')
}

/**
 * Unescape special characters in a TEXT property value.
 * @param value The property value to unescape.
 * @returns The unescaped property value.
 * @throws If the value contains a bad escaped character, i.e., a character that should not be escaped after a backslash.
 * @see {@link unescapeTextPropertyValue}
 */
export function unescapeTextPropertyValue(value: string): string {
    const broadBadEscapePattern = /(?<!\\)\\(\\\\)*[^,;\\nN]/
    const broadBadEscape = broadBadEscapePattern.exec(value)
    if (broadBadEscape) {
        const badEscape = value
            .substring(broadBadEscape.index)
            .match(/\\[^,;\\nN]/)!
        const position = broadBadEscape.index + badEscape.index!
        throw new SyntaxError(
            `Bad escaped character '${badEscape[0]}' at position ${position}`
        )
    }

    const jsonValue = value.replace(/\\N/, '\\n').replace(/\\(?=[,;:"])/g, '')
    return JSON.parse(`"${jsonValue}"`) as string
}

/**
 * Escape a property parameter value.
 * @param param The parameter value to escape.
 * @returns The escaped parameter value.
 * @throws If the parameter value contains a DQUOTE (") character.
 * @see {@link unescapePropertyParameterValue}
 */
export function escapePropertyParameterValue(param: string): string {
    // Property parameter values MUST NOT contain the DQUOTE character.  The
    // DQUOTE character is used as a delimiter for parameter values that
    // contain restricted characters or URI text.
    if (param.includes('"')) {
        throw new Error('Parameter value must not contain DQUOTE (").')
    }

    // Property parameter values that contain the COLON, SEMICOLON, or COMMA
    // character separators MUST be specified as quoted-string text values.
    if (/[:;,]/.test(param)) {
        return `"${param}"`
    }
    return param
}

/**
 * Unescape a property parameter value.
 * @param param The parameter value to unescape.
 * @returns The unescaped parameter value.
 * @see {@link escapePropertyParameterValue}
 */
export function unescapePropertyParameterValue(param: string): string {
    if (param.startsWith('"') && param.endsWith('"')) {
        return param.slice(1, -1)
    }
    return param
}

// Max line length as defined by RFC 5545 3.1.
export const MAX_LINE_LENGTH = 75

/**
 * Fold a single line as specified in RFC 5545 3.1.
 * @param line The line to fold.
 * @returns The folded line.
 */
export function foldLine(line: string): string {
    if (line.length < MAX_LINE_LENGTH) return line

    const lines = [line.substring(0, MAX_LINE_LENGTH)]
    const matches = line
        .substring(MAX_LINE_LENGTH)
        .matchAll(new RegExp(`.{${MAX_LINE_LENGTH - 2}}`, 'g'))
    for (const match of matches) {
        lines.push(match[0])
    }

    return lines.join('\r\n ')
}

/**
 * Unfold a single line as specified in RFC 5545 3.1.
 * @param lines The lines to unfold.
 * @returns The unfolded line.
 */
export function unfoldLine(lines: string): string {
    return lines.replace(/\r\n /g, '')
}
