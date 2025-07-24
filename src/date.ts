import type { Property } from "./component"

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
            try {
                this.date = new Date(date)
                if (isNaN(this.date.getTime())) {
                    throw new Error('Date is invalid')
                }
            } catch {
                // Parse date of type 'YYYYMMDD'
                this.date = new Date(
                    parseInt(date.substring(0, 4)),
                    parseInt(date.substring(4, 6)) - 1,
                    parseInt(date.substring(6, 8)),
                )
            }
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
            try {
                this.date = new Date(date)
                if (isNaN(this.date.getTime())) {
                    throw new Error('Date is invalid')
                }
            } catch {
                // Parse date of type 'YYYYMMDDTHHmmSS'
                this.date = new Date(
                    parseInt(date.substring(0, 4)),
                    parseInt(date.substring(4, 6)) - 1,
                    parseInt(date.substring(6, 8)),
                    parseInt(date.substring(9, 11)),
                    parseInt(date.substring(11, 13)),
                    parseInt(date.substring(13, 15))
                )
            }
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

export function padZeros(num: number, maxLength: number): string {
    return String(num).padStart(maxLength, '0')
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

export function parseDateProperty(dateProperty: Property): ICalendarDate {
    const value = dateProperty.value.trim()
    if (dateProperty.params.includes('VALUE=DATE')) {
        return new CalendarDate(value)
    } else {
        return new CalendarDateTime(value)
    }
}

export function toTimeString(date: Date): string {
    return `${padHours(date.getHours())}${padMinutes(date.getMinutes())}${padSeconds(date.getSeconds())}`
}

export function toDateString(date: Date): string {
    return `${padYear(date.getFullYear())}${padMonth(date.getMonth())}${padDay(date.getDate())}`
}

export function toDateTimeString(date: Date): string {
    return `${toDateString(date)}T${toTimeString(date)}`
}

/**
 * Convert Date objects to CalendarDateTime or CalendarDate, depending on
 * `fullDay`. If a ICalendarDate is passed it is returned as is.
 */
export function convertDate(date: Date | ICalendarDate, fullDay: boolean = false): ICalendarDate {
    if (Object.prototype.toString.call(date) === '[object Date]') {
        if (fullDay) return new CalendarDate(date as Date)
        else return new CalendarDateTime(date as Date)
    } else {
        return date as ICalendarDate
    }

}