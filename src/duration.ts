import {
    CalendarDateOrTime,
    isDateObject,
    isCalendarDateOrTime,
    ONE_DAY_MS,
    ONE_DAY_SECONDS,
    ONE_HOUR_SECONDS,
    ONE_MINUTE_SECONDS,
    ONE_SECOND_MS,
    ONE_WEEK_SECONDS,
} from './date'
import { validateDuration } from './property'

export type DurationUnit = 'W' | 'D' | 'H' | 'M' | 'S'

/**
 * Represents a DURATION value as defined by RFC5545.
 */
export class CalendarDuration {
    weeks?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number

    constructor(duration: string | CalendarDuration) {
        if (typeof duration === 'string') {
            validateDuration(duration)

            const negative = duration.startsWith('-') ? -1 : 1
            const findParts = /(\d+)([WDHMS])/g
            const parts = duration.matchAll(findParts)
            for (const part of parts) {
                const value = parseInt(part[1], 10)
                const name = part[2] as DurationUnit
                switch (name) {
                    case 'W':
                        this.weeks = value * negative
                        break
                    case 'D':
                        this.days = value * negative
                        break
                    case 'H':
                        this.hours = value * negative
                        break
                    case 'M':
                        this.minutes = value * negative
                        break
                    case 'S':
                        this.seconds = value * negative
                        break
                }
            }
        } else {
            this.weeks = duration.weeks
            this.days = duration.days
            this.hours = duration.hours
            this.minutes = duration.minutes
            this.seconds = duration.seconds
        }
    }

    /**
     * Get the length of this duration object in seconds.
     * @returns The total number of seconds represented by this duration.
     */
    inSeconds(): number {
        return (
            (this.weeks ?? 0) * ONE_WEEK_SECONDS +
            (this.days ?? 0) * ONE_DAY_SECONDS +
            (this.hours ?? 0) * ONE_HOUR_SECONDS +
            (this.minutes ?? 0) * ONE_MINUTE_SECONDS +
            (this.seconds ?? 0)
        )
    }

    /**
     * Get the length of this duration object in milliseconds.
     *
     * Note that this will always return whole seconds, as durations do not
     * support milliseconds.
     * @returns The total number of milliseconds represented by this duration.
     */
    inMilliseconds(): number {
        return this.inSeconds() * ONE_SECOND_MS
    }

    /**
     * Get the duration string that most accurately represents this duration.
     * @returns A duration string in the format `P[n]W` for weeks, or `P[n]DT[n]H[n]M[n]S` for days, hours, minutes and seconds.
     */
    getValue(): string {
        if (this.weeks !== undefined) {
            return toDayDurationString(this.weeks)
        }
        return toDurationString(this.inSeconds())
    }

    /**
     * Get the floor the duration to the nearest of a given unit.
     * @param unit The unit to floor to.
     * @returns The duration with units smaller than `unit` removed.
     * @example
     * const duration = new CalendarDuration("1W2D5H30M")
     * const days = duration.floor("D") // Floor to days
     * console.log(days.getValue()) // "1W2D"
     */
    floor(unit: DurationUnit): CalendarDuration {
        const result = new CalendarDuration(this)
        /* eslint-disable no-fallthrough */
        switch (unit) {
            case 'W':
                result.days = undefined
            case 'D':
                result.hours = undefined
            case 'H':
                result.minutes = undefined
            case 'M':
                result.seconds = undefined
        }
        /* eslint-enable no-fallthrough */
        return result
    }

    /**
     * Create a duration from a number of seconds.
     *
     * Will convert the duration using {@link toDurationString}.
     * @param seconds How many seconds the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of seconds.
     * @throws {Error} If seconds is NaN, a decimal or negative.
     */
    static fromSeconds(seconds: number): CalendarDuration {
        return new CalendarDuration(toDurationString(seconds))
    }

    /**
     * Create a duration from a number of days.
     * @param days How many days the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of days.
     * @throws {Error} If days is NaN, a decimal or negative.
     */
    static fromDays(days: number): CalendarDuration {
        return new CalendarDuration(toDayDurationString(days))
    }

