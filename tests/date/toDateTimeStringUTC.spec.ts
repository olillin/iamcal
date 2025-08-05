import { toDateTimeStringUTC } from '../../src/date'

it('formats date as YYYYMMSSTHHmmSSZ', () => {
    const date = new Date('2025-10-29T12:34:56.789Z')
    const result = toDateTimeStringUTC(date)
    expect(result).toBe('20251029T123456Z')
})

it('pads numbers with zeros', () => {
    const date = new Date('2025-02-03T04:05:06.007Z')
    const result = toDateTimeStringUTC(date)
    expect(result).toBe('20250203T040506Z')
})

it('offsets date with +02:00 correctly', () => {
    const date = new Date('2025-10-20T12:34:56.789+02:00')
    const result = toDateTimeStringUTC(date)
    expect(result).toBe('20251020T103456Z')
})

it('offsets date with -03:30 correctly', () => {
    const date = new Date('2025-10-20T12:34:56.789-03:30')
    const result = toDateTimeStringUTC(date)
    expect(result).toBe('20251020T160456Z')
})

it('throws if date is invalid', () => {
    const date = new Date('invalid date')
    expect(() => toDateTimeStringUTC(date)).toThrow('Date is invalid')
})
