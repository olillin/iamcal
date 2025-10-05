import { CalendarDate, CalendarDateTime } from '../../src'

describe('constructor', () => {
    it('can be created from a Date object', () => {
        const date = new Date('2025-08-04T22:00:00')
        expect(() => {
            new CalendarDate(date)
        }).not.toThrow()
    })

    it('can be created from a standard date string', () => {
        const date = '2025-08-04T22:00:00'
        expect(() => {
            new CalendarDate(date)
        }).not.toThrow()
    })

    it('can be created from a calendar date string', () => {
        const date = '20250804'
        expect(() => {
            new CalendarDate(date)
        }).not.toThrow()
    })

    it('throws if created from invalid date string', () => {
        expect(() => {
            new CalendarDate('lorem ipsum')
        }).toThrow('Invalid date provided')
    })

    it('throws if created from Invalid Date object', () => {
        const date = new Date('Invalid Date')
        expect(() => {
            new CalendarDate(date)
        }).toThrow('Invalid date provided')
    })

    it('can be created from a CalendarDate object', () => {
        const date = new CalendarDate('20250804')
        expect(() => {
            new CalendarDate(date)
        }).not.toThrow()
    })

    it('can be created from a CalendarDateTime object', () => {
        const dateTime = new CalendarDateTime('20250804T220000')
        expect(() => {
            new CalendarDate(dateTime)
        }).not.toThrow()
    })
})

describe('toProperty', () => {
    it('returns a property with same name when name is DTSTART', () => {
        const date = new CalendarDate('20250804')
        const property = date.toProperty('DTSTART')
        expect(property.name).toBe('DTSTART')
    })

    it('returns a property with same name when name is CREATED', () => {
        const date = new CalendarDate('20250804')
        const property = date.toProperty('CREATED')
        expect(property.name).toBe('CREATED')
    })

    it('returns a property with value type DATE', () => {
        const date = new CalendarDate('20250804')
        const property = date.toProperty('DTSTART')
        expect(property.parameters.get('VALUE')).toStrictEqual(['DATE'])
    })

    it('returns a property with the value in YYYYMMDD format', () => {
        const date = new CalendarDate('20250804')
        const property = date.toProperty('DTSTART')
        expect(property.value).toBe('20250804')
    })
})

describe('getValue', () => {
    it('returns the date in YYYYMMDD format', () => {
        const date = new CalendarDate('20250804')
        expect(date.getValue()).toBe('20250804')
    })

    it('returns same day when time is midnight', () => {
        const date = new Date('2025-08-05T00:00:00')
        const calendarDate = new CalendarDate(date)
        expect(calendarDate.getValue()).toBe('20250805')
    })

    it('returns same day when time is one second before midnight', () => {
        const date = new Date('2025-08-04T23:59:59')
        const calendarDate = new CalendarDate(date)
        expect(calendarDate.getValue()).toBe('20250804')
    })
})

describe('getDate', () => {
    it('removes the time from the date', () => {
        const date = new Date('2025-08-04T22:00:00')
        const calendarDate = new CalendarDate(date)
        const returned = calendarDate.getDate()
        const expected = new Date('2025-08-04T00:00:00')
        expect(returned).toStrictEqual(expected)
    })

    it('returns the same object when created with a calendar date string', () => {
        const date = new Date('2025-08-04T22:00:00')
        const calendarDateA = new CalendarDate(date)
        const returnedA = calendarDateA.getDate()
        const calendarDateB = new CalendarDate('20250804')
        const returnedB = calendarDateB.getDate()
        expect(returnedA).toStrictEqual(returnedB)
    })
})

describe('isFullDay', () => {
    it('returns true', () => {
        const date = new CalendarDate('20250804')
        expect(date.isFullDay()).toBe(true)
    })
})
