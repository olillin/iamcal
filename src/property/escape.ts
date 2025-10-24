import { ord } from '../patterns'

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
    /** List that will contain the characters of the unescaped string. */
    const chars: number[] = []

    // Character codes for special characters
    const backslash = ord('\\')
    const newline = ord('\n')
    const lowercaseN = ord('n')
    const uppercaseN = ord('N')
    const comma = ord(',')
    const semicolon = ord(';')

    let previousCharWasBackslash = false
    for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i)

        if (previousCharWasBackslash) {
            // Previous character was a backslash, so this character is the second character in an escape sequence
            if (char === lowercaseN || char === uppercaseN) {
                chars.push(newline)
            } else if (
                char === comma ||
                char === semicolon ||
                char === backslash
            ) {
                chars.push(char)
            } else {
                const position = i - 1
                throw new SyntaxError(
                    `Bad escaped character '\\${String.fromCharCode(char)}' at position ${position}`
                )
            }
            // End the escape sequence
            previousCharWasBackslash = false
        } else if (char === backslash) {
            // Start of an escape sequence
            previousCharWasBackslash = true
        } else {
            chars.push(char)
        }
    }

    return String.fromCharCode(...chars)
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
    if (line.length <= MAX_LINE_LENGTH) return line

    const firstChar = line.charAt(0)
    const lines = [line.substring(1, MAX_LINE_LENGTH)]
    const matches = line
        .substring(MAX_LINE_LENGTH)
        .matchAll(new RegExp(`.{${MAX_LINE_LENGTH - 1}}`, 'g'))
    for (const match of matches) {
        lines.push(match[0])
    }
    // Add last line
    const lastLineStart =
        Math.floor(line.length / (MAX_LINE_LENGTH - 1)) *
            (MAX_LINE_LENGTH - 1) +
        1
    lines.push(line.substring(lastLineStart))

    return firstChar + lines.join('\r\n ')
}

/**
 * Unfold a single line as specified in RFC 5545 3.1.
 * @param lines The lines to unfold.
 * @returns The unfolded line.
 */
export function unfoldLine(lines: string): string {
    return lines.replace(/\r\n /g, '')
}
