import { CalendarDuration, ONE_WEEK_SECONDS, ONE_DAY_SECONDS, ONE_HOUR_SECONDS, ONE_MINUTE_SECONDS, ONE_SECOND_MS } from '../../../src'

it('uses all units', () => {
	const duration = new CalendarDuration("P2DT3H4M5S")
	duration.weeks = 1

	const ms = duration.inMilliseconds()

	const expected = ONE_SECOND_MS * (ONE_WEEK_SECONDS + 2 * ONE_DAY_SECONDS + 3 * ONE_HOUR_SECONDS + 4 * ONE_MINUTE_SECONDS + 5)
	expect(ms).toBe(expected)
})

