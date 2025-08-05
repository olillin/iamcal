import { CalendarDate, CalendarDateTime, convertDate } from '../../src/date'

it('returns a CalendarDate object as is', () => {
    const date = new CalendarDate('2023-10-01')
    const result = convertDate(date)
    expect(result).toBe(date)
})

it('returns a CalendarDateTime object as is', () => {
    const date = new CalendarDateTime('2023-10-01T12:34:56')
    const result = convertDate(date)
    expect(result).toBe(date)
})

it('converts a Date object to CalendarDateTime by default', () => {
    const date = new Date('2023-10-01T12:34:56')
    const result = convertDate(date)
    expect(result).toBeInstanceOf(CalendarDateTime)
    expect(result.getDate()).toEqual(date)
})

it('converts a Date object to CalendarDateTime when fullDay is false', () => {
    const date = new Date('2023-10-01T12:34:56')
    const result = convertDate(date, false)
    expect(result).toBeInstanceOf(CalendarDateTime)
    expect(result.getDate()).toEqual(date)
})

it('converts a Date object to CalendarDate when fullDay is true', () => {
    const date = new Date('2023-10-01T00:00:00')
    const result = convertDate(date, true)
    expect(result).toBeInstanceOf(CalendarDate)
    expect(result.getDate()).toEqual(date)
})

it('throws if the date is invalid', () => {
    const date = new Date('Invalid Date')
    expect(() => convertDate(date)).toThrow()
})
