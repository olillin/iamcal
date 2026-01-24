import { formatDurationString } from '../../src'

it('correctly formats a duration with days and time', () => {
    const value = formatDurationString(undefined, 1, 2, 3, 4)
    const expected = 'P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('correctly formats a duration with hours and minutes', () => {
    const value = formatDurationString(undefined, undefined, 2, 5, undefined)
    const expected = 'PT2H5M'
    expect(value).toBe(expected)
})

it('correctly formats just days', () => {
    const value = formatDurationString(undefined, 2, undefined, undefined, undefined)
    const expected = 'P2D'
    expect(value).toBe(expected)
})

it('correctly serializes just weeks', () => {
    const value = formatDurationString(2, undefined, undefined, undefined, undefined)
    const expected = 'P2W'
    expect(value).toBe(expected)
})

it('prefixes with - if weeks is negative', () => {
    const value = formatDurationString(-2, undefined, undefined, undefined, undefined)
    const expected = '-P2W'
    expect(value).toBe(expected)
})

it('prefixes with - if days is negative', () => {
    const value = formatDurationString(undefined, -1, 2, 3, 4)
    const expected = '-P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('prefixes with - if hours is negative', () => {
    const value = formatDurationString(undefined, 1, -2, 3, 4)
    const expected = '-P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('prefixes with - if minutes is negative', () => {
    const value = formatDurationString(undefined, 1, 2, -3, 4)
    const expected = '-P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('prefixes with - if seconds is negative', () => {
    const value = formatDurationString(undefined, 1, 2, 3, -4)
    const expected = '-P1DT2H3M4S'
    expect(value).toBe(expected)
})

it('does not skip minutes', () => {
    const value = formatDurationString(undefined, undefined, 2, undefined, 1)
    const expected = 'PT2H0M1S'
    expect(value).toBe(expected)
})

it('does not remove units when 0', () => {
    const value = formatDurationString(undefined, 0, 0, 0, 0)
    const expected = 'P0DT0H0M0S'
    expect(value).toBe(expected)
})

it('does not remove weeks when 0', () => {
    const value = formatDurationString(0, undefined, undefined, undefined, undefined)
    const expected = 'P0W'
    expect(value).toBe(expected)
})

it('does not convert units', () => {
    const value = formatDurationString(undefined, undefined, 24, 60, 60)
    const expected = 'PT24H60M60S'
    expect(value).toBe(expected)
})

it('does not convert days to weeks', () => {
    const value = formatDurationString(undefined, 7, undefined, undefined, undefined)
    const expected = 'P7D'
    expect(value).toBe(expected)
})

it('throws if all units are undefined', () => {
    expect(() => {
        formatDurationString(undefined, undefined, undefined, undefined, undefined)
    }).toThrow("Duration string must not be empty")
})

it('throws if combining weeks with days', () => {
    expect(() => {
        formatDurationString(1, 1, undefined, undefined, undefined)
    }).toThrow("Cannot combine weeks with other units in duration string")
})

it('throws if combining weeks with hours', () => {
    expect(() => {
        formatDurationString(1, undefined, 1, undefined, undefined)
    }).toThrow("Cannot combine weeks with other units in duration string")
})

it('throws if combining weeks with minutes', () => {
    expect(() => {
        formatDurationString(1, undefined, undefined, 1, undefined)
    }).toThrow("Cannot combine weeks with other units in duration string")
})

it('throws if combining weeks with seconds', () => {
    expect(() => {
        formatDurationString(1, undefined, undefined, undefined, 1)
    }).toThrow("Cannot combine weeks with other units in duration string")
})

