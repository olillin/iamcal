import { parseDate, toDateString, toDateTimeString } from './parse'
import { Property } from './types'

// Max line length as defined by RFC 5545 3.1.
const MAX_LINE_LENGTH = 75

export class Component {
    name: string
    properties: Property[]
    components: Component[]

    constructor(name: string, properties?: Property[], components?: Component[]) {
        this.name = name
        if (properties) {
            this.properties = properties
        } else {
            this.properties = new Array()
        }
        if (components) {
            this.components = components
        } else {
            this.components = new Array()
        }
    }

    serialize(): string {
        // Create lines
        const lines = [`BEGIN:${this.name}`]

        for (let property of this.properties) {
            let line =
                property['name'] + //
                property.params.map(p => ';' + p).join('') +
                ':' +
                property['value']

            // Wrap lines
            while (line.length > MAX_LINE_LENGTH) {
                lines.push(line.substring(0, MAX_LINE_LENGTH))
                line = ' ' + line.substring(MAX_LINE_LENGTH)
            }
            lines.push(line)
        }

        for (let component of this.components) {
            lines.push(component.serialize())
        }

        lines.push(`END:${this.name}`)

        // Join lines
        const serialized = lines.join('\n')

        return serialized
    }

    getProperty(name: string): Property | null {
        for (const property of this.properties) {
            if (property.name === name) {
                return property
            }
        }
        return null
    }

    setProperty(name: string, value: string): this {
        for (const property of this.properties) {
            if (property.name === name) {
                property.value = value
                return this
            }
        }
        this.properties.push({
            name: name,
            params: [],
            value: value,
        })
        return this
    }

    removePropertiesWithName(name: string) {
        const index = this.properties.findIndex(p => p.name === name)
        if (index === -1) return this
        // Remove property at index
        this.properties.splice(index, 1)
    }

    getPropertyParams(name: string): string[] | null {
        for (const property of this.properties) {
            if (property.name === name) {
                return property.params
            }
        }
        return null
    }

    setPropertyParams(name: string, params: string[]): this {
        for (const property of this.properties) {
            if (property.name === name) {
                property.params = params
            }
        }
        return this
    }

    addComponent(component: Component): this {
        this.components.push(component)
        return this
    }

    /**
     * Remove a component from this component
     * @returns `true` if the component was removed. `false` if the component was not present
     */
    removeComponent(component: Component): boolean {
        const index = this.components.indexOf(component)
        if (index === -1) return false

        // Remove element at index from list
        this.components.splice(index, 1)

        return true
    }

    getComponents(name: string): Component[] {
        const components: Component[] = []

        for (let component of this.components) {
            if (component.name === name) {
                components.push(component)
            }
        }

        return components
    }
}

/**
 * Represents a VCALENDAR component, the root component of an iCalendar file.
 */
export class Calendar extends Component {
    name = 'VCALENDAR'

    /**
     * @param prodid A unique identifier of the program creating the calendar.
     *
     * Example: `-//Google Inc//Google Calendar 70.9054//EN`
     */
    constructor(prodid: string)
    /**
     * @param prodid A unique identifier of the program creating the calendar.
     *
     * Example: `-//Google Inc//Google Calendar 70.9054//EN`
     * @param version The version of the iCalendar specification that this calendar uses.
     */
    constructor(prodid: string, version: string)
    /**
     * @param component A VCALENDAR component.
     */
    constructor(component: Component)
    constructor(a?: string | Component, b?: string) {
        var component: Component
        if (a instanceof Component) {
            component = a as Component
        } else {
            const prodid = a as string
            const version = (b as string) ?? '2.0'
            component = new Component('VCALENDAR')
            component.setProperty('PRODID', prodid)
            component.setProperty('VERSION', version)
        }
        super(component.name, component.properties, component.components)
    }

    events(): CalendarEvent[] {
        return this.getComponents('VEVENT').map(c => new CalendarEvent(c))
    }

    removeEvent(event: CalendarEvent): boolean
    removeEvent(uid: string): boolean
    removeEvent(a: CalendarEvent | string): boolean {
        if (a instanceof CalendarEvent) {
            const event = a as CalendarEvent
            return this.removeComponent(event)
        } else {
            const uid = a as string
            for (const event of this.events()) {
                if (event.uid() !== uid) continue
                return this.removeComponent(event)
            }
        }
        return false
    }

    prodId(): string {
        return this.getProperty('PRODID')!.value
    }

    setProdId(value: string): this {
        return this.setProperty('PRODID', value)
    }

    version(): string {
        return this.getProperty('VERSION')!.value
    }

    setVersion(value: string): this {
        return this.setProperty('VERSION', value)
    }

    calScale(): string | undefined {
        return this.getProperty('CALSCALE')?.value
    }

    setCalScale(value: string): this {
        return this.setProperty('CALSCALE', value)
    }

    removeCalScale() {
        this.removePropertiesWithName('CALSCALE')
    }

    method(): string | undefined {
        return this.getProperty('METHOD')?.value
    }

    setMethod(value: string) {
        this.setProperty('METHOD', value)
    }

    removeMethod() {
        this.removePropertiesWithName('METHOD')
    }

    calendarName(): string | undefined {
        return this.getProperty('X-WR-CALNAME')?.value
    }

    setCalendarName(value: string) {
        this.setProperty('X-WR-CALNAME', value)
    }

    removeCalendarName() {
        this.removePropertiesWithName('X-WR-CALNAME')
    }

