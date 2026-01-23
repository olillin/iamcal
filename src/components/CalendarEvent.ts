import { Component, ComponentValidationError } from '../component'
import {
    CalendarDateOrTime,
    CalendarDateTime,
    convertDate,
    parseDateProperty,
    toDateTimeString,
} from '../date'
import { CalendarDuration } from '../duration'
import { KnownPropertyName } from '../property/names'
import { PropertyValidationError } from '../property/validate'

export const DEFAULT_EVENT_DURATION_DATE_TIME: CalendarDuration = new CalendarDuration('PT0S')
export const DEFAULT_EVENT_DURATION_DATE: CalendarDuration = new CalendarDuration('P1D')

/**
 * Get the default event duration for an event without an end nor duration.
 * @param isFullDay Whether the event is a full day event.
 * @returns `DEFAULT_EVENT_DURATION_DATE` for full day events, `DEFAULT_EVENT_DURATION_DATE_TIME` for other events.
 */
export function getDefaultEventDuration(isFullDay: boolean): CalendarDuration {
    return isFullDay ? DEFAULT_EVENT_DURATION_DATE : DEFAULT_EVENT_DURATION_DATE_TIME
}

/**
 * Represents a VEVENT component, representing an event in a calendar.
 */
export class CalendarEvent extends Component {
    name = 'VEVENT'

    constructor(
        uid: string,
        dtstamp: CalendarDateTime | Date,
        dtstart: CalendarDateOrTime | Date
    )
    constructor(component: Component)
    constructor(
        a: string | Component,
        b?: CalendarDateTime | Date,
        c?: CalendarDateOrTime | Date
    ) {
        let component: Component
        if (a instanceof Component) {
            component = a
            CalendarEvent.prototype.validate.call(component)
        } else {
            const uid = a
            const dtstamp = convertDate(b!, false)
            const dtstart = convertDate(c!)
            component = new Component('VEVENT')
            component.setProperty('UID', uid)
            component.setProperty('DTSTAMP', dtstamp)
            component.setProperty('DTSTART', dtstart)
        }
        super(component.name, component.properties, component.components)
    }

    serialize(): string {
        if (!this.getEnd() && !this.getDuration()) {
            throw new Error(
                'Failed to serialize calendar event, end or duration must be set'
            )
        }
        return super.serialize()
    }

    validate() {
        if (this.name !== 'VEVENT')
            throw new ComponentValidationError('Component name must be VEVENT')
        const requiredProperties: KnownPropertyName[] = [
            'UID',
            'DTSTAMP',
            'DTSTART',
        ]
        this.validateAllProperties(requiredProperties)
    }

    getStamp(): CalendarDateTime {
        return parseDateProperty(
            this.getProperty('DTSTAMP')!
        ) as CalendarDateTime
    }

    setStamp(value: CalendarDateTime | Date): this {
        const converted = convertDate(value, false)
        if (converted.isFullDay()) {
            throw new PropertyValidationError('DTSTAMP cannot be of type DATE')
        }
        return this.setProperty('DTSTAMP', converted)
    }

    getUid(): string {
        return this.getProperty('UID')!.value
    }

    setUid(value: string): this {
        return this.setProperty('UID', value)
    }

    getSummary(): string | undefined {
        return this.getProperty('SUMMARY')?.value
    }

    setSummary(value: string): this {
        return this.setProperty('SUMMARY', value)
    }

    removeSummary() {
        this.removePropertiesWithName('SUMMARY')
    }

    getDescription(): string | undefined {
        return this.getProperty('DESCRIPTION')?.value
    }

    setDescription(value: string): this {
        return this.setProperty('DESCRIPTION', value)
    }

    removeDescription() {
        this.removePropertiesWithName('DESCRIPTION')
    }

    getLocation(): string | undefined {
        return this.getProperty('LOCATION')?.value
    }

    setLocation(value: string): this {
        return this.setProperty('LOCATION', value)
    }

    removeLocation() {
        this.removePropertiesWithName('LOCATION')
    }

    /**
     * Get the start date or time of the event.
     * @returns The start date or time of the event as a {@link CalendarDateOrTime}.
     */
    getStart(): CalendarDateOrTime {
        return parseDateProperty(this.getProperty('DTSTART')!)
    }

    /**
     * Set the start date or time of the event.
     * @param value The start date of the event as a {@link CalendarDateOrTime} or `Date`.
     * @returns The CalendarEvent instance for chaining.
     */
    setStart(value: CalendarDateOrTime | Date): this {
        return this.setProperty('DTSTART', convertDate(value))
    }

