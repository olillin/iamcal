import { CalendarDuration,  } from '../../../src'

it('correctly serializes a complete duration', () => {
    const durationString = 'P1DT2H3M4S'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('correctly serializes a partial duration', () => {
    const durationString = 'PT2H5M'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('correctly serializes just days', () => {
    const durationString = 'P2D'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('correctly serializes just weeks', () => {
    const durationString = 'P2W'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('does not prefix with +', () => {
    const duration = new CalendarDuration('+P1DT2H3M4S')
    const value = duration.getValue()

    const expected = 'P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('prefixes with - if negative', () => {
    const durationString = '-P1DT2H3M4S'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('does not skip minutes', () => {
    const durationString = 'PT2H0M1S'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('creates PT0S for zero seconds', () => {
    const durationString = 'PT0S'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('does not convert units', () => {
    const durationString = 'PT24H60M60S'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

it('does not convert days to weeks', () => {
    const durationString = 'P7D'
    const duration = new CalendarDuration(durationString)

    const value = duration.getValue()

    const expected = durationString
    expect(value).toBe(expected)
})

