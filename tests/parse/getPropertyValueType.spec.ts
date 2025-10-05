import { ComponentProperty, getPropertyValueType } from '../../src'

it('returns undefined when parameter missing', () => {
    let property = new ComponentProperty('DTSTART', '20250729T120000Z')
    let result = getPropertyValueType(property)
    expect(result).toBeUndefined()

    property = new ComponentProperty('DTSTART', '20250729T120000Z', {
        VALUE: '',
        VALUEDATE: '',
        value: '',
    })
    result = getPropertyValueType(property)
    expect(result).toBeUndefined()
})

it('returns the default value when provided', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z')
    const defaultValue = 'DATE-TIME'
    const result = getPropertyValueType(property, defaultValue)
    expect(result).toStrictEqual(defaultValue)
})

it('returns the value type when it is the only parameter', () => {
    const valueType = 'DATE'
    const property = new ComponentProperty('DTSTART', '20250729', {
        VALUE: valueType,
    })
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual(valueType)
})

it('returns the value type when other parameters are also present', () => {
    const valueType = 'DATE'
    const property = new ComponentProperty('DTSTART', '20250729', {
        OTHER: 'ABC',
        VALUE: valueType,
        KEY: 'VALUE',
    })
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual(valueType)
})

it('is case-insensitive', () => {
    const property = new ComponentProperty('DTSTART', '20250729', {
        value: 'date',
    })
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual('DATE')
})

it('throws if contains illegal characters', () => {
    let property = new ComponentProperty('DTSTART', '20250729', { VALUE: ';' })
    expect(() => {
        getPropertyValueType(property)
    }).toThrow()

    property = new ComponentProperty('DTSTART', '20250729', { VALUE: '"' })
    expect(() => {
        getPropertyValueType(property)
    }).toThrow()

    property = new ComponentProperty('DTSTART', '20250729', { VALUE: ':' })
    expect(() => {
        getPropertyValueType(property)
    }).toThrow()

    property = new ComponentProperty('DTSTART', '20250729', { VALUE: ',' })
    expect(() => {
        getPropertyValueType(property)
    }).toThrow()
})
