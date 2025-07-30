import { getPropertyValueType, Property } from "../../src"

it('returns undefined when parameter missing', () => {
    let property: Property = {
        name: 'DTSTART',
        params: [],
        value: '20250729T120000Z',
    }
    let result = getPropertyValueType(property)
    expect(result).toBeUndefined()

    property = {
        name: 'DTSTART',
        params: ['VALUE', 'VALUEDATE', 'value'],
        value: '20250729T120000Z',
    }
    result = getPropertyValueType(property)
    expect(result).toBeUndefined()
})

it('returns the default value when provided', () => {
    const property: Property = {
        name: 'DTSTART',
        params: [],
        value: '20250729T120000Z',
    }
    const defaultValue = 'DATE-TIME'
    const result = getPropertyValueType(property, defaultValue)
    expect(result).toStrictEqual(defaultValue)
})

it('returns the value type when it is the only parameter', () => {
    const valueType = 'DATE'
    const property: Property = {
        name: 'DTSTART',
        params: [`VALUE=${valueType}`],
        value: '20250729',
    }
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual(valueType)
})

it('returns the value type when other parameters are also present', () => {
    const valueType = 'DATE'
    const property: Property = {
        name: 'DTSTART',
        params: ['OTHER=ABC', `VALUE=${valueType}`, 'KEY=VALUE'],
        value: '20250729',
    }
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual(valueType)
})

it('is case-insensitive', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['value=date'],
        value: '20250729',
    }
    const result = getPropertyValueType(property)
    expect(result).toStrictEqual('DATE')
})

it('throws if contains illegal characters', () => {
    let property: Property = {
        name: 'DTSTART',
        params: ['VALUE=;'],
        value: '20250729',
    }
    expect(() => { getPropertyValueType(property) }).toThrow()

    property = {
        name: 'DTSTART',
        params: ['VALUE="'],
        value: '20250729',
    }
    expect(() => { getPropertyValueType(property) }).toThrow()

    property = {
        name: 'DTSTART',
        params: ['VALUE=:'],
        value: '20250729',
    }
    expect(() => { getPropertyValueType(property) }).toThrow()

    property = {
        name: 'DTSTART',
        params: ['VALUE=,'],
        value: '20250729',
    }
    expect(() => { getPropertyValueType(property) }).toThrow()
})