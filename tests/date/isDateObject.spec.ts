import { CalendarDate, isDateObject } from '../../src'

it('returns true for a valid Date object', () => {
    const maybeDate = new Date('2025-07-08T12:00:00Z')
    const result = isDateObject(maybeDate)
    expect(result).toBeTruthy()
})

it('returns true for an invalid Date object', () => {
    const maybeDate = new Date(NaN)
    const result = isDateObject(maybeDate)
    expect(result).toBeTruthy()
})

it('returns false for a CalendarDate object', () => {
    const maybeDate = new CalendarDate('2025-07-08T12:00:00Z')
    const result = isDateObject(maybeDate)
    expect(result).toBeFalsy()
})

it('returns false for a number', () => {
    const maybeDate = 5
    const result = isDateObject(maybeDate)
    expect(result).toBeFalsy()
})

it('returns false for null', () => {
    const maybeDate = null
    const result = isDateObject(maybeDate)
    expect(result).toBeFalsy()
})

it('returns false for undefined', () => {
    const maybeDate = undefined
    const result = isDateObject(maybeDate)
    expect(result).toBeFalsy()
})
