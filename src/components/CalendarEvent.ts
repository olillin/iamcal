import { KnownPropertyName, PropertyValidationError } from '../property'
import { ComponentValidationError, Component } from '../component'
import {
    CalendarDateTime,
    convertDate,
    ICalendarDate,
    parseDateProperty,
    toDateTimeString,
} from '../date'

/**
 * Represents a VEVENT component, representing an event in a calendar.
 */
export class CalendarEvent extends Component {
    name = 'VEVENT'

    constructor(
        uid: string,
        dtstamp: CalendarDateTime | Date,
        dtstart: ICalendarDate | Date
    )
    constructor(component: Component)
    constructor(
        a: string | Component,
        b?: CalendarDateTime | Date,
        c?: ICalendarDate | Date
    ) {
        let component: Component
        if (a instanceof Component) {
            component = a as Component
            CalendarEvent.prototype.validate.call(component)
        } else {
            const uid = a as string
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
        if (!this.getEnd() && !this.duration()) {
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
     * @returns The start date or time of the event as an {@link ICalendarDate}.
     */
    getStart(): ICalendarDate {
        return parseDateProperty(this.getProperty('DTSTART')!)
    }

    /**
     * Set the start date or time of the event.
     * @param value The start date of the event as an {@link ICalendarDate} or `Date`.
     * @returns The CalendarEvent instance for chaining.
     */
    setStart(value: ICalendarDate | Date): this {
        return this.setProperty('DTSTART', convertDate(value))
    }

    /**
     * Get the non-inclusive end of the event.
     * @returns The end date of the event as an {@link ICalendarDate} or `undefined` if not set.
     */
    getEnd(): ICalendarDate | undefined {
        const property = this.getProperty('DTEND')
        if (!property) return
        return parseDateProperty(property)
    }

    /**
     * Set the exclusive end of the event.
     *
     * Will remove 'duration' if present.
     * @param value The end date of the event as an {@link ICalendarDate} or `Date`.
     * @returns The CalendarEvent instance for chaining.
     * @throws If the end date is a full day date and the start date is a date-time, or vice versa.
     */
    setEnd(value: ICalendarDate | Date): this {
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
     * Get the duration of the event as a string formatted according to the iCalendar specification.
     * @returns The duration of the event, or `undefined` if not set.
     */
    getDuration(): string | undefined {
        return this.getProperty('DURATION')?.value
    }

    /**
     * Set the duration of the event.
     *
     * Will remove 'end' if present.
     * @param value The duration of the event as a string in the format defined by RFC5545.
     * @returns The CalendarEvent instance for chaining.
     * @example
     * // Set duration to 1 hour and 30 minutes.
     * event.setDuration(`PT1H30M`)
     */
    setDuration(value: string): this {
        this.removeEnd()
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

    getCreated(): ICalendarDate | undefined {
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

    /* eslint-disable */

    /** @deprecated use {@link getStamp} instead */
    stamp = this.getStamp
    /** @deprecated use {@link getUid} instead */
    uid = this.getUid
    /** @deprecated use {@link getSummary} instead */
    summary = this.getSummary
    /** @deprecated use {@link getDescription} instead */
    description = this.getDescription
    /** @deprecated use {@link getLocation} instead */
    location = this.getLocation
    /** @deprecated use {@link getStart} instead */
    start = this.getStart
    /** @deprecated use {@link getEnd} instead */
    end = this.getEnd
    /** @deprecated use {@link getDuration} instead */
    duration = this.getDuration
    /** @deprecated use {@link getCreated} instead */
    created = this.getCreated
    /** @deprecated use {@link getGeographicPosition} instead */
    geo = this.getGeographicPosition
    /** @deprecated use {@link setGeographicPosition} instead */
    setGeo = this.setGeographicPosition
    /** @deprecated use {@link removeGeographicLocation} instead */
    removeGeo = this.removeGeographicLocation
}
