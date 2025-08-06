import * as patterns from './patterns'
import { getPropertyValueType, type Property } from './property'

export const ONE_SECOND_MS = 1000
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS
export const ONE_DAY_MS = 24 * ONE_HOUR_MS

export interface ICalendarDate {
    /**
     * Create a property from this date.
     * @param name The name of the property.
     */
    toProperty(name: string): Property

    /**
     * Get the string value of this date.
     * @returns An RFC5545 compliant date or date-time string.
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
export class CalendarDate implements ICalendarDate {
    private date: Date

    constructor(date: Date | string | ICalendarDate) {
        if (typeof date === 'object') {
            if (Object.prototype.toString.call(date) === '[object Date]') {
                this.date = date as Date
            } else {
                this.date = (date as ICalendarDate).getDate()
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

export class CalendarDateTime implements ICalendarDate {
    private date: Date

    constructor(date: Date | string | ICalendarDate) {
        if (typeof date === 'object') {
            if (Object.prototype.toString.call(date) === '[object Date]') {
                this.date = date as Date
            } else {
                this.date = (date as ICalendarDate).getDate()
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

export function padZeros(num: number, length: number): string {
    if (num < 0) throw new Error('Number must not be negative')
    if (length <= 0) throw new Error('Length must not be less than 1')
    if (num % 1 !== 0) throw new Error('Number must be an integer')
    if (length % 1 !== 0) throw new Error('Length must be an integer')

    const digits = Math.floor(Math.log10(num)) + 1
    if (num !== 0 && digits > length)
        throw new Error('Number must not have more digits than length')

    return String(num).padStart(length, '0')
}
export function padYear(year: number): string {
    return padZeros(year, 4)
}
export function padMonth(month: number): string {
    return padZeros(month, 2)
}
export function padDay(day: number): string {
    return padZeros(day, 2)
}
export function padHours(hours: number): string {
    return padZeros(hours, 2)
}
export function padMinutes(minutes: number): string {
    return padZeros(minutes, 2)
}
export function padSeconds(seconds: number): string {
    return padZeros(seconds, 2)
}

export function parseDateProperty(
    dateProperty: Property,
    defaultType: 'DATE-TIME' | 'DATE' = 'DATE-TIME'
): ICalendarDate {
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

export function toTimeString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${padHours(date.getHours())}${padMinutes(date.getMinutes())}${padSeconds(date.getSeconds())}`
}

export function toDateString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${padYear(date.getFullYear())}${padMonth(date.getMonth() + 1)}${padDay(date.getDate())}`
}

/**
 * Format a date as an RFC5545 compliant date-time string.
 *
 * @param date the date to convert to a date-time string
 * @returns a date-time string formatted according to RFC5545
 */
export function toDateTimeString(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    return `${toDateString(date)}T${toTimeString(date)}`
}

/**
 * Format a date as an RFC5545 compliant date-time string. Uses the timezone
 * offset of the date to adjust the time to UTC.
 *
 * @param date the date to convert to a date-time string
 * @param timezoneOffset the timezone offset in minutes, uses the local timezone offset by default
 * @returns a UTC date-time string formatted according to RFC5545
 */
export function toDateTimeStringUTC(date: Date): string {
    if (isNaN(date.getTime())) throw new Error('Date is invalid')
    const offset = date.getTimezoneOffset()
    const offsetDate = new Date(date.getTime() + offset * ONE_MINUTE_MS)
    return `${toDateString(offsetDate)}T${toTimeString(offsetDate)}Z`
}

/**
 * Parse a date-time string to a Date.
 *
 * @param dateTime a date-time string formatted according to RFC5545
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
 * Parse a date string to a Date.
 *
 * @param date a date-time string formatted according to RFC5545
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
 * Convert {@link Date} objects to {@link CalendarDateTime} or
 * {@link CalendarDate}, depending on `fullDay`. If `date` is an
 * {@link ICalendarDate} it is returned as is.
 */
export function convertDate(
    date: Date | ICalendarDate,
    fullDay: boolean = false
): ICalendarDate {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (fullDay) return new CalendarDate(date as Date)
        else return new CalendarDateTime(date as Date)
    } else {
        return date as ICalendarDate
    }
}
