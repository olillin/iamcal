import { toDateTimeString } from '../../src'

it('formats date as YYYYMMSSTHHmmSS', () => {
    const date = new Date(2025, 9, 29, 12, 34, 56, 789)
    const result = toDateTimeString(date)
    expect(result).toBe('20251029T123456')
})

it('pads numbers with zeros', () => {
    const date = new Date('0001-02-03T04:05:06.007')
    const result = toDateTimeString(date)
    expect(result).toBe('00010203T040506')
})

it('throws if date is invalid', () => {
    const date = new Date('invalid date')
    expect(() => toDateTimeString(date)).toThrow('Date is invalid')
})
