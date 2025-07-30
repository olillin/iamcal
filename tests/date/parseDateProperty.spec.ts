import { Property } from "../../src"
import { CalendarDate, CalendarDateTime, parseDateProperty } from "../../src/date"

it('returns a CalendarDateTime with value type DATE-TIME', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['VALUE=DATE-TIME'],
        value: '20250729T120000Z'
    }
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('returns a CalendarDate with value type DATE', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['VALUE=DATE'],
        value: '20250729'
    }
    const result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDate)
})

it('returns a CalendarDateTime with no value type', () => {
    let property: Property = {
        name: 'DTSTART',
        params: [],
        value: '20250729T120000Z'
    }
    let result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)

    property = {
        name: 'DTSTART',
        params: ['OTHER=PARAM'],
        value: '20250729T120000Z'
    }
    result = parseDateProperty(property)
    expect(result).toBeInstanceOf(CalendarDateTime)
})

it('throws when parsing date-time as date', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['VALUE=DATE'],
        value: '20250729T120000Z'
    }
    expect(() => parseDateProperty(property)).toThrow()
})

it('throws when parsing date as date-time', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['VALUE=DATE-TIME'],
        value: '20250729'
    }
    expect(() => parseDateProperty(property)).toThrow()
})

it('ignores the property name', () => {
    const params: string[] = []
    const value: string = '20250729T120000Z'
    const properties: Property[] = [
        { name: 'DTSTART', params, value },
        { name: 'DTEND', params, value },
        { name: 'DTSTAMP', params, value },
        { name: 'CREATED', params, value },
    ]

    const parsed = properties
        .map(property => parseDateProperty(property))

    parsed.forEach(a => {
        parsed.forEach(b => {
            expect(a).toEqual(b)
        })
    })
})

it('throws if value type is illegal', () => {
    const property: Property = {
        name: 'DTSTART',
        params: ['VALUE=BINARY'],
        value: '20250729T120000Z'
    }
    expect(() => parseDateProperty(property)).toThrow()
})