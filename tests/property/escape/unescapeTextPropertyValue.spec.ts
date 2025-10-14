import { unescapeTextPropertyValue } from '../../../src/property/escape'

it('converts \\, to ,', () => {
    const value = 'a\\,b'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a,b')
})

it('converts \\; to ;', () => {
    const value = 'a\\;b'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a;b')
})

it('converts \\n to LF', () => {
    const value = 'a\\nb'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\nb')
})

it('converts \\N to LF', () => {
    const value = 'a\\Nb'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\nb')
})

it('converts \\\\ to \\', () => {
    const value = 'a\\\\b'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\\b')
})

it('converts \\\\\\\\ to \\\\', () => {
    const value = 'a\\\\\\\\b'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\\\\b')
})

it('converts \\\\n to \\n', () => {
    const value = 'a\\\\nb'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\\nb')
})

it('converts \\\\\\n to \\LF', () => {
    const value = `a\\\\\\nb`
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe('a\\\nb')
})

it('throws on \\t', () => {
    const value = 'a\\tb'
    expect(() => {
        unescapeTextPropertyValue(value)
    }).toThrow(new SyntaxError("Bad escaped character '\\t' at position 1"))
})

it('throws on \\a', () => {
    const value = '\\a'
    expect(() => {
        unescapeTextPropertyValue(value)
    }).toThrow(new SyntaxError("Bad escaped character '\\a' at position 0"))
})

it('throws on \\:', () => {
    const value = 'a\\:b'
    expect(() => {
        unescapeTextPropertyValue(value)
    }).toThrow(new SyntaxError("Bad escaped character '\\:' at position 1"))
})

it('throws on \\"', () => {
    const value = '\\"'
    expect(() => {
        unescapeTextPropertyValue(value)
    }).toThrow(new SyntaxError("Bad escaped character '\\\"' at position 0"))
})

it('calculates bad escape index correctly', () => {
    const value = '\\\\b \\\\\\a'
    expect(() => {
        unescapeTextPropertyValue(value)
    }).toThrow(new SyntaxError("Bad escaped character '\\a' at position 6"))
})
