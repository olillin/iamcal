import { CalendarDuration, ONE_WEEK_SECONDS } from '../../src'

describe('constructor', () => {
    it('can be created from a valid duration string', () => {
        expect(() => {
            new CalendarDuration('P2DT3H4M')
        }).not.toThrow()
    })

    it('can be created from another CalendarDuration', () => {
        const base = new CalendarDuration('P2DT3H4M')
        expect(() => {
            new CalendarDuration(base)
        }).not.toThrow()
    })
})

describe('fromWeeks', () => {
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
})

describe('fromSeconds', () => {
    it("doesn't set weeks", () => {
        const duration = CalendarDuration.fromSeconds(2 * ONE_WEEK_SECONDS)
        expect(duration.weeks).toBeUndefined()
    })
})