    /**
     * Create a duration from a number of weeks.
     * @param weeks How many weeks the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of weeks.
     * @throws {Error} If weeks is NaN, a decimal or negative.
     */
    static fromWeeks(weeks: number): CalendarDuration {
        return new CalendarDuration(toWeekDurationString(weeks))
    }

    /**
     * Creates a duration from the difference between two dates.
     * @param start The start date or time.
     * @param end The end date or time.
     * @returns A {@link CalendarDuration} representing the difference between the two dates.
     * @throws {Error} If the start date and end date have different types.
     */
    static fromDifference(
        start: Date | CalendarDateOrTime,
        end: Date | CalendarDateOrTime
    ): CalendarDuration {
        if (isDateObject(start)) {
            // Date
            if (isDateObject(end)) {
                const differenceSeconds =
                    (end.getTime() - start.getTime()) / ONE_SECOND_MS
                return CalendarDuration.fromSeconds(differenceSeconds)
            }
        } else if (start.isFullDay()) {
            // CalendarDate
            if (isCalendarDateOrTime(end) && end.isFullDay()) {
                const startMs = start.getDate().getTime()
                const endMs = end.getDate().getTime()
                const differenceDays = (endMs - startMs) / ONE_DAY_MS
                return CalendarDuration.fromDays(differenceDays)
            }
        } else {
            // CalendarDateTime
            if (isCalendarDateOrTime(end) && !end.isFullDay()) {
                const startMs = start.getDate().getTime()
                const endMs = end.getDate().getTime()
                const differenceSeconds = (endMs - startMs) / ONE_SECOND_MS
                return CalendarDuration.fromSeconds(differenceSeconds)
            }
        }

        throw new Error('Start and end dates must be of the same type')
    }
}

/**
 * Convert a number of seconds to a duration string.
 * @param seconds How many seconds the duration should represent.
 * @returns A string representing the duration in the format `P[n]DT[n]H[n]M[n]S` where values may be omitted if equal to 0.
 * @throws {Error} If seconds is NaN, a decimal or negative.
 */
export function toDurationString(seconds: number): string {
    if (isNaN(seconds)) throw new Error('Seconds must not be NaN')
    if (seconds < 0) throw new Error('Seconds must not be negative')
    if (seconds % 1 !== 0) throw new Error('Seconds must be an integer')

    const secondsValue = seconds % 60
    const minutes = Math.floor(seconds / 60)
    const minutesValue = minutes % 60
    const hours = Math.floor(minutes / 24)
    const hoursValue = hours % 24
    const daysValue = Math.floor(hours / 24)

    let durationString = 'P'
    if (daysValue > 0) {
        durationString += `${daysValue}D`
    }
    if (hoursValue > 0 || minutesValue > 0 || secondsValue > 0) {
        durationString += 'T'
        if (hoursValue > 0) {
            durationString += `${hoursValue}H`
        }
        if (minutesValue > 0 || (hoursValue > 0 && secondsValue > 0)) {
            durationString += `${minutesValue}M`
        }
        if (secondsValue > 0) {
            durationString += `${secondsValue}S`
        }
    }

    return durationString
}

/**
 * Convert a number of weeks to a duration string.
 * @param weeks How many weeks the duration should represent.
 * @returns A string representing the duration in the format `P[n]W`, prefixed with `-` if negative.
 * @throws {Error} If weeks is NaN or a decimal.
 */
export function toWeekDurationString(weeks: number): string {
    if (isNaN(weeks)) throw new Error('Weeks must not be NaN')
    if (weeks % 1 !== 0) throw new Error('Weeks must be an integer')

    const prefix = weeks < 0 ? '-' : ''
    return prefix + `P${Math.abs(weeks)}W`
}

/**
 * Convert a number of days to a duration string.
 * @param days How many days the duration should represent.
 * @returns A string representing the duration in the format `P[n]D`, prefixed with `-` if negative.
 * @throws {Error} If days is NaN or a decimal.
 */
export function toDayDurationString(days: number): string {
    if (isNaN(days)) throw new Error('Days must not be NaN')
    if (days % 1 !== 0) throw new Error('Days must be an integer')

    const prefix = days < 0 ? '-' : ''
    return prefix + `P${Math.abs(days)}D`
}
