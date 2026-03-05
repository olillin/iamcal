import { TimeZone } from '../../../src/components/TimeZone'

let result: TimeZone
beforeAll(() => {
	result = TimeZone.fromName('Europe/London')
})

it('has the correct name', () => {
	expect(result.getId()).toBe('Europe/London')
})

it('has 1 standard time offset', () => {
	expect(result.getStandardOffsets()).toHaveLength(1)
})

it('has 1 daylight savings time offset', () => {
	expect(result.getDaylightOffsets()).toHaveLength(1)
})

