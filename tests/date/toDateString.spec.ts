import { toDateString } from '../../src/date'

it('formats date as YYYYMMSS', () => {
    const date = new Date(2025, 9, 29, 12, 34, 56, 789)
    const result = toDateString(date)
    expect(result).toBe('20251029')
})

it('pads numbers with zeros', () => {
    const date = new Date('0001-02-03T12:34:56.789')
    const result = toDateString(date)
    expect(result).toBe('00010203')
})

it('throws if date is invalid', () => {
    const date = new Date('invalid date')
    expect(() => toDateString(date)).toThrow('Date is invalid')
})
