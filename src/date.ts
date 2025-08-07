import * as patterns from './patterns'
import { getPropertyValueType, type Property } from './property'

export const ONE_SECOND_MS = 1000
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS
export const ONE_DAY_MS = 24 * ONE_HOUR_MS

export interface CalendarDateOrTime {
    /**
     * Create a property from this date.
     * @param name The name of the property.
     */
    toProperty(name: string): Property

    /**
     * Get the string value of this date.
     * @returns An iCalendar date or date-time string.
     */
    getValue(): string

    /**
     * Get the date value of this date. For {@link CalendarDate} this is the
     * time at the start of the day.
     * @returns The date value of this date.
     */
    getDate(): Date

    /**
     * Check if this date represents a full day, as opposed to a date-time.
     * @returns `true` if this object is a {@link CalendarDate}.
     */
    isFullDay(): boolean
}

/**
 * Represents a DATE value as defined by RFC5545.
 * This is a date without a time, representing a whole day.
 */
export class CalendarDate implements CalendarDateOrTime {
    private date: Date

    constructor(date: Date | string | CalendarDateOrTime) {
        if (typeof date === 'object') {
            if (isDateObject(date)) {
                this.date = date
            } else {
                this.date = (date as CalendarDateOrTime).getDate()
            }
        } else {
            try {
                this.date = parseDateString(date)
            } catch {
                this.date = new Date(date)
            }
        }

        if (!this.date || isNaN(this.date.getTime())) {
            throw new Error('Invalid date provided')
        }

        this.date.setHours(0, 0, 0, 0)
    }

    toProperty(name: string): Property {
        return {
            name,
            params: ['VALUE=DATE'],
            value: this.getValue(),
        }
    }

    getValue(): string {
        return toDateString(this.date)
    }

    getDate(): Date {
        return new Date(this.date)
    }

    isFullDay(): boolean {
        return true
    }
}

export class CalendarDateTime implements CalendarDateOrTime {
    private date: Date

    constructor(date: Date | string | CalendarDateOrTime) {
        if (typeof date === 'object') {
            if (isDateObject(date)) {
                this.date = date
            } else {
                this.date = (date as CalendarDateOrTime).getDate()
            }
        } else {
            try {
                this.date = parseDateTimeString(date)
            } catch {
                this.date = new Date(date)
            }
        }

        if (!this.date || isNaN(this.date.getTime())) {
            throw new Error('Invalid date provided')
        }
    }

    toProperty(name: string): Property {
        return {
            name,
            params: [],
            value: this.getValue(),
        }
    }

    getValue(): string {
        return toDateTimeString(this.date)
    }

    getDate(): Date {
        return new Date(this.date)
    }

    isFullDay(): boolean {
        return false
    }
}

/**
 * Check if an object is a JavaScript `Date`.
 * @param maybeDate The object to check.
 * @returns `true` if the object is a `Date`, `false` otherwise.
 */
export function isDateObject(maybeDate: unknown): maybeDate is Date {
    return Object.prototype.toString.call(maybeDate) === '[object Date]'
}

/**
 * Pad a number with leading zeros.
 * @param num The number to pad with zeros.
 * @param length How many digits the resulting string should have.
 * @returns The padded string.
 * @throws If the digits of `num` is greater than `length`.
 * @throws If `num` is NaN, a decimal or negative.
 * @throws If `length` is not NaN, a decimal or less than 1.
 */
export function padZeros(num: number, length: number): string {
    if (isNaN(num)) throw new Error('Number must not be NaN')
    if (isNaN(length)) throw new Error('Length must not be NaN')
    if (num < 0) throw new Error('Number must not be negative')
    if (length <= 0) throw new Error('Length must not be less than 1')
    if (num % 1 !== 0) throw new Error('Number must be an integer')
    if (length % 1 !== 0) throw new Error('Length must be an integer')

    const digits = Math.floor(Math.log10(num)) + 1
    if (num !== 0 && digits > length)
        throw new Error('Number must not have more digits than length')

    return String(num).padStart(length, '0')
}

