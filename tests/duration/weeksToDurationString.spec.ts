import { weeksToDurationString } from '../../src'

it('produces P2W for 2 weeks', () => {
    const duration = weeksToDurationString(2)
    expect(duration).toBe('P2W')
})

it('produces P12W for 12 weeks', () => {
    const duration = weeksToDurationString(12)
    expect(duration).toBe('P12W')
})

it('produces P0W for 0 weeks', () => {
    const duration = weeksToDurationString(0)
    expect(duration).toBe('P0W')
})

it('can be negative', () => {
    const duration = weeksToDurationString(-2)
    expect(duration).toBe('-P2W')
})

it('floors weeks if decimal', () => {
    const duration = weeksToDurationString(1.6)
    expect(duration).toBe('P1W')
})

it('throws if weeks is NaN', () => {
    expect(() => {
        weeksToDurationString(NaN)
    }).toThrow('Weeks must not be NaN')
})
