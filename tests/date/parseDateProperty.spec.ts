import {
    CalendarDate,
    CalendarDateTime,
    ComponentProperty,
    parseDateProperty,
} from '../../src'

it('returns a CalendarDateTime with value type DATE-TIME', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z', {
        VALUE: 'DATE-TIME',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('returns a CalendarDate with value type DATE', () => {
    const property = new ComponentProperty('DTSTART', '20250729', {
        VALUE: 'DATE',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDate)
})

it('returns a CalendarDateTime when no parameters are given', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z')
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('returns a CalendarDateTime when no value type is given', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z', {
        OTHER: 'PARAM',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('throws when parsing date-time as date', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z', {
        VALUE: 'DATE',
    })
    expect(() => parseDateProperty(property)).toThrow()
})

it('throws when parsing date as date-time', () => {
    const property = new ComponentProperty('DTSTART', '20250729', {
        VALUE: ' DATE-TIME',
    })
    expect(() => parseDateProperty(property)).toThrow()
})

it('ignores the property name', () => {
    const value: string = '20250729T120000Z'
    const properties: ComponentProperty[] = [
        new ComponentProperty('DTSTART', value),
        new ComponentProperty('DTEND', value),
        new ComponentProperty('DTSTAMP', value),
        new ComponentProperty('CREATED', value),
        new ComponentProperty('X-PROPERTY', value),
    ]

    const parsed = properties.map(property => parseDateProperty(property))

    parsed.forEach(a => {
        parsed.forEach(b => {
            expect(a).toStrictEqual(b)
        })
    })
})

it('throws if value type is illegal', () => {
    const property = new ComponentProperty('DTSTART', '20250729T120000Z', {
        VALUE: 'BINARY',
    })
    expect(() => parseDateProperty(property)).toThrow()
})
