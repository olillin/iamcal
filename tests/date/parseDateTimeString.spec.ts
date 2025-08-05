import { parseDateTimeString } from '../../src/date'

it('throws if the date is invalid', () => {
    const date = 'Invalid Date'
    expect(() => parseDateTimeString(date)).toThrow(
        'Date-time has invalid format'
    )
})

it('throws if the date-time format is invalid', () => {
    const date = '2025-01-01T12:34:56'
    expect(() => parseDateTimeString(date)).toThrow(
        'Date-time has invalid format'
    )
})

describe('dates', () => {
    it("doesn't throw if the month is January", () => {
        const date = '20250101T000000'
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw if the month is December", () => {
        const date = '20251201T123456'
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it('throws if the month is 0', () => {
        const date = '20250001T123456' // Invalid month 0
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it('throws if the month is 13', () => {
        const date = '20251301T123456' // Invalid month 13
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it("doesn't throw if the day is the 1st", () => {
        const date = '20250101T123456'
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of January", () => {
        const date = '20250131T123456' // January has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of February not during a leap year", () => {
        const date = '20250228T123456' // February has 28 days in a non-leap year
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of March", () => {
        const date = '20250331' // March has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of April", () => {
        const date = '20250430T123456' // April has 30 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of May", () => {
        const date = '20250531T123456' // May has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of June", () => {
        const date = '20250630T123456' // June has 30 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of July", () => {
        const date = '20250731T123456' // July has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of August", () => {
        const date = '20250831T123456' // August has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of September", () => {
        const date = '20250930T123456' // September has 30 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of October", () => {
        const date = '20251031T123456' // October has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of November", () => {
        const date = '20251130T123456' // November has 30 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw on the last day of December", () => {
        const date = '20251231T123456' // December has 31 days
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it('throws if the day is 0', () => {
        const date = '20250100T123456' // Invalid day January 0
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it('throws if the day is after the end of the month', () => {
        const date = '20250231T123456' // Invalid day February 31
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it('throws if the day is an invalid leap day (year divisible by 100)', () => {
        const date = '21000229T123456' // Invalid leap day (2100 is not a leap year)
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it("doesn't throw for valid leap days (year divisible by 4)", () => {
        const date = '20240229T123456' // Valid leap day (2024 is a leap year)
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it("doesn't throw for valid leap days (year divisible by 400)", () => {
        const date = '20000229T123456' // Valid leap day (2000 is a leap year)
        expect(() => parseDateTimeString(date)).not.toThrow()
    })
})

describe('times', () => {
    it("doesn't throw if hours is 0", () => {
        const date = '20250101T000000'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it("doesn't throw if hours is 23", () => {
        const date = '20250101T230000'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it('throws if hours is 24', () => {
        const date = '20250101T240000' // Invalid hour 24
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it("doesn't throw if minutes is 0", () => {
        const date = '20250101T000000'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it("doesn't throw if minutes is 59", () => {
        const date = '20250101T005900'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it('throws if minutes is 60', () => {
        const date = '20250101T126000' // Invalid minutes 60
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it("doesn't throw seconds is 0", () => {
        const date = '20250101T000000'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it("doesn't throw if seconds is 59", () => {
        const date = '20250101T000059'
        expect(() => parseDateTimeString(date)).not.toThrow(
            'Date-time is invalid'
        )
    })

    it('throws if seconds is 60', () => {
        // Leap seconds are not supported
        const date = '20250101T120060' // Invalid seconds 60
        expect(() => parseDateTimeString(date)).toThrow('Date-time is invalid')
    })

    it('milliseconds should be 0', () => {
        const date = '20250101T123456'
        const parsedDate = parseDateTimeString(date)
        expect(parsedDate.getMilliseconds()).toBe(0)
    })

    it('milliseconds should be 0 when Z is used', () => {
        const date = '20250101T123456Z'
        const parsedDate = parseDateTimeString(date)
        expect(parsedDate.getMilliseconds()).toBe(0)
    })
})

describe('timezone handling', () => {
    it('accepts a date-time string with Z', () => {
        const date = '20250101T123456Z'
        expect(() => parseDateTimeString(date)).not.toThrow()
    })

    it('ignores timezone offset for local time date-times', () => {
        const date = '20250102T123456'
        const parsedDate = parseDateTimeString(date)
        expect(parsedDate).toEqual(new Date('2025-01-02T12:34:56'))
    })

    it('offsets by timezone offset for UTC date-times', () => {
        const date = '20250102T123456Z' // Ends with Z, indicating UTC
        const parsedDate = parseDateTimeString(date)
        expect(parsedDate).toEqual(new Date('2025-01-02T12:34:56.000Z'))
    })
})
