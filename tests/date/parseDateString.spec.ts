import { parseDateString } from '../../src/date'

it('throws if the date format is invalid', () => {
    let date = 'Invalid Date'
    expect(() => parseDateString(date)).toThrow('Date has invalid format')
    date = '2025-01-01'
    expect(() => parseDateString(date)).toThrow('Date has invalid format')
})

it("doesn't throw if the month is valid", () => {
    let date = '20250101'
    expect(() => parseDateString(date)).not.toThrow()
    date = '20251201'
    expect(() => parseDateString(date)).not.toThrow()
})

it('throws if the month is invalid', () => {
    let date = '20250001' // Invalid month 0
    expect(() => parseDateString(date)).toThrow('Date is invalid')
    date = '20251301' // Invalid month 13
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it("doesn't throw if the day is valid", () => {
    let date = '20250101'
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250131' // January has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250228' // February has 28 days in a non-leap year
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250331' // March has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250430' // April has 30 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250531' // May has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250630' // June has 30 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250731' // July has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250831' // August has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20250930' // September has 30 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20251031' // October has 31 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20251130' // November has 30 days
    expect(() => parseDateString(date)).not.toThrow()
    date = '20251231' // December has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it('throws if the day is invalid', () => {
    let date = '20250100' // Invalid day January 0
    expect(() => parseDateString(date)).toThrow('Date is invalid')
    date = '20250231' // Invalid day February 31
    expect(() => parseDateString(date)).toThrow('Date is invalid')
    date = '21000229' // Invalid leap day (2100 is not a leap year)
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it("doesn't throw for valid leap days", () => {
    let date = '20240229' // Valid leap day (2024 is a leap year)
    expect(() => parseDateString(date)).not.toThrow()
    date = '20000229' // Valid leap day (2000 is a leap year)
    expect(() => parseDateString(date)).not.toThrow()
})
