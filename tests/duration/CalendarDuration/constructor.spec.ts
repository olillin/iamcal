import { CalendarDuration,  } from '../../../src'

it('can be created from a complete duration string', () => {
    const duration = new CalendarDuration('P1DT2H3M4S')
    expect(duration.days).toBe(1)
    expect(duration.hours).toBe(2)
    expect(duration.minutes).toBe(3)
    expect(duration.seconds).toBe(4)
})

it('can be created from a partial duration string', () => {
    const duration = new CalendarDuration('PT2H5M')
    expect(duration.days).toBeUndefined()
    expect(duration.hours).toBe(2)
    expect(duration.minutes).toBe(5)
    expect(duration.seconds).toBeUndefined()
})

it('can be created from another CalendarDuration', () => {
    const base = new CalendarDuration('P2DT3H4M')
    const copy = new CalendarDuration(base)
    expect(copy).toStrictEqual(base)
})

it('can be prefixed with +', () => {
    const duration = new CalendarDuration('+P1DT2H3M4S')
    expect(duration.days).toBe(1)
    expect(duration.hours).toBe(2)
    expect(duration.minutes).toBe(3)
    expect(duration.seconds).toBe(4)
})

it('can be negative', () => {
    const duration = new CalendarDuration('-P1DT2H3M4S')
    expect(duration.days).toBe(-1)
    expect(duration.hours).toBe(-2)
    expect(duration.minutes).toBe(-3)
    expect(duration.seconds).toBe(-4)
})

it('cannot be created from an empty duration string', () => {
    expect(() => {
    new CalendarDuration('P')
    }).toThrow()
})

it('cannot omit minutes', () => {
    expect(() => {
        new CalendarDuration('PT1H1S')
    }).toThrow()
})
