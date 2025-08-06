import { toDateTimeStringUTC } from '../../src'

it('formats date as YYYYMMSSTHHmmSSZ', () => {
    const date = new Date('2025-10-29T12:34:56.789')
    const offset = 0
    const result = toDateTimeStringUTC(date, offset)
    expect(result).toBe('20251029T123456Z')
})

it('pads numbers with zeros', () => {
    const date = new Date(2025, 1, 3, 4, 5, 6)
    const offset = 0
    const result = toDateTimeStringUTC(date, offset)
    expect(result).toBe('20250203T040506Z')
})

/** This is the example case in the documentation for {@link toDateTimeStringUTC}. */
it('offsets date with +01:00 correctly', () => {
    const date = new Date('2025-08-07T12:00:00')
    const offset = -60 // +01:00
    const result = toDateTimeStringUTC(date, offset)
    expect(result).toBe('20250807T110000Z')
})

it('offsets date with +02:00 correctly', () => {
    const date = new Date('2025-10-20T12:34:56.789')
    const offset = -120 // +02:00
    const result = toDateTimeStringUTC(date, offset)
    expect(result).toBe('20251020T103456Z')
})

it('offsets date with -03:30 correctly', () => {
    const date = new Date('2025-10-20T12:34:56.789')
    const offset = 210 // -03:30
    const result = toDateTimeStringUTC(date, offset)
    expect(result).toBe('20251020T160456Z')
})

it('throws if date is invalid', () => {
    const date = new Date('Invalid Date')
    const offset = 0
    expect(() => toDateTimeStringUTC(date, offset)).toThrow('Date is invalid')
})
