import { isNameChar } from '../../src/patterns'

it('allows "0"', () => {
    expect(isNameChar('0')).toBe(true)
})

it('allows "A"', () => {
    expect(isNameChar('A')).toBe(true)
})

it('allows "Z"', () => {
    expect(isNameChar('Z')).toBe(true)
})

it('allows "a"', () => {
    expect(isNameChar('a')).toBe(true)
})

it('allows "z"', () => {
    expect(isNameChar('z')).toBe(true)
})

it('allows "-"', () => {
    expect(isNameChar('-')).toBe(true)
})

it('does not allow "_"', () => {
    expect(isNameChar('_')).toBe(false)
})

it('does not allow HTAB', () => {
    expect(isNameChar('\t')).toBe(false)
})

it('does not allow LF', () => {
    expect(isNameChar('\n')).toBe(false)
})

it('does not allow space', () => {
    expect(isNameChar(' ')).toBe(false)
})

it('does not allow "£"', () => {
    expect(isNameChar('£')).toBe(false)
})

it('does not allow "✨"', () => {
    expect(isNameChar('✨')).toBe(false)
})

it('throws for empty string', () => {
    expect(() => isNameChar('')).toThrow()
})

it('ignores extra characters', () => {
    expect(isNameChar('A ')).toBe(true)
})
