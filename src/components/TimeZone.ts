import { AllowedPropertyName, KnownPropertyName } from '../property'
import { Component, ComponentValidationError } from '../component'
import { convertDate, ICalendarDate, parseDateProperty } from '../date'

/**
 * Represents a VTIMEZONE component, containing time zone definitions.
 */
export class TimeZone extends Component {
    name = 'VTIMEZONE'

    constructor(id: string)
    constructor(component: Component)
    constructor(a: string | Component) {
        let component: Component
        if (a instanceof Component) {
            component = a as Component
            TimeZone.prototype.validate.call(component)
        } else {
            const tzid = a as string
            component = new Component('VTIMEZONE')
            component.setProperty('TZID', tzid)
        }
        super(component.name, component.properties, component.components)
    }

    validate() {
        if (this.name !== 'VTIMEZONE')
            throw new ComponentValidationError('Component name must be VEVENT')
        const requiredProperties: KnownPropertyName[] = ['TZID']
        this.validateAllProperties(requiredProperties)
    }

    getId(): string {
        return this.getProperty('TZID')!.value
    }

    setId(value: string): this {
        return this.setProperty('TZID', value)
    }

    getLastModified(): ICalendarDate | undefined {
        const text = this.getProperty('LAST-MODIFIED')
        if (!text) return
        return parseDateProperty(text)
    }

    setLastModified(value: Date): this {
        return this.setProperty('LAST-MODIFIED', value.toISOString())
    }

    removeLastModified() {
        this.removePropertiesWithName('LAST-MOD')
    }

    getUrl(): string | undefined {
        return this.getProperty('TZURL')?.value
    }

    setUrl(value: string): this {
        return this.setProperty('TZURL', value)
    }

    removeUrl() {
        this.removePropertiesWithName('TZURL')
    }

    /**
     * Get all time offsets.
     * @returns An array of time zone offsets defined in this time zone.
     */
    getOffsets(): TimeZoneOffset[] {
        const offsets: TimeZoneOffset[] = []
        this.components.forEach(component => {
            if (
                component.name === 'STANDARD' ||
                component.name === 'DAYLIGHT'
            ) {
                offsets.push(new TimeZoneOffset(component))
            }
        })
        return offsets
    }

    /**
     * Get standard/winter time offsets.
     * @returns An array of time zone offsets defined in this time zone that are of type STANDARD.
     */
    getStandardOffsets(): TimeZoneOffset[] {
        return this.getComponentsWithName('STANDARD').map(
            c => new TimeZoneOffset(c)
        )
    }

    /**
     * Get daylight savings time offsets.
     * @returns An array of time zone offsets defined in this time zone that are of type DAYLIGHT.
     */
    getDaylightOffsets(): TimeZoneOffset[] {
        return this.getComponentsWithName('DAYLIGHT').map(
            c => new TimeZoneOffset(c)
        )
    }

    /** @deprecated use {@link getId} instead */
    id = this.getId
    /** @deprecated use {@link getLastModified} instead */
    lastMod = this.getLastModified
    /** @deprecated use {@link setLastModified} instead */
    setLastMod = this.setLastModified
    /** @deprecated use {@link removeLastModified} instead */
    removeLastMod = this.removeLastModified
    /** @deprecated use {@link getUrl} instead */
    url = this.getUrl
    /** @deprecated use {@link getOffsets} instead */
    offsets = this.getOffsets
    /** @deprecated use {@link getStandardOffsets} instead */
    standardOffsets = this.getStandardOffsets
    /** @deprecated use {@link getDaylightOffsets} instead */
    daylightOffsets = this.getDaylightOffsets
}

export const knownOffsetTypes = ['DAYLIGHT', 'STANDARD']
export type OffsetType = (typeof knownOffsetTypes)[number]
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export type Offset = `${'-' | '+'}${Digit}${Digit}${Digit}${Digit}`
/** Represents a STANDARD or DAYLIGHT component, defining a time zone offset. */
class TimeZoneOffset extends Component {
    /**
     * @param type If this is a STANDARD or DAYLIGHT component.
     * @param start From when this offset is active.
     * @param offsetFrom The offset that is in use prior to this time zone observance.
     * @param offsetTo The offset that is in use during this time zone observance.
     */
    constructor(
        type: OffsetType,
        start: ICalendarDate | Date,
        offsetFrom: Offset,
        offsetTo: Offset
    )
    constructor(component: Component)
    constructor(
        a: OffsetType | Component,
        b?: ICalendarDate | Date,
        c?: Offset,
        d?: Offset
    ) {
        let component: Component
        if (a instanceof Component) {
            component = a as Component
            TimeZoneOffset.prototype.validate.call(component)
        } else {
            const name = a as OffsetType
            const start = convertDate(b!)
            const offsetFrom = c as Offset
            const offsetTo = d as Offset
            component = new Component(name)
            component.setProperty('DTSTART', start)
            component.setProperty('TZOFFSETFROM', offsetFrom)
            component.setProperty('TZOFFSETTO', offsetTo)
        }
        super(component.name, component.properties, component.components)
    }

    validate(): void {
        if (!knownOffsetTypes.includes(this.name)) {
            throw new ComponentValidationError(
                'Component name must be STANDARD or DAYLIGHT'
            )
        }
        const requiredProperties: AllowedPropertyName[] = [
            'DTSTART',
            'TZOFFSETFROM',
            'TZOFFSETTO',
        ]
        this.validateAllProperties(requiredProperties)
    }

    getStart(): ICalendarDate {
        return parseDateProperty(this.getProperty('DTSTART')!)
    }

    setStart(value: ICalendarDate | Date): this {
        return this.setProperty('DTSTART', convertDate(value))
    }

    getOffsetFrom(): Offset {
        return this.getProperty('TZOFFSETFROM')!.value as Offset
    }

    setOffsetFrom(value: Offset): this {
        return this.setProperty('TZOFFSETFROM', value)
    }

    getOffsetTo(): Offset {
        return this.getProperty('TZOFFSETTO')!.value as Offset
    }

    setOffsetTo(value: Offset): this {
        return this.setProperty('TZOFFSETTO', value)
    }

    getComment(): string | undefined {
        return this.getProperty('COMMENT')?.value
    }

    setComment(value: string): this {
        return this.setProperty('COMMENT', value)
    }

    removeComment() {
        this.removePropertiesWithName('COMMENT')
    }

    getTimeZoneName(): string | undefined {
        return this.getProperty('TZNAME')?.value
    }

    setTimeZoneName(value: string): this {
        return this.setProperty('TZNAME', value)
    }

    removeTimeZoneName() {
        this.removePropertiesWithName('TZNAME')
    }

    /** @deprecated use {@link getStart} instead */
    start = this.getStart
    /** @deprecated use {@link getOffsetFrom} instead */
    offsetFrom = this.getOffsetFrom
    /** @deprecated use {@link getOffsetTo} instead */
    offsetTo = this.getOffsetTo
    /** @deprecated use {@link getComment} instead */
    comment = this.getComment
    /** @deprecated use {@link getTimeZoneName} instead */
    timeZoneName = this.getTimeZoneName
}
