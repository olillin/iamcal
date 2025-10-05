import { unescapeTextPropertyValue } from '../../src/property'

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

// Maybe this should actually throw?
it('does not convert \\t', () => {
    const value = 'a\\tb'
    const unescaped = unescapeTextPropertyValue(value)
    expect(unescaped).toBe(value)
})
