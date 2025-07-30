import { toTimeString } from "../../src/date"

it('formats time as HHMMSS', () => {
    const date = new Date(2025, 6, 29, 12, 34, 56, 789)
    const result = toTimeString(date)
    expect(result).toStrictEqual('123456')
})

it('pads numbers with zeros', () => {
    const date = new Date(2025, 6, 29, 1, 2, 3, 4)
    const result = toTimeString(date)
    expect(result).toStrictEqual('010203')
})

it('throws if date is invalid', () => {
    const date = new Date('invalid date')
    expect(() => toTimeString(date)).toThrow('Date is invalid')
})
