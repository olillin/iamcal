import { CalendarDuration, ONE_WEEK_SECONDS } from '../../../src'

it("doesn't set weeks", () => {
	const duration = CalendarDuration.fromSeconds(2 * ONE_WEEK_SECONDS)
	expect(duration.weeks).toBeUndefined()
})
