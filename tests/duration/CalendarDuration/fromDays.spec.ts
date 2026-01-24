import { CalendarDuration } from '../../../src'

it('sets days to the correct value', () => {
    const duration = CalendarDuration.fromDays(2)
    expect(duration.days).toBe(2)
})

it("doesn't convert to weeks", () => {
    const duration = CalendarDuration.fromDays(7)
    expect(duration.weeks).toBeUndefined()
    expect(duration.days).toBe(7)
})

it("doesn't set hours", () => {
    const duration = CalendarDuration.fromDays(2)
    expect(duration.hours).toBeUndefined()
})

it("doesn't set minutes", () => {
    const duration = CalendarDuration.fromDays(2)
    expect(duration.minutes).toBeUndefined()
})

it("doesn't set seconds", () => {
    const duration = CalendarDuration.fromDays(2)
    expect(duration.seconds).toBeUndefined()
})

