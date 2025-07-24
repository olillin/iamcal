import { Component } from "../component"
import { parseDate, toDateString, toDateTimeString } from "../parse"

/**
 * Represents a VEVENT component, representing an event in a calendar.
 */
export class CalendarEvent extends Component {
    name = 'VEVENT';

    constructor(uid: string, dtstamp: Date)
    constructor(component: Component)
    constructor(a: string | Component, b?: Date) {
        var component: Component
        if (b) {
            const uid = a as string
            const dtstamp = b as Date
            component = new Component('VEVENT')
            component.setProperty('UID', uid)
            component.setProperty('DTSTAMP', toDateTimeString(dtstamp))
        } else {
            component = a as Component
        }
        super(component.name, component.properties, component.components)
    }

    stamp(): Date {
        return parseDate(this.getProperty('DTSTAMP')!)
    }

    setStamp(value: Date, fullDay: boolean = false): this {
        if (fullDay) {
            this.setProperty('DTSTAMP', toDateString(value))
            this.setPropertyParams('DTSTAMP', ['VALUE=DATE'])
        } else {
            this.setProperty('DTSTAMP', toDateTimeString(value))
        }
        return this
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
     * If set as a full day the time will be at the start of the day.
     */
    start(): Date | undefined {
        const property = this.getProperty('DTSTART')
        if (!property) return
        return parseDate(property)
    }

    /** Set the start of the event. */
    setStart(value: Date, fullDay: boolean = false): this {
        if (fullDay) {
            this.setProperty('DTSTART', toDateString(value))
            this.setPropertyParams('DTSTART', ['VALUE=DATE'])
        } else {
            this.setProperty('DTSTART', toDateTimeString(value))
        }
        return this
    }

    removeStart() {
        this.removePropertiesWithName('DTSTART')
    }

    /**
     * Get the non-inclusive end of the event.
     * If set as a full day the time will be at the start of the day.
     */
    end(): Date | undefined {
        const property = this.getProperty('DTEND')
        if (!property) return
        return parseDate(property)
    }

    /**
     * Set the non-inclusive end of the event.
     */
    setEnd(value: Date, fullDay: boolean = false): this {
        if (fullDay) {
            this.setProperty('DTEND', toDateString(value))
            this.setPropertyParams('DTEND', ['VALUE=DATE'])
        } else {
            this.setProperty('DTEND', toDateTimeString(value))
        }
        return this
    }

    removeEnd() {
        this.removePropertiesWithName('DTEND')
    }

    created(): Date | undefined {
        const property = this.getProperty('CREATED')
        if (!property) return
        return parseDate(property)
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
