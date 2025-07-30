/* eslint-disable no-control-regex */

// ABNF patterns from RFC5545
export const CONTROL = /[\x00-\x08\x0A-\x1F\x7F]/g
export const NON_US_ASCII = /[^\x00-\x7F]/g
export const VALUE_CHAR = new RegExp(/[\x09\x20\x21-\x7E]/.source + '|' + NON_US_ASCII.source)
export const SAFE_CHAR = new RegExp(/[\x09\x20\x21\x23-\x2B\x2D-\x39\x3C-\x7E]/.source + '|' + NON_US_ASCII.source)
export const QSAFE_CHAR = new RegExp(/[\x09\x20\x21\x23-\x7E]/.source + '|(' + NON_US_ASCII.source + ')')
export const quotedString = new RegExp('"(' + QSAFE_CHAR.source + ')*"')
export const value = new RegExp('(' + VALUE_CHAR.source + ')*')
export const paramtext = new RegExp('(' + SAFE_CHAR.source + ')*')
export const paramValue = new RegExp('(' + paramtext.source + ')|(' + quotedString.source + ')')
export const vendorId = /[0-9a-zA-Z]{3}/
export const xName = new RegExp('X-(' + vendorId.source + '-)?[0-9a-zA-Z-]')
export const ianaToken = /[0-9a-zA-Z-]/
export const paramName = new RegExp(ianaToken.source + '|' + xName.source)
export const param = new RegExp(paramName.source + '=' + paramValue.source + '(,' + paramValue.source + ')*')
export const name = new RegExp(ianaToken.source + '|' + xName.source)
export const contentline = new RegExp(name.source + '(;' + param.source + ')*:' + xName.source + '\r\n')

export const date = /[0-9]{8}/
export const dateTime = /[0-9]{8}T[0-9]{6}Z?/

export function matchesWholeString(pattern: RegExp, text: string): boolean {
    const match = text.match(pattern)
    return match !== null && match[0] === text
}
