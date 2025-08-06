import { Component, ComponentValidationError } from '../component'
import { ICalendarDate, parseDateProperty } from '../date'
import { KnownPropertyName } from '../property'
import { TimeZoneOffset } from './TimeZoneOffset'

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

    /* eslint-disable */

    /**
     * @deprecated Use {@link getId} instead.
     */
    id = this.getId

    /**
     * @deprecated Use {@link getLastModified} instead.
     */
    lastMod = this.getLastModified

    /**
     * @deprecated Use {@link setLastModified} instead.
     */
    setLastMod = this.setLastModified

    /**
     * @deprecated Use {@link removeLastModified} instead.
     */
    removeLastMod = this.removeLastModified

    /**
     * @deprecated Use {@link getUrl} instead.
     */
    url = this.getUrl

    /**
     * Get all time offsets.
     * @returns An array of time zone offsets defined in this time zone.
     * @deprecated Use {@link getOffsets} instead.
     */
    offsets = this.getOffsets

    /**
     * Get standard/winter time offsets.
     * @returns An array of time zone offsets defined in this time zone that are of type STANDARD.
     * @deprecated Use {@link getStandardOffsets} instead.
     */
    standardOffsets = this.getStandardOffsets

    /**
     * Get daylight savings time offsets.
     * @returns An array of time zone offsets defined in this time zone that are of type DAYLIGHT.
     * @deprecated Use {@link getDaylightOffsets} instead.
     */
    daylightOffsets = this.getDaylightOffsets
}
