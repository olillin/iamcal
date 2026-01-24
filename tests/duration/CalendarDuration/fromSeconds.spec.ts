import { CalendarDuration, ONE_WEEK_SECONDS, ONE_DAY_SECONDS, ONE_HOUR_SECONDS, ONE_MINUTE_SECONDS } from '../../../src'

it('uses the largest possible units', () => {
	const duration = CalendarDuration.fromSeconds(ONE_HOUR_SECONDS + 2 * ONE_MINUTE_SECONDS + 3)
	expect(duration.seconds).toBe(3)
	expect(duration.minutes).toBe(2)
	expect(duration.hours).toBe(1)
	expect(duration.days).toBeUndefined()
	expect(duration.weeks).toBeUndefined()
})

it('can be created from 0 seconds', () => {
	const duration = CalendarDuration.fromSeconds(0)
	expect(duration.seconds).toBe(0)
	expect(duration.minutes).toBeUndefined()
	expect(duration.hours).toBeUndefined()
	expect(duration.days).toBeUndefined()
	expect(duration.weeks).toBeUndefined()
})

it("doesn't set days", () => {
	const duration = CalendarDuration.fromSeconds(2 * ONE_DAY_SECONDS)
	expect(duration.days).toBeUndefined()
	expect(duration.hours).toBe(48)
})

it("doesn't set weeks", () => {
	const duration = CalendarDuration.fromSeconds(2 * ONE_WEEK_SECONDS)
	expect(duration.weeks).toBeUndefined()
})

