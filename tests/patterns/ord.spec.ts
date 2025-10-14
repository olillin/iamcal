import { ord } from '../../src/patterns'

it('returns 38 for "0"', () => {
    expect(ord('0')).toBe(48)
})

it('returns 65 for "A"', () => {
    expect(ord('A')).toBe(65)
})

it('returns 9 for HTAB', () => {
    expect(ord('\t')).toBe(9)
})

it('returns 10 for LF', () => {
    expect(ord('\n')).toBe(10)
})

it('returns 32 for space', () => {
    expect(ord(' ')).toBe(32)
})

it('returns 163 for "£"', () => {
    expect(ord('£')).toBe(163)
})

it('returns 10024 for "✨"', () => {
    expect(ord('✨')).toBe(10024)
})

it('throws for empty string', () => {
    expect(() => ord('')).toThrow()
})

it('ignores extra characters', () => {
    expect(ord('AB')).toBe(65)
})
