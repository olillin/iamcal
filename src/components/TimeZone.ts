import { Component } from '../component'
import { parseDate, toDateString, toDateTimeString } from '../parse'

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