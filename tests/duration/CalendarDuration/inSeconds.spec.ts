import { CalendarDuration, ONE_WEEK_SECONDS, ONE_DAY_SECONDS, ONE_HOUR_SECONDS, ONE_MINUTE_SECONDS } from '../../../src'

it('uses all units', () => {
	const duration = new CalendarDuration("P2DT3H4M5S")
	duration.weeks = 1

	const seconds = duration.inSeconds()

	const expected = ONE_WEEK_SECONDS + 2 * ONE_DAY_SECONDS + 3 * ONE_HOUR_SECONDS + 4 * ONE_MINUTE_SECONDS + 5
	expect(seconds).toBe(expected)
})

it('can be negative', () => {
	const duration = new CalendarDuration("-P2DT3H4M5S")
	duration.weeks = -1

	const seconds = duration.inSeconds()

	const expected = -1 * (ONE_WEEK_SECONDS + 2 * ONE_DAY_SECONDS + 3 * ONE_HOUR_SECONDS + 4 * ONE_MINUTE_SECONDS + 5)
	expect(seconds).toBe(expected)
})
