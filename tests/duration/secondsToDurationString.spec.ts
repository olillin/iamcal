import { secondsToDurationString, ONE_WEEK_SECONDS, ONE_DAY_SECONDS, ONE_MINUTE_SECONDS, ONE_HOUR_SECONDS } from '../../src'

it('produces PT59S for 59 seconds', () => {
    const duration = secondsToDurationString(59)
    expect(duration).toBe('PT59S')
})

it('produces PT2M for 120 seconds', () => {
    const duration = secondsToDurationString(120)
    expect(duration).toBe('PT2M')
})

it('produces PT1H for 3600 seconds', () => {
    const duration = secondsToDurationString(3600)
    expect(duration).toBe('PT1H')
})

it('produces PT1H1M for 3660 seconds', () => {
    const duration = secondsToDurationString(3660)
    expect(duration).toBe('PT1H1M')
})

it('produces PT48H for 2 days', () => {
    const duration = secondsToDurationString(2 * ONE_DAY_SECONDS)
    expect(duration).toBe('PT48H')
})

it('produces PT0S for 0 seconds', () => {
    const duration = secondsToDurationString(0)
    expect(duration).toBe('PT0S')
})

it('produces PT1H1M1S for 3661 seconds', () => {
    const duration = secondsToDurationString(ONE_HOUR_SECONDS + ONE_MINUTE_SECONDS + 1)
    expect(duration).toBe('PT1H1M1S')
})

it('produces PT1H0M1S for 3601 seconds', () => {
    const duration = secondsToDurationString(ONE_HOUR_SECONDS + 1)
    expect(duration).toBe('PT1H0M1S')
})

it('produces PT168H for a week', () => {
    const duration = secondsToDurationString(ONE_WEEK_SECONDS)
    expect(duration).toBe('PT168H')
})

it('can be negative time', () => {
    const duration = secondsToDurationString(-3661)
    expect(duration).toBe('-PT1H1M1S')
})

it('floors seconds if decimal', () => {
    const duration = secondsToDurationString(1.6)
    expect(duration).toBe("PT1S")
})

it('throws if NaN', () => {
    expect(() => {
        secondsToDurationString(NaN)
    }).toThrow('Seconds must not be NaN')
})

