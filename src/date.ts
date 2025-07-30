import type { Property } from "./component"
import { getPropertyValueType } from "./parse"
import * as patterns from "./patterns"

export const ONE_SECOND_MS = 1000
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS
export const ONE_DAY_MS = 24 * ONE_HOUR_MS

export interface ICalendarDate {
    /**
     * Create a property from this date.
     * @param name the name of the property
     */
    toProperty(name: string): Property

    /** Get the string value of this date */
    getValue(): string

    /**
     * Get the date value of this date. For {@link CalendarDate} this is the
     * time at the start of the day.
     */
    getDate(): Date

    /**
     * Returns `true` if this object is a {@link CalendarDate}.
     */
    isFullDay(): boolean
}

/**
 * Represents a DATE value as defined by 
 */
export class CalendarDate implements ICalendarDate {
    private date: Date

    constructor(date: Date | string | ICalendarDate) {
        if (typeof date === 'object') {
            if (Object.prototype.toString.call(date) === '[object Date') {
                this.date = date as Date
            } else {
                this.date = (date as ICalendarDate).getDate()
            }
        } else {
            this.date = parseDateString(date)
        }
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
            if (Object.prototype.toString.call(date) === '[object Date') {
                this.date = date as Date
            } else {
                this.date = (date as ICalendarDate).getDate()
            }
        } else {
            this.date = parseDateTimeString(date)
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
    if (num !== 0 && digits > length) throw new Error('Number must not have more digits than length')

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

export function parseDateProperty(dateProperty: Property, defaultType: 'DATE-TIME' | 'DATE' = 'DATE-TIME'): ICalendarDate {
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
    return `${padHours(date.getHours())}${padMinutes(date.getMinutes())}${padSeconds(date.getSeconds())}`
}

export function toDateString(date: Date): string {
    return `${padYear(date.getFullYear())}${padMonth(date.getMonth())}${padDay(date.getDate())}`
}

/**
 * Format a date as an RFC5545 compliant date-time string.
 * 
 * @param date the date to convert to a date-time string
 * @param timezoneOffset the timezone offset in minutes, uses the local timezone offset by default
 * @returns a date-time string formatted according to RFC5545
 */
export function toDateTimeString(date: Date): string {
    return `${toDateString(date)}T${toTimeString(date)}`
}

/**
 * Format a date as an RFC5545 compliant UTC date-time string.
 * 
 * @param date the date to convert to a date-time string
 * @param timezoneOffset the timezone offset in minutes, uses the local timezone offset by default
 * @returns a UTC date-time string formatted according to RFC5545
 */
export function toDateTimeStringUTC(date: Date, timezoneOffset?: number): string {
    const offset = timezoneOffset ?? new Date().getTimezoneOffset()
    const offsetDate = new Date(date.getTime() - offset * ONE_MINUTE_MS)
    return `${toDateString(offsetDate)}T${toTimeString(offsetDate)}Z`
}

/**
 * Parse a date-time string to a Date.
 * 
 * @param dateTime a date-time string formatted according to RFC5545
 * @param timezoneOffset the timezone offset in minutes, uses the local timezone offset by default
 */
export function parseDateTimeString(dateTime: string, timezoneOffset?: number): Date {
    if (!patterns.dateTime.test(dateTime)) {
        throw new Error('Date-time has invalid format')
    }

    const offset = timezoneOffset ?? new Date().getTimezoneOffset()

    const parsedDate = new Date(
        parseInt(dateTime.substring(0, 4)),
        parseInt(dateTime.substring(4, 6)) - 1,
        parseInt(dateTime.substring(6, 8)),
        parseInt(dateTime.substring(9, 11)),
        parseInt(dateTime.substring(11, 13)),
        parseInt(dateTime.substring(13, 15))
    )

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Date-time is invalid')
    }

    if (dateTime.endsWith('Z')) {
        return new Date(parsedDate.getTime() + offset)
    }
    return parsedDate
}

/**
 * Parse a date string to a Date.
 * 
 * @param date a date-time string formatted according to RFC5545
 */
export function parseDateString(date: string): Date {
    if (!patterns.matchesWholeString(patterns.date, date)) {
        throw new Error('Date has invalid format')
    }

    const parsedDate = new Date(
        parseInt(date.substring(0, 4)),
        parseInt(date.substring(4, 6)) - 1,
        parseInt(date.substring(6, 8)),
    )

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Date is invalid')
    }

    return parsedDate
}

/**
 * Convert {@link Date} objects to {@link CalendarDateTime} or
 * {@link CalendarDate}, depending on `fullDay`. If `date` is an
 * {@link ICalendarDate} it is returned as is.
 */
export function convertDate(date: Date | ICalendarDate, fullDay: boolean = false): ICalendarDate {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (fullDay) return new CalendarDate(date as Date)
        else return new CalendarDateTime(date as Date)
    } else {
        return date as ICalendarDate
    }
}