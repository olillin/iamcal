import { escapeTextPropertyValue } from '../../src/property'

it('converts , to \\,', () => {
    const value = 'a,b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\,b')
})

it('converts ; to \\;', () => {
    const value = 'a;b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\;b')
})

it('converts LF to \\n', () => {
    const value = 'a\nb'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\nb')
})

it('converts CRLF to \\n', () => {
    const value = 'a\r\nb'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\nb')
})

it('converts \\ to \\\\', () => {
    const value = 'a\\b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\\\b')
})

it('converts \\\\ to \\\\\\\\', () => {
    const value = 'a\\\\b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\\\\\\\b')
})

it('converts \\n to \\\\n', () => {
    const value = 'a\\nb'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe(String.raw`a\\nb`)
})

it('converts \\LF to \\\\\\n', () => {
    const value = `a\\\nb`
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a\\\\\\nb')
})

it('does not convert HT', () => {
    const value = 'a\tb'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe(value)
})

it('does not convert :', () => {
    const value = 'a:b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a:b')
})

it('does not convert "', () => {
    const value = 'a"b'
    const escaped = escapeTextPropertyValue(value)
    expect(escaped).toBe('a"b')
})
