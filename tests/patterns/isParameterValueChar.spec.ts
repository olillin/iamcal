import { isParameterValueChar } from '../../src/patterns'

it('allows "0" when unquoted', () => {
    expect(isParameterValueChar('0')).toBe(true)
})

it('allows "A" when unquoted', () => {
    expect(isParameterValueChar('A')).toBe(true)
})

it('allows "Z" when unquoted', () => {
    expect(isParameterValueChar('Z')).toBe(true)
})

it('allows "a" when unquoted', () => {
    expect(isParameterValueChar('a')).toBe(true)
})

it('allows "z" when unquoted', () => {
    expect(isParameterValueChar('z')).toBe(true)
})

it('allows "-" when unquoted', () => {
    expect(isParameterValueChar('-')).toBe(true)
})

it('allows "_" when unquoted', () => {
    expect(isParameterValueChar('_')).toBe(true)
})

it('allows HTAB when unquoted', () => {
    expect(isParameterValueChar('\t')).toBe(true)
})

it('allows space when unquoted', () => {
    expect(isParameterValueChar(' ')).toBe(true)
})

it('allows "£" when unquoted', () => {
    expect(isParameterValueChar('£')).toBe(true)
})

it('allows "✨" when unquoted', () => {
    expect(isParameterValueChar('✨')).toBe(true)
})

it('does not allow DQUOTE when unquoted', () => {
    expect(isParameterValueChar('"')).toBe(false)
})

it('does not allow ";" when unquoted', () => {
    expect(isParameterValueChar(';')).toBe(false)
})

it('does not allow ":" when unquoted', () => {
    expect(isParameterValueChar(':')).toBe(false)
})

it('does not allow "," when unquoted', () => {
    expect(isParameterValueChar(',')).toBe(false)
})

it('does not allow LF when unquoted', () => {
    expect(isParameterValueChar('\n')).toBe(false)
})

it('allows "0" when quoted', () => {
    expect(isParameterValueChar('0', true)).toBe(true)
})

it('allows "A" when quoted', () => {
    expect(isParameterValueChar('A', true)).toBe(true)
})

it('allows "Z" when quoted', () => {
    expect(isParameterValueChar('Z', true)).toBe(true)
})

it('allows "a" when quoted', () => {
    expect(isParameterValueChar('a', true)).toBe(true)
})

it('allows "z" when quoted', () => {
    expect(isParameterValueChar('z', true)).toBe(true)
})

it('allows "-" when quoted', () => {
    expect(isParameterValueChar('-', true)).toBe(true)
})

it('allows "_" when quoted', () => {
    expect(isParameterValueChar('_', true)).toBe(true)
})

it('allows HTAB when quoted', () => {
    expect(isParameterValueChar('\t', true)).toBe(true)
})

it('allows space when quoted', () => {
    expect(isParameterValueChar(' ', true)).toBe(true)
})

it('allows "£" when quoted', () => {
    expect(isParameterValueChar('£', true)).toBe(true)
})

it('allows "✨" when quoted', () => {
    expect(isParameterValueChar('✨', true)).toBe(true)
})

it('does not allow DQUOTE when quoted', () => {
    expect(isParameterValueChar('"', true)).toBe(false)
})

it('allows ";" when quoted', () => {
    expect(isParameterValueChar(';', true)).toBe(true)
})

it('allows ":" when quoted', () => {
    expect(isParameterValueChar(':', true)).toBe(true)
})

it('allows "," when quoted', () => {
    expect(isParameterValueChar(',', true)).toBe(true)
})

it('does not allow LF when quoted', () => {
    expect(isParameterValueChar('\n')).toBe(false)
})

it('throws for empty string', () => {
    expect(() => isParameterValueChar('')).toThrow()
})

it('ignores extra characters', () => {
    expect(isParameterValueChar('A:')).toBe(true)
})