    /**
     * Check if this event is a full day event.
     * @returns `true` if the event is a full day event, `false` if not.
     */
    isFullDay(): boolean {
        return this.getStart().isFullDay()
    }

    /**
     * Get the non-inclusive end of the event.
     * @returns The end date of the event as a {@link CalendarDateOrTime} or `undefined` if not set.
     */
    getEnd(): CalendarDateOrTime {
        const explicit = this.getExplicitEnd()
        if (explicit) return explicit

        // Calculate end from start and duration
        const start = this.getStart()
        let duration = this.getExplicitDuration()
        if (!duration) {
            duration = getDefaultEventDuration(this.isFullDay())
        }

        return start.offset(duration)
    }

    /**
     * Get the DTEND property of the event, representing the non-inclusive end of the event.
     * @returns The end date of the event as a {@link CalendarDateOrTime} or `undefined` if not set.
     */
    getExplicitEnd(): CalendarDateOrTime | undefined {
        const property = this.getProperty('DTEND')
        if (!property) return
        return parseDateProperty(property)
    }

    /**
     * Set the exclusive end of the event.
     *
     * Will remove 'duration' if present.
     * @param value The end date of the event as a {@link CalendarDateOrTime} or `Date`.
     * @returns The CalendarEvent instance for chaining.
     * @throws If the end date is a full day date and the start date is a date-time, or vice versa.
     */
    setEnd(value: CalendarDateOrTime | Date): this {
        const date = convertDate(value)
        const start = this.getStart()
        if (date.isFullDay() !== start.isFullDay()) {
            throw new Error(
                `End must be same date type as start. Start is ${start.isFullDay() ? 'date' : 'datetime'} but new end value is ${date.isFullDay() ? 'date' : 'datetime'}`
            )
        }

        this.removeDuration()
        return this.setProperty('DTEND', date)
    }

    /**
     * Remove the end of the event.
     *
     * NOTE: An event must have either an end or a duration set.
     */
    removeEnd() {
        this.removePropertiesWithName('DTEND')
    }

    /**
     * Get the duration of the event.
     * @returns The duration of the event as a {@link CalendarDuration}.
     */
    getDuration(): CalendarDuration {
        const explicit = this.getExplicitDuration()
        if (explicit) return explicit

        // Calculate duration from start and end
        const start = this.getStart()
        const end = this.getExplicitEnd()
        if (!end) {
            return getDefaultEventDuration(this.isFullDay())
        }
        return CalendarDuration.fromDifference(start, end)
    }

    /**
     * Get the DURATION property of the event.
     * @returns The duration of the event as a {@link CalendarDuration}, or `undefined` if not set.
     */
    getExplicitDuration(): CalendarDuration | undefined {
        const property = this.getProperty('DURATION')?.value
        if (property == undefined) return undefined
    }

    /**
     * Set the duration of the event.
     *
     * Will remove 'DTEND' if present.
     *
     * If DTSTART is of type DATE the duration will be floored to the nearest day.
     * @param value The duration of the event as a {@link CalendarDuration} duration string.
     * @returns The CalendarEvent instance for chaining.
     * @example
     * // Set duration to 1 hour and 30 minutes.
     * event.setDuration(`PT1H30M`)
     */
    setDuration(value: string | CalendarDuration): this {
        this.removeEnd()
        if (typeof value === 'string')
            value = new CalendarDuration(value)
        if (this.getStart().isFullDay())
            value = value.floor('D')
        return this.setProperty('DURATION', value)
    }

    /**
     * Remove the duration of the event.
     *
     * NOTE: An event must have either an end or a duration set.
     */
    removeDuration() {
        this.removePropertiesWithName('DURATION')
    }

    getCreated(): CalendarDateOrTime | undefined {
        const property = this.getProperty('CREATED')
        if (!property) return
        return parseDateProperty(property)
    }

    setCreated(value: Date): this {
        return this.setProperty('CREATED', toDateTimeString(value))
    }

    removeCreated() {
        this.removePropertiesWithName('CREATED')
    }

    getGeographicPosition(): [number, number] | undefined {
        const text = this.getProperty('GEO')?.value
        if (!text) return
        const validGeoPattern = /^[+-]?\d+(\.\d+)?;[+-]?\d+(\.\d+)?$/
        if (!validGeoPattern.test(text))
            throw new Error(`Failed to parse GEO property: ${text}`)
        const [longitude, latitude] = text.split(',')
        return [parseFloat(longitude), parseFloat(latitude)]
    }

    setGeographicPosition(latitude: number, longitude: number): this {
        const text = `${latitude};${longitude}`
        return this.setProperty('GEO', text)
    }

    removeGeographicLocation() {
        this.removePropertiesWithName('GEO')
    }
}

