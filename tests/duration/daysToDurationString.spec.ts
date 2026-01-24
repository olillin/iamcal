import { daysToDurationString } from '../../src'

it('produces P2D for 2 days', () => {
    const duration = daysToDurationString(2)
    expect(duration).toBe('P2D')
})

it('produces P12D for 12 days', () => {
    const duration = daysToDurationString(12)
    expect(duration).toBe('P12D')
})

it('produces P0D for 0 days', () => {
    const duration = daysToDurationString(0)
    expect(duration).toBe('P0D')
})

it('can be negative', () => {
    const duration = daysToDurationString(-2)
    expect(duration).toBe('-P2D')
})

it('floors days if decimal', () => {
    const duration = daysToDurationString(1.6)
    expect(duration).toBe('P1D')
})

it('throws if days is NaN', () => {
    expect(() => {
        daysToDurationString(NaN)
    }).toThrow('Days must not be NaN')
})
