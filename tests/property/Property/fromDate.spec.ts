import { CalendarDate, CalendarDateTime, Property } from '../../../src'

describe('from CalendarDateTime', () => {
    it('returns the correct name', () => {
        const date = new CalendarDateTime('20250804T120000')
        let property = Property.fromDate('DTSTART', date)
        expect(property.name).toBe('DTSTART')

        property = Property.fromDate('CREATED', date)
        expect(property.name).toBe('CREATED')
    })

    it('returns a property with no parameters', () => {
        const date = new CalendarDateTime('20250804T120000')
        const property = Property.fromDate('DTSTART', date)
        expect(property.parameters).toStrictEqual(new Map())
    })

    it('returns a property with the value in YYYYMMDDTHHmmSS format', () => {
        const date = new CalendarDateTime('20250804T123456')
        const property = Property.fromDate('DTSTART', date)
        expect(property.value).toBe('20250804T123456')
    })
})

describe('from CalendarDate', () => {
    it('returns the correct name', () => {
        const date = new CalendarDate('20250804')
        let property = Property.fromDate('DTSTART', date)
        expect(property.name).toBe('DTSTART')

        property = Property.fromDate('CREATED', date)
        expect(property.name).toBe('CREATED')
    })

    it('returns a property with parameters VALUE=DATE', () => {
        const date = new CalendarDate('20250804')
        const property = Property.fromDate('DTSTART', date)
        expect(property.parameters).toStrictEqual(
            new Map([['VALUE', ['DATE']]])
        )
    })

    it('returns a property with the value in YYYYMMDD format', () => {
        const date = new CalendarDate('20250804')
        const property = Property.fromDate('DTSTART', date)
        expect(property.value).toBe('20250804')
    })
})
