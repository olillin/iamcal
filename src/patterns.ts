/* eslint-disable no-control-regex */

// ABNF patterns from RFC5545
export const CONTROL = /[\x00-\x08\x0A-\x1F\x7F]/g
export const NON_US_ASCII = /[^\x00-\x7F]/g
export const VALUE_CHAR = new RegExp(
    /[\x09\x20\x21-\x7E]/.source + '|' + NON_US_ASCII.source
)
export const SAFE_CHAR = new RegExp(
    /[\x09\x20\x21\x23-\x2B\x2D-\x39\x3C-\x7E]/.source +
        '|' +
        NON_US_ASCII.source
)
export const QSAFE_CHAR = new RegExp(
    /[\x09\x20\x21\x23-\x7E]/.source + '|(' + NON_US_ASCII.source + ')'
)
export const quotedString = new RegExp('"(' + QSAFE_CHAR.source + ')*"')
export const value = new RegExp('(' + VALUE_CHAR.source + ')*')
export const paramtext = new RegExp('(' + SAFE_CHAR.source + ')*')
export const paramValue = new RegExp(
    '(' + paramtext.source + ')|(' + quotedString.source + ')'
)
export const vendorId = /[0-9a-zA-Z]{3}/
export const xName = new RegExp('X-(' + vendorId.source + '-)?[0-9a-zA-Z-]')
export const ianaToken = /[0-9a-zA-Z-]/
export const paramName = new RegExp(ianaToken.source + '|' + xName.source)
export const param = new RegExp(
    paramName.source + '=' + paramValue.source + '(,' + paramValue.source + ')*'
)
export const name = new RegExp(ianaToken.source + '|' + xName.source)
export const contentline = new RegExp(
    name.source + '(;' + param.source + ')*:' + xName.source + '\r\n'
)

export const TSAFE_CHAR = new RegExp(
    /[\x09\x20\x21\x23-\x2B\x2D-\x39\x3C-\x5B\x5D-\x7E]/.source +
        '|' +
        NON_US_ASCII.source
)

// Property value type patterns
export const valueTypeBinary =
    /([0-9a-zA-Z+/]{4})*([0-9a-zA-Z]{2}==|[0-9a-zA-Z]{3}=)?/
export const valueTypeBoolean = /(TRUE|FALSE)/
export const valueTypeDate = /[0-9]{8}/
export const valueTypeDateTime = /[0-9]{8}T[0-9]{6}Z?/
export const valueTypeDuration =
    /(\+?|-)P([0-9]+D(T([0-9]+H([0-9]+M([0-9]+S)?)?|[0-9]+M([0-9]+S)?|[0-9]+S))?|T([0-9]+H([0-9]+M([0-9]+S)?)?|[0-9]+M([0-9]+S)?|[0-9]+S)|[0-9]+W)/
export const valueTypeFloat = /(\+?|-)?[0-9]+(\.[0-9]+)?/
export const valueTypeInteger = /(\+?|-)?[0-9]+/
export const valueTypePeriod = new RegExp(
    `${valueTypeDateTime.source}/(${valueTypeDateTime}|${valueTypeDuration.source})`
)
export const valueTypeText = new RegExp(
    '((' + TSAFE_CHAR.source + String.raw`)|:|"|\\[\\;,Nn])*`
)
export const valueTypeTime = /[0-9]{6}Z?/
export const valueTypeUtcOffset = /[+-]([0-9]{2}){2,3}/

// Content type as defined by RFC 4288 4.2
export const regName = /[a-zA-Z0-9!#$&.+^_-]{1,127}/
export const contentType = new RegExp(
    '(' + regName.source + ')/(' + regName.source + ')'
)

/**
 * Check if a string matches a pattern for the whole string.
 * @param pattern The RegExp pattern to match against.
 * @param text The text to check.
 * @returns Whether or not the string matches.
 */
export function matchesWholeString(pattern: RegExp, text: string): boolean {
    const match = text.match(pattern)
    return match !== null && match[0] === text
}

/**
 * Get the ordinal (character code) of a character.
 * @param char The character to get the ordinal value of.
 * @returns The ordinal as a number.
 */
export function ord(char: string): number {
    if (char.length === 0)
        throw new Error('Expected a character, got empty string')

    return char.charCodeAt(0)
}

/**
 * Check if a character is allowed in a property or parameter name.
 * @param char The character to check.
 * @returns Whether or not the character is allowed.
 */
export function isNameChar(char: string): boolean {
    return (
        (ord(char) >= ord('A') && ord(char) <= ord('Z')) ||
        (ord(char) >= ord('a') && ord(char) <= ord('z')) ||
        (ord(char) >= ord('0') && ord(char) <= ord('9')) ||
        char === '-'
    )
}

/**
 * Check if a character is allowwed in a property value.
 * @param char The character to check.
 * @returns Whether or not the character is allowed.
 */
export function isPropertyValueChar(char: string): boolean {
    return ord(char) === 9 || ord(char) >= 32
}

/**
 * Check if a character is allowwed in a parameter value.
 * @param char The character to check.
 * @param quoted Whether or not the parameter value is quoted, this allows ';', ':' and ','.
 * @returns Whether or not the character is allowed.
 */
export function isParameterValueChar(
    char: string,
    quoted: boolean = false
): boolean {
    return (
        // Allow HTAB
        ord(char) === 9 ||
        // Do not allow DQUOTE
        (char !== '"' &&
            // Allow non-control characters
            ord(char) >= 32 &&
            // These characters are only allowed if quoted
            (quoted || !(char === ';' || char === ':' || char === ',')))
    )
}
