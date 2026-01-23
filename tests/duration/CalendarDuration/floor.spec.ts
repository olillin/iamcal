import { CalendarDuration } from '../../../src/duration'

it('can floor to weeks', () => {
	const duration = new CalendarDuration("P2W")
	const floored = duration.floor("W")
	const expected = new CalendarDuration("P2W")
	expect(floored).toStrictEqual(expected)
})

it('can floor to days', () => {
	const duration = new CalendarDuration("P1DT2H3M4S")
	const floored = duration.floor("D")
	const expected = new CalendarDuration("P1D")
	expect(floored).toStrictEqual(expected)
})

it('can floor to hours', () => {
	const duration = new CalendarDuration("P1DT2H3M4S")
	const floored = duration.floor("H")
	const expected = new CalendarDuration("P1DT2H")
	expect(floored).toStrictEqual(expected)
})

it('can floor to minutes', () => {
	const duration = new CalendarDuration("P1DT2H3M4S")
	const floored = duration.floor("M")
	const expected = new CalendarDuration("P1DT2H3M")
	expect(floored).toStrictEqual(expected)
})

it('can floor to seconds', () => {
	const duration = new CalendarDuration("P1DT2H3M4S")
	const floored = duration.floor("S")
	const expected = new CalendarDuration("P1DT2H3M4S")
	expect(floored).toStrictEqual(expected)
})

it('can floor negative durations', () => {
	const duration = new CalendarDuration("-P1DT2H3M4S")
	const floored = duration.floor("H")
	const expected = new CalendarDuration("-P1DT2H")
	expect(floored).toStrictEqual(expected)
})
