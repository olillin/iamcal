import { CalendarDate, CalendarDateTime } from '../../src/date'

describe('constructor', () => {
    it('can be created from a Date object', () => {
        const date = new Date('2025-08-04T22:00:00')
        expect(() => {
            new CalendarDateTime(date)
        }).not.toThrow()
    })

    it('can be created from a standard date string', () => {
        const date = '2025-08-04T22:00:00'
        expect(() => {
            new CalendarDateTime(date)
        }).not.toThrow()
    })

    it('can be created from a calendar date string', () => {
        const date = '20250804T220000'
        expect(() => {
            new CalendarDateTime(date)
        }).not.toThrow()
    })

    it('throws if created from invalid date string', () => {
        expect(() => {
            new CalendarDateTime('lorem ipsum')
        }).toThrow('Invalid date provided')
    })

    it('throws if created from Invalid Date object', () => {
        const date = new Date('Invalid Date')
        expect(() => {
            new CalendarDateTime(date)
        }).toThrow('Invalid date provided')
    })

    it('can be created from a CalendarDate object', () => {
        const date = new CalendarDate('20250804')
        expect(() => {
            new CalendarDateTime(date)
        }).not.toThrow()
    })

    it('can be created from a CalendarDateTime object', () => {
        const dateTime = new CalendarDateTime('20250804T220000')
        expect(() => {
            new CalendarDateTime(dateTime)
        }).not.toThrow()
    })
})

describe('toProperty', () => {
    it('returns a property with same name when name is DTSTART', () => {
        const date = new CalendarDateTime('20250804T220000')
        const property = date.toProperty('DTSTART')
        expect(property.name).toBe('DTSTART')
    })

    it('returns a property with same name when name is CREATED', () => {
        const date = new CalendarDateTime('20250804T220000')
        const property = date.toProperty('CREATED')
        expect(property.name).toBe('CREATED')
    })

    it('returns a property with no params', () => {
        const date = new CalendarDateTime('20250804T220000')
        const property = date.toProperty('DTSTART')
        expect(property.params).toHaveLength(0)
    })

    it('returns a property with the value in YYYYMMDDTHHmmSS format', () => {
        const date = new CalendarDateTime('20250804T123456')
        const property = date.toProperty('DTSTART')
        expect(property.value).toBe('20250804T123456')
    })
})

describe('getValue', () => {
    it('returns the date in YYYYMMDDTHHmmSS format', () => {
        const date = new CalendarDateTime('2025-08-04T12:34:56')
        expect(date.getValue()).toBe('20250804T123456')
    })

    it('returns same day when time is midnight', () => {
        const date = new Date('2025-08-05T00:00:00')
        const calendarDate = new CalendarDateTime(date)
        expect(calendarDate.getValue()).toBe('20250805T000000')
    })

    it('returns same day when time is one second before midnight', () => {
        const date = new Date('2025-08-04T23:59:59')
        const calendarDate = new CalendarDateTime(date)
        expect(calendarDate.getValue()).toBe('20250804T235959')
    })
})

describe('getDate', () => {
    it('returns the same date as created with', () => {
        const date = new Date('2025-08-04T12:34:56')
        const calendarDate = new CalendarDateTime(date)
        const returned = calendarDate.getDate()
        expect(returned).toEqual(date)
    })

    it('returns the same object when created with a calendar date time string or with a Date object', () => {
        const date = new Date('2025-08-04T12:34:56')
        const calendarDateA = new CalendarDateTime(date)
        const returnedA = calendarDateA.getDate()
        const calendarDateB = new CalendarDateTime('20250804T123456')
        const returnedB = calendarDateB.getDate()
        expect(returnedA).toEqual(returnedB)
    })
})

describe('isFullDay', () => {
    it('returns false', () => {
        const date = new CalendarDateTime('20250804T123456')
        expect(date.isFullDay()).toBe(false)
    })
})
