import { toDayDurationString } from '../../src'

it('produces P2D for 2 days', () => {
    const duration = toDayDurationString(2)
    expect(duration).toBe('P2D')
})

it('produces P12D for 12 days', () => {
    const duration = toDayDurationString(12)
    expect(duration).toBe('P12D')
})

it('produces P0D for 0 days', () => {
    const duration = toDayDurationString(0)
    expect(duration).toBe('P0D')
})

it('throws if days is NaN', () => {
    expect(() => {
        toDayDurationString(NaN)
    }).toThrow('Days must not be NaN')
})

it('throws if days is decimal', () => {
    expect(() => {
        toDayDurationString(1.5)
    }).toThrow('Days must be an integer')
})

it('throws if days is negative', () => {
    expect(() => {
        toDayDurationString(-2)
    }).toThrow('Days must not be negative')
})
