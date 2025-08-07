import { toWeekDurationString } from '../../src'

it('produces P2W for 2 weeks', () => {
    const duration = toWeekDurationString(2)
    expect(duration).toBe('P2W')
})

it('produces P12W for 12 weeks', () => {
    const duration = toWeekDurationString(12)
    expect(duration).toBe('P12W')
})

it('produces P0W for 0 weeks', () => {
    const duration = toWeekDurationString(0)
    expect(duration).toBe('P0W')
})

it('throws if weeks is NaN', () => {
    expect(() => {
        toWeekDurationString(NaN)
    }).toThrow('Weeks must not be NaN')
})

it('throws if weeks is decimal', () => {
    expect(() => {
        toWeekDurationString(1.5)
    }).toThrow('Weeks must be an integer')
})

it('throws if weeks is negative', () => {
    expect(() => {
        toWeekDurationString(-2)
    }).toThrow('Weeks must not be negative')
})