/**
 * Pad zeros for the year component of a date string.
 * @param year The year, should be positive.
 * @returns The 4-digit padded year.
 */
export function padYear(year: number): string {
    return padZeros(year, 4)
}

/**
 * Pad zeros for the month component of a date string.
 * @param month The month, should be between 1 and 12.
 * @returns The 2-digit padded month.
 */
export function padMonth(month: number): string {
    return padZeros(month, 2)
}

/**
 * Pad zeros for the day component of a date string.
 * @param day The day, should be between 1 and 31.
 * @returns The 2-digit padded day.
 */
export function padDay(day: number): string {
    return padZeros(day, 2)
}

/**
 * Pad zeros for the hours component of a time string.
 * @param hours The hours, should be between 0 and 23.
 * @returns The 2-digit padded hours.
 */
export function padHours(hours: number): string {
    return padZeros(hours, 2)
}

/**
 * Pad zeros for the minutes component of a time string.
 * @param minutes The minutes, should be between 0 and 59.
 * @returns The 2-digit padded minutes.
 */
export function padMinutes(minutes: number): string {
    return padZeros(minutes, 2)
}

/**
 * Pad zeros for the seconds component of a time string.
 * @param seconds The seconds, should be between 0 and 59.
 * @returns The 2-digit padded seconds.
 */
export function padSeconds(seconds: number): string {
    return padZeros(seconds, 2)
}

/**
 * Parse a date property into a {@link CalendarDateOrTime}.
 * @param dateProperty The property to parse.
 * @param defaultType The default value type to be used if the property does not have an explicit value type.
 * @returns The parsed date as a {@link CalendarDateOrTime}.
 * @throws If the value is invalid for the value type.
 * @throws If the value type is not `DATE-TIME` or `DATE`.
 */
export function parseDateProperty(
    dateProperty: Property,
    defaultType: 'DATE-TIME' | 'DATE' = 'DATE-TIME'
): CalendarDateOrTime {
    const value = dateProperty.value
    const valueType = getPropertyValueType(dateProperty, defaultType)

    if (valueType === 'DATE-TIME') {
        return new CalendarDateTime(value)
    } else if (valueType === 'DATE') {
        return new CalendarDate(value)
    } else {
        throw new Error(`Illegal value type for date '${valueType}'`)
    }
}

/**
 * Format a date as an iCalendar compatible time string. The day of the date is
 * ignored.
 * @param date The date to convert to a time string.
 * @returns The time of the date formatted according to the iCalendar specification.
 * @throws If the date is invalid.
 */
export function toTimeString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${padHours(date.getHours())}${padMinutes(date.getMinutes())}${padSeconds(date.getSeconds())}`
}

/**
 * Format a date as an iCalendar compatible date string.
 * @param date The date to convert to a date string.
 * @returns A date string formatted according to the iCalendar specification.
 * @throws If the date is invalid.
 */
export function toDateString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${padYear(date.getFullYear())}${padMonth(date.getMonth() + 1)}${padDay(date.getDate())}`
}

/**
 * Format a date as an iCalendar compatible date-time string.
 * @param date The date to convert to a date-time string.
 * @returns A date-time string formatted according to the iCalendar specification.
 * @throws If the date is invalid.
 */
