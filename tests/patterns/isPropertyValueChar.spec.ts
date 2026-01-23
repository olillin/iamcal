import { isPropertyValueChar } from '../../src/patterns'

it('allows "0"', () => {
    expect(isPropertyValueChar('0')).toBe(true)
})

it('allows "A"', () => {
    expect(isPropertyValueChar('A')).toBe(true)
})

it('allows "Z"', () => {
    expect(isPropertyValueChar('Z')).toBe(true)
})

it('allows "a"', () => {
    expect(isPropertyValueChar('a')).toBe(true)
})

it('allows "z"', () => {
    expect(isPropertyValueChar('z')).toBe(true)
})

it('allows "-"', () => {
    expect(isPropertyValueChar('-')).toBe(true)
})

it('allows "_"', () => {
    expect(isPropertyValueChar('_')).toBe(true)
})

it('allows HTAB', () => {
    expect(isPropertyValueChar('\t')).toBe(true)
})

it('allows space', () => {
    expect(isPropertyValueChar(' ')).toBe(true)
})

it('allows "£"', () => {
    expect(isPropertyValueChar('£')).toBe(true)
})

it('allows "✨"', () => {
    expect(isPropertyValueChar('✨')).toBe(true)
})

it('does not allow LF', () => {
    expect(isPropertyValueChar('\n')).toBe(false)
})

it('does not allow CR', () => {
    expect(isPropertyValueChar('\r')).toBe(false)
})

it('throws for empty string', () => {
    expect(() => isPropertyValueChar('')).toThrow()
})

it('ignores extra characters', () => {
    expect(isPropertyValueChar('A\n')).toBe(true)
})
