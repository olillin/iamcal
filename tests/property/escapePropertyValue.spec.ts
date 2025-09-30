import { escapePropertyValue } from '../../src/property'

it('converts , to \\,', () => {
    const value = 'a,b'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe(String.raw`a\,b`)
})

it('converts ; to \\;', () => {
    const value = 'a;b'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\;b')
})

it('converts LF to \\n', () => {
    const value = 'a\nb'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\nb')
})

it('converts CRLF to \\n', () => {
    const value = 'a\r\nb'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\nb')
})

it('converts \\ to \\\\', () => {
    const value = 'a\\b'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\\\b')
})

it('converts \\\\ to \\\\\\\\', () => {
    const value = 'a\\\\b'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\\\\\\\b')
})

it('converts \\n to \\\\n', () => {
    const value = 'a\\nb'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe(String.raw`a\\nb`)
})

it('converts \\LF to \\\\\\n', () => {
    const value = `a\\\nb`
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\\\\\\nb')
})

it('does not convert HT to \\t', () => {
    const value = 'a\tb'
    const escaped = escapePropertyValue(value)
    expect(escaped).toBe('a\tb')
})
