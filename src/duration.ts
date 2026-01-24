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

            const negativeMultiplier = duration.startsWith('-') ? -1 : 1
            const findParts = /(\d+)([WDHMS])/g
            const parts = duration.matchAll(findParts)
            for (const part of parts) {
                const value = parseInt(part[1], 10)
                const name = part[2] as DurationUnit
                switch (name) {
                    case 'W':
                        this.weeks = value * negativeMultiplier
                        break
                    case 'D':
                        this.days = value * negativeMultiplier
                        break
                    case 'H':
                        this.hours = value * negativeMultiplier
                        break
                    case 'M':
                        this.minutes = value * negativeMultiplier
                        break
                    case 'S':
                        this.seconds = value * negativeMultiplier
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
     * Get the duration string that represents this duration.
     * @returns A duration string in the format `P[n]W` for weeks, or `P[n]DT[n]H[n]M[n]S` for days, hours, minutes and seconds. Prefixed with a `-` if negative.
     */
    getValue(): string {
        return formatDurationString(
            this.weeks,
            this.days,
            this.hours,
            this.minutes,
            this.seconds
        )
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
     * @param seconds How many seconds the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of seconds.
     * @throws {Error} If seconds is NaN.
     */
    static fromSeconds(seconds: number): CalendarDuration {
        return new CalendarDuration(secondsToDurationString(seconds))
    }

    /**
     * Create a duration from a number of days.
     * @param days How many days the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of days.
     * @throws {Error} If days is NaN.
     */
    static fromDays(days: number): CalendarDuration {
        return new CalendarDuration(daysToDurationString(days))
    }

    /**
     * Create a duration from a number of weeks.
     * @param weeks How many weeks the duration should represent.
     * @returns A {@link CalendarDuration} representing the specified number of weeks.
     * @throws {Error} If weeks is NaN.
     */
    static fromWeeks(weeks: number): CalendarDuration {
        return new CalendarDuration(weeksToDurationString(weeks))
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
 * Convert time units to a duration string.
 *
 * A duration is considered negative if any unit is less than 0.
 * @param weeks How many weeks the duration should represent.
 * @param days The days part of the duration.
 * @param hours The hours part of the duration.
 * @param minutes The minutes part of the duration.
 * @param seconds The seconds part of the duration.
 * @returns A string representing the duration in the format `P[n]W` or `P[n]DT[n]H[n]M[n]S` where values may be omitted if 0, prefixed with `-` if negative.
 * @throws {Error} If weeks are combined with other values.
 * @throws {Error} If any unit is NaN.
 */
export function formatDurationString(
    weeks: number | undefined,
    days: number | undefined,
    hours: number | undefined,
    minutes: number | undefined,
    seconds: number | undefined,
): string {
    let prefix = ''
    let durationString = prefix + 'P'
    let hasTime = false
    let isEmpty = true

    const appendUnit = (time: number | undefined, unit: string) => {
        if (time === undefined) return
        if (isNaN(time)) {
            throw new Error(`${unit} must not be NaN`)
        }
        if (time < 0) prefix = '-'
        const absTime = Math.abs(Math.floor(time))
        durationString += absTime + unit.charAt(0)
        isEmpty = false
    }
    const appendTimeUnit = (time: number | undefined, unit: string) => {
        if (time === undefined) return
        if (!hasTime) {
            durationString += 'T'
            hasTime = true
        }
        appendUnit(time, unit)
    }

    // Add units
    if (weeks !== undefined) {
        if (days !== undefined ||
            hours !== undefined ||
            minutes !== undefined ||
            seconds !== undefined) {
            throw new Error('Cannot combine weeks with other units in duration string')
        }

        appendUnit(weeks, 'Weeks')
    }
    appendUnit(days, 'Days')
    appendTimeUnit(hours, 'Hours')
    if (minutes !== undefined) {
        appendTimeUnit(minutes, 'Minutes')
    } else if (hours !== undefined && seconds !== undefined) {
        appendTimeUnit(0, 'Minutes')
    }
    appendTimeUnit(seconds, 'Seconds')

    if (isEmpty) {
        throw new Error('Duration string must not be empty')
    }

    return prefix + durationString
}

/**
 * Convert a number of seconds to a duration string.
 * @param seconds How many seconds the duration should represent.
 * @returns A string representing the duration in the format `PT[n]H[n]M[n]S` where values may be omitted if 0, prefixed with `-` if negative.
 * @throws {Error} If seconds is NaN.
 */
export function secondsToDurationString(seconds: number): string {
    if (isNaN(seconds)) throw new Error('Seconds must not be NaN')
    seconds = Math.floor(seconds)

    const absSeconds = Math.abs(seconds)
    const minutes = Math.floor(absSeconds / 60)
    const hours = Math.floor(minutes / 60)
    let secondsValue: number | undefined = seconds % 60
    let minutesValue: number | undefined = minutes % 60
    let hoursValue: number | undefined = hours

    if (hoursValue === 0) hoursValue = undefined
    if (minutesValue === 0) minutesValue = undefined
    if (secondsValue === 0 && !(minutesValue === undefined && hoursValue === undefined)) secondsValue = undefined

    return formatDurationString(
        undefined,
        undefined,
        hoursValue,
        minutesValue,
        secondsValue,
    )
}

/**
 * Convert a number of days to a duration string.
 * @param days How many days the duration should represent.
 * @returns A string representing the duration in the format `P[n]D`, prefixed with `-` if negative.
 * @throws {Error} If days is NaN.
 */
export function daysToDurationString(days: number): string {
    return formatDurationString(
        undefined,
        days,
        undefined,
        undefined,
        undefined
    )
}

/**
 * Convert a number of weeks to a duration string.
 * @param weeks How many weeks the duration should represent.
 * @returns A string representing the duration in the format `P[n]W`, prefixed with `-` if negative.
 * @throws {Error} If weeks is NaN.
 */
export function weeksToDurationString(weeks: number): string {
    return formatDurationString(
        weeks,
        undefined,
        undefined,
        undefined,
        undefined
    )
}
