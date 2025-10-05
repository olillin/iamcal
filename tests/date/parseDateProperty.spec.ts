import {
    CalendarDate,
    CalendarDateTime,
    Property,
    parseDateProperty,
} from '../../src'

it('returns a CalendarDateTime with value type DATE-TIME', () => {
    const property = new Property('DTSTART', '20250729T120000Z', {
        VALUE: 'DATE-TIME',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('returns a CalendarDate with value type DATE', () => {
    const property = new Property('DTSTART', '20250729', {
        VALUE: 'DATE',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDate)
})

it('returns a CalendarDateTime when no parameters are given', () => {
    const property = new Property('DTSTART', '20250729T120000Z')
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('returns a CalendarDateTime when no value type is given', () => {
    const property = new Property('DTSTART', '20250729T120000Z', {
        OTHER: 'PARAM',
    })
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('throws when parsing date-time as date', () => {
    const property = new Property('DTSTART', '20250729T120000Z', {
        VALUE: 'DATE',
    })
    expect(() => parseDateProperty(property)).toThrow()
})

it('throws when parsing date as date-time', () => {
    const property = new Property('DTSTART', '20250729', {
        VALUE: 'DATE-TIME',
    })
    expect(() => parseDateProperty(property)).toThrow()
})

it('throws when parsing date as inferred date-time', () => {
    // DTSTART is DATE-TIME by default
    const property = new Property('DTSTART', '20250729')
    expect(() => parseDateProperty(property)).toThrow()
})

it('ignores the property name', () => {
    const value: string = '20250729T120000Z'
    const dateTime = new CalendarDateTime(value)
    const properties: Property[] = [
        new Property('DTSTART', value),
        new Property('DTEND', value),
        new Property('DTSTAMP', value),
        new Property('CREATED', value),
        new Property('X-PROPERTY', value),
    ]

    const parsed = properties.map(property => parseDateProperty(property))

    parsed.forEach(parsedValue => {
        expect(parsedValue).toStrictEqual(dateTime)
    })
})

it('throws if value type is illegal', () => {
    const property = new Property('DTSTART', '20250729T120000Z', {
        VALUE: 'BINARY',
    })
    expect(() => parseDateProperty(property)).toThrow()
})
