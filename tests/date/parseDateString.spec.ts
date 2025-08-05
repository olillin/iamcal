import { parseDateString } from '../../src/date'

it('throws if the date format is invalid', () => {
    const date = 'Invalid Date'
    expect(() => parseDateString(date)).toThrow('Date has invalid format')
})

it('throws if the date format is not YYYYMMDD', () => {
    const date = '2025-01-01'
    expect(() => parseDateString(date)).toThrow('Date has invalid format')
})

it("doesn't throw if the month is January", () => {
    const date = '20250101'
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw if the month is December", () => {
    const date = '20251201'
    expect(() => parseDateString(date)).not.toThrow()
})

it('throws if the month is 0', () => {
    const date = '20250001' // Invalid month 0
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it('throws if the month is 13', () => {
    const date = '20251301' // Invalid month 13
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it("doesn't throw if the day is the 1st", () => {
    const date = '20250101'
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of January", () => {
    const date = '20250131' // January has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of February not during a leap year", () => {
    const date = '20250228' // February has 28 days in a non-leap year
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of March", () => {
    const date = '20250331' // March has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of April", () => {
    const date = '20250430' // April has 30 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of May", () => {
    const date = '20250531' // May has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of June", () => {
    const date = '20250630' // June has 30 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of July", () => {
    const date = '20250731' // July has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of August", () => {
    const date = '20250831' // August has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of September", () => {
    const date = '20250930' // September has 30 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of October", () => {
    const date = '20251031' // October has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of November", () => {
    const date = '20251130' // November has 30 days
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw on the last day of December", () => {
    const date = '20251231' // December has 31 days
    expect(() => parseDateString(date)).not.toThrow()
})

it('throws if the day is 0', () => {
    const date = '20250100' // Invalid day January 0
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it('throws if the day is after the end of the month', () => {
    const date = '20250231' // Invalid day February 31
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it('throws if the day is an invalid leap day (year divisible by 100)', () => {
    const date = '21000229' // Invalid leap day (2100 is not a leap year)
    expect(() => parseDateString(date)).toThrow('Date is invalid')
})

it("doesn't throw for valid leap days (year divisible by 4)", () => {
    const date = '20240229' // Valid leap day (2024 is a leap year)
    expect(() => parseDateString(date)).not.toThrow()
})

it("doesn't throw for valid leap days (year divisible by 400)", () => {
    const date = '20000229' // Valid leap day (2000 is a leap year)
    expect(() => parseDateString(date)).not.toThrow()
})
