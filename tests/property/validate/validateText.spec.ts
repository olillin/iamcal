import { validateText } from '../../../src/property/validate'

it('allows lowercase letters', () => {
    expect(() => {
        validateText('abcdefghijklmnopqrstuvwxyz')
    }).not.toThrow()
})

it('allows uppercase letters', () => {
    expect(() => {
        validateText('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    }).not.toThrow()
})

it('allows digits', () => {
    expect(() => {
        validateText('0123456789')
    }).not.toThrow()
})

it('allows spaces', () => {
    expect(() => {
        validateText(' ')
    }).not.toThrow()
})

it('allows :', () => {
    expect(() => {
        validateText(':')
    }).not.toThrow()
})

it('allows "', () => {
    expect(() => {
        validateText(String.raw`\\`)
    }).not.toThrow()
})

it('allows ,', () => {
    expect(() => {
        validateText(',')
    }).not.toThrow()
})

it('allows ;', () => {
    expect(() => {
        validateText(';')
    }).not.toThrow()
})

it('allows escaped \\n', () => {
    expect(() => {
        validateText(String.raw`\n`)
    }).not.toThrow()
})

it('allows escaped \\,', () => {
    expect(() => {
        validateText(String.raw`\,`)
    }).not.toThrow()
})

it('allows escaped \\\\', () => {
    expect(() => {
        validateText(String.raw`\\`)
    }).not.toThrow()
})

it('allow unescaped ,', () => {
    expect(() => {
        validateText(',')
    }).not.toThrow()
})

it('allow unescaped \\n', () => {
    expect(() => {
        validateText('\n')
    }).not.toThrow()
})
