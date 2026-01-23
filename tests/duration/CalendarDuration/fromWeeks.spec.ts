import { CalendarDuration } from '../../../src'

it('sets weeks to the correct value', () => {
    const duration = CalendarDuration.fromWeeks(2)
    expect(duration.weeks).toBe(2)
})

it("doesn't set days", () => {
    const duration = CalendarDuration.fromWeeks(2)
    expect(duration.days).toBeUndefined()
})

it("doesn't set hours", () => {
    const duration = CalendarDuration.fromWeeks(2)
    expect(duration.hours).toBeUndefined()
})

it("doesn't set minutes", () => {
    const duration = CalendarDuration.fromWeeks(2)
    expect(duration.minutes).toBeUndefined()
})

it("doesn't set seconds", () => {
    const duration = CalendarDuration.fromWeeks(2)
    expect(duration.seconds).toBeUndefined()
})