export function toDateTimeString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${toDateString(date)}T${toTimeString(date)}`
}

/**
 * Format a date as an iCalendar compatible date-time string. Offsets the date
 * to UTC using `timeZoneOffset`.
 * @param date The date in local time to convert to UTC and a date-time string.
 * @param timeZoneOffset The timezone offset in minutes.
 * @returns A UTC date-time string formatted according to the iCalendar specification.
 * @throws If the date is invalid.
 * @throws If the offset is invalid.
 * @example
 * // The timezone offset for CET (Central European Time)
 * const timeZoneOffsetCET = -60 // +01:00
 * const date = new Date('2025-08-07T12:00:00') // The time in CET
 * // Returns "20250807T110000Z"
 * const utcDate = toDateTimeStringUTC(date, timeZoneOffsetCET)
 */
export function toDateTimeStringUTC(
    date: Date,
    timeZoneOffset: number
): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    if (isNaN(timeZoneOffset)) throw new Error('Time zone offset cannot be NaN')
    const utcDate = new Date(date.getTime() + timeZoneOffset * ONE_MINUTE_MS)
    return `${toDateString(utcDate)}T${toTimeString(utcDate)}Z`
}

/**
 * Parse a date-time string to a `Date`.
 * @param dateTime A date-time string formatted according to the iCalendar specification.
 * @returns The parsed date-time.
 * @throws If the date is invalid.
 */
export function parseDateTimeString(dateTime: string): Date {
    if (!patterns.valueTypeDateTime.test(dateTime)) {
        throw new Error('Date-time has invalid format')
    }

    const year = parseInt(dateTime.substring(0, 4))
    const monthIndex = parseInt(dateTime.substring(4, 6)) - 1
    const day = parseInt(dateTime.substring(6, 8))

    if (monthIndex < 0 || monthIndex > 11) {
        throw new Error('Date-time is invalid')
    }
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    if (day < 1 || day > daysInMonth) {
        throw new Error('Date-time is invalid')
    }

    const hours = parseInt(dateTime.substring(9, 11))
    if (hours < 0 || hours > 23) {
        throw new Error('Date-time is invalid')
    }
    const minutes = parseInt(dateTime.substring(11, 13))
    if (minutes < 0 || minutes > 59) {
        throw new Error('Date-time is invalid')
    }
    const seconds = parseInt(dateTime.substring(13, 15))
    if (seconds < 0 || seconds > 59) {
        throw new Error('Date-time is invalid')
    }

    if (dateTime.endsWith('Z')) {
        const time = Date.UTC(year, monthIndex, day, hours, minutes, seconds)
        return new Date(time)
    } else {
        const parsedDate = new Date(
            year,
            monthIndex,
            day,
            hours,
            minutes,
            seconds
        )
        return parsedDate
    }
}

/**
 * Parse a date string to a `Date`.
 * @param date A date-time string formatted according to the iCalendar specification.
 * @returns The parsed date.
 * @throws If the date is invalid.
 */
export function parseDateString(date: string): Date {
    if (!patterns.matchesWholeString(patterns.valueTypeDate, date)) {
        throw new Error('Date has invalid format')
    }

    const year = parseInt(date.substring(0, 4))
    const monthIndex = parseInt(date.substring(4, 6)) - 1
    const day = parseInt(date.substring(6, 8))

    if (monthIndex < 0 || monthIndex > 11) {
        throw new Error('Date is invalid')
    }
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    if (day < 1 || day > daysInMonth) {
        throw new Error('Date is invalid')
    }

    const parsedDate = new Date(year, monthIndex, day)
    return parsedDate
}

/**
 * Convert `Date` objects to a {@link CalendarDateOrTime} object or return as
 * is if `date` is already a {@link CalendarDateOrTime}.
 * @param date The date object to convert.
 * @param fullDay If `true`, a `Date` object is converted to {@link CalendarDate}, otherwise `Date` is converted to {@link CalendarDateTime}.
 * @returns A {@link CalendarDateOrTime} as described above.
 */
export function convertDate<T extends CalendarDateOrTime>(
    date: Date | T,
    fullDay?: false
): T | CalendarDateTime
export function convertDate<T extends CalendarDateOrTime>(
    date: Date | T,
    fullDay: true
): T | CalendarDate
export function convertDate(
    date: Date | CalendarDateOrTime,
    fullDay: boolean = false
): CalendarDateOrTime {
    if (isDateObject(date)) {
        if (fullDay) return new CalendarDate(date)
        else return new CalendarDateTime(date)
    } else {
        return date as CalendarDateOrTime
    }
}
