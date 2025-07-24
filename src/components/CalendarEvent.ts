import { Component } from "../component"
import { convertDate, ICalendarDate, parseDateProperty, toDateTimeString } from "../date"

/**
 * Represents a VEVENT component, representing an event in a calendar.
 */
export class CalendarEvent extends Component {
    name = 'VEVENT';

    constructor(uid: string, dtstamp: ICalendarDate | Date, dtstart: ICalendarDate | Date)
    constructor(component: Component)
    constructor(a: string | Component, b?: ICalendarDate | Date, c?: ICalendarDate | Date) {
        var component: Component
        if (b) {
            const uid = a as string
            const dtstamp = convertDate(b!)
            const dtstart = convertDate(c!)
            component = new Component('VEVENT')
            component.setProperty('UID', uid)
            component.setProperty('DTSTAMP', dtstamp)
            component.setProperty('DTSTART', dtstart)
        } else {
            component = a as Component
        }
        super(component.name, component.properties, component.components)
    }

    serialize(): string {
        if (!this.end() && !this.duration()) {
            throw new Error('Failed to serialize calendar event, end or duration must be set')
        }
        return super.serialize()
    }

    stamp(): ICalendarDate {
        return parseDateProperty(this.getProperty('DTSTAMP')!)
    }

    setStamp(value: ICalendarDate | Date): this {
        return this.setProperty('DTSTAMP', convertDate(value))
    }

    uid(): string {
        return this.getProperty('UID')!.value
    }

    setUid(value: string): this {
        return this.setProperty('UID', value)
    }

    summary(): string | undefined {
        return this.getProperty('SUMMARY')?.value
    }

    setSummary(value: string): this {
        return this.setProperty('SUMMARY', value)
    }

    removeSummary() {
        this.removePropertiesWithName('SUMMARY')
    }

    description(): string | undefined {
        return this.getProperty('DESCRIPTION')?.value
    }

    setDescription(value: string): this {
        return this.setProperty('DESCRIPTION', value)
    }

    removeDescription() {
        this.removePropertiesWithName('DESCRIPTION')
    }

    location(): string | undefined {
        return this.getProperty('LOCATION')?.value
    }

    setLocation(value: string): this {
        return this.setProperty('LOCATION', value)
    }

    removeLocation() {
        this.removePropertiesWithName('LOCATION')
    }

    /**
     * Get the start of the event.
     */
    start(): ICalendarDate {
        return parseDateProperty(this.getProperty('DTSTART')!)
    }

    /** Set the start of the event. */
    setStart(value: ICalendarDate | Date): this {
        return this.setProperty('DTSTART', convertDate(value))
    }

    removeStart() {
        this.removePropertiesWithName('DTSTART')
    }

    /**
     * Get the non-inclusive end of the event.
     */
    end(): ICalendarDate | undefined {
        const property = this.getProperty('DTEND')
        if (!property) return
        return parseDateProperty(property)
    }

    /**
     * Set the exclusive end of the event.
     * 
     * Will remove 'duration' if present.
     */
    setEnd(value: ICalendarDate | Date): this {
        const date = convertDate(value)
        const start = this.start()
        if (date.isFullDay() !== start.isFullDay()) {
            throw new Error(`End must be same date type as start. Start is ${start.isFullDay() ? 'date' : 'datetime'} but new end value is ${date.isFullDay() ? 'date' : 'datetime'}`)
        }

        this.removeDuration()
        return this.setProperty('DTEND', date)
    }

    removeEnd() {
        this.removePropertiesWithName('DTEND')
    }

    /**
     * Set the duration of the event.
     * 
     * Will remove 'end' if present.
     */
    setDuration(value: string): this {
        this.removeDuration()
        return this.setProperty('DURATION', value)
    }

    /**
     * Get the duration of the event as the raw string value.
     */
    duration(): string | undefined {
        return this.getProperty('DURATION')?.value
    }

    removeDuration() {
        this.removePropertiesWithName('DURATION')
    }

    created(): ICalendarDate | undefined {
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

    geo(): [number, number] | undefined {
        const text = this.getProperty('GEO')?.value
        if (!text) return
        const pattern = /^[+-]?\d+(\.\d+)?,[+-]?\d+(\.\d+)?$/
        if (!pattern.test(text)) throw new Error(`Failed to parse GEO property: ${text}`)
        const [longitude, latitude] = text.split(',')
        return [parseFloat(longitude), parseFloat(latitude)]
    }

    setGeo(latitude: number, longitude: number): this {
        const text = `${latitude},${longitude}`
        return this
    }

    removeGeo() {
        this.removePropertiesWithName('GEO')
    }
}