    calendarDescription(): string | undefined {
        return this.getProperty('X-WR-CALDESC')?.value
    }

    setCalendarDescription(value: string): this {
        return this.setProperty('X-WR-CALDESC', value)
    }

    removeCalendarDescription() {
        this.removePropertiesWithName('X-WR-CALDESC')
    }
}

/**
 * Represents a VTIMEZONE component, containing time zone definitions.
 */
export class TimeZone extends Component {
    constructor(id: string)
    constructor(component: Component)
    constructor(a: string | Component) {
        var component: Component
        if (a instanceof Component) {
            component = a as Component
        } else {
            const tzid = a as string
            component = new Component('VTIMEZONE')
            component.setProperty('TZID', tzid)
        }
        super(component.name, component.properties, component.components)
    }

    id(): string {
        return this.getProperty('TZID')!.value
    }

    setId(value: string): this {
        return this.setProperty('TZID', value)
    }

    lastMod(): Date | undefined {
        const text = this.getProperty('LAST-MOD')
        if (!text) return
        return parseDate(text)
    }

    setLastMod(value: Date): this {
        return this.setProperty('LAST-MOD', value.toISOString())
    }

    removeLastMod() {
        this.removePropertiesWithName('LAST-MOD')
    }

    url(): string | undefined {
        return this.getProperty('TZURL')?.value
    }

    setUrl(value: string): this {
        return this.setProperty('TZURL', value)
    }

    removeUrl() {
        this.removePropertiesWithName('TZURL')
    }

    /** Get all time offsets. */
    offsets(): TimeZoneOffset[] {
        const offsets: TimeZoneOffset[] = []
        this.components.forEach(component => {
            if (component.name === 'STANDARD' || component.name === 'DAYLIGHT') {
                offsets.push(new TimeZoneOffset(component))
            }
        })
        return offsets
    }

    /** Get standard/winter time offsets. */
    standardOffsets(): TimeZoneOffset[] {
        return this.getComponents('STANDARD').map(c => new TimeZoneOffset(c))
    }

    /** Get daylight savings time offsets. */
    daylightOffsets(): TimeZoneOffset[] {
        return this.getComponents('DAYLIGHT').map(c => new TimeZoneOffset(c))
    }
}

export type OffsetType = 'DAYLIGHT' | 'STANDARD'
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export type Offset = `${'-' | '+'}${Digit}${Digit}${Digit}${Digit}`
/** Represents a STANDARD or DAYLIGHT component, defining a time zone offset. */
class TimeZoneOffset extends Component {
    /**
     *
     * @param type If this is a STANDARD or DAYLIGHT component.
     * @param start From when this offset is active.
     * @param offsetFrom The offset that is in use prior to this time zone observance.
     * @param offsetTo The offset that is in use during this time zone observance.
     */
    constructor(type: OffsetType, start: Date, offsetFrom: Offset, offsetTo: Offset)
    constructor(component: Component)
    constructor(a: OffsetType | Component, b?: Date, c?: Offset, d?: Offset) {
        var component: Component
        if (a instanceof Component) {
            component = a as Component
        } else {
            const name = a as OffsetType
            const start = b as Date
            const offsetFrom = c as Offset
            const offsetTo = d as Offset
            component = new Component(name)
            component.setProperty('DTSTART', toDateTimeString(start))
            component.setProperty('TZOFFSETFROM', offsetFrom)
            component.setProperty('TZOFFSETTO', offsetTo)
        }
        super(component.name, component.properties, component.components)
    }

    start(): Date {
        return parseDate(this.getProperty('DTSTART')!)
    }

    setStart(value: Date, fullDay: boolean = false): this {
        if (fullDay) {
            this.setProperty('DTSTART', toDateString(value))
            this.setPropertyParams('DTSTART', ['VALUE=DATE'])
        } else {
            this.setProperty('DTSTART', toDateTimeString(value))
        }
        return this
    }

    offsetFrom(): Offset {
        return this.getProperty('TZOFFSETFROM')!.value as Offset
    }

    setOffsetFrom(value: Offset): this {
        return this.setProperty('TZOFFSETFROM', value)
    }

    offsetTo(): Offset {
        return this.getProperty('TZOFFSETTO')!.value as Offset
    }

    setOffsetTo(value: Offset): this {
        return this.setProperty('TZOFFSETTO', value)
    }

    comment(): string | undefined {
        return this.getProperty('COMMENT')?.value
    }

    setComment(value: string): this {
        return this.setProperty('COMMENT', value)
    }

    removeComment() {
        this.removePropertiesWithName('COMMENT')
    }

    timeZoneName(): string | undefined {
        return this.getProperty('TZNAME')?.value
    }

    setTimeZoneName(value: string): this {
        return this.setProperty('TZNAME', value)
    }

    removeTimeZoneName() {
        this.removePropertiesWithName('TZNAME')
    }
}

export class CalendarEvent extends Component {
    name = 'VEVENT'

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

    summary(): string {
        return this.getProperty('SUMMARY')!.value
    }

    setSummary(value: string): this {
        return this.setProperty('SUMMARY', value)
    }

    removeSummary() {
        this.removePropertiesWithName('SUMMARY')
    }

    description(): string {
        return this.getProperty('DESCRIPTION')!.value
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
    start(): Date {
        return parseDate(this.getProperty('DTSTART')!)
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
    end(): Date {
        return parseDate(this.getProperty('DTEND')!)
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
