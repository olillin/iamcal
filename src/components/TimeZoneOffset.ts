import { Component, ComponentValidationError } from '../component'
import { CalendarDateOrTime, convertDate, parseDateProperty } from '../date'
import { AllowedPropertyName } from '../property'

export const knownOffsetTypes = ['DAYLIGHT', 'STANDARD']
export type OffsetType = (typeof knownOffsetTypes)[number]
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
export type Offset = `${'-' | '+'}${Digit}${Digit}${Digit}${Digit}`

/**
 * Represents a STANDARD or DAYLIGHT subcomponent, defining a time zone offset.
 */
export class TimeZoneOffset extends Component {
    /**
     * @param type If this is a STANDARD or DAYLIGHT component.
     * @param start From when this offset is active.
     * @param offsetFrom The offset that is in use prior to this time zone observance.
     * @param offsetTo The offset that is in use during this time zone observance.
     */
    constructor(
        type: OffsetType,
        start: CalendarDateOrTime | Date,
        offsetFrom: Offset,
        offsetTo: Offset
    )
    constructor(component: Component)
    constructor(
        a: OffsetType | Component,
        b?: CalendarDateOrTime | Date,
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

    /**
     * Get the date or time when this time zone offset starts.
     * @returns The start date or time of this time zone offset.
     */
    getStart(): CalendarDateOrTime {
        return parseDateProperty(this.getProperty('DTSTART')!)
    }

    /**
     * Set the date or time when this time zone offset starts.
     * @param value The start date or time.
     * @returns The TimeZoneOffset instance for chaining.
     */
    setStart(value: CalendarDateOrTime | Date): this {
        return this.setProperty('DTSTART', convertDate(value))
    }

    /**
     * Get the offset which is offset from during this time zone offset.
     * @returns The offset in a format such as "+0100" or "-0230".
     */
    getOffsetFrom(): Offset {
        return this.getProperty('TZOFFSETFROM')!.value as Offset
    }

    /**
     * Set the offset to offset from during this time zone offset.
     * @param value An offset such as "+0100" or "-0230".
     * @returns The TimeZoneOffset instance for chaining.
     */
    setOffsetFrom(value: Offset): this {
        return this.setProperty('TZOFFSETFROM', value)
    }

    /**
     * Get the offset which is offset to during this time zone offset.
     * @returns The offset in a format such as "+0100" or "-0230".
     */
    getOffsetTo(): Offset {
        return this.getProperty('TZOFFSETTO')!.value as Offset
    }

    /**
     * Set the offset to offset to during this time zone offset.
     * @param value An offset such as "+0100" or "-0230".
     * @returns The TimeZoneOffset instance for chaining.
     */
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

    /**
     * Get the name of this time zone offset.
     * @returns The time zone offset name if it exists.
     */
    getTimeZoneName(): string | undefined {
        return this.getProperty('TZNAME')?.value
    }

    /**
     * Set the name of this time zone offset.
     * @param value The new name.
     * @returns The TimeZoneOffset instance for chaining.
     * @example
     * timeZoneOffset.setTimeZoneName('EST')
     */
    setTimeZoneName(value: string): this {
        return this.setProperty('TZNAME', value)
    }

    /**
     * Remove the name of this time zone offset.
     */
    removeTimeZoneName() {
        this.removePropertiesWithName('TZNAME')
    }

    /* eslint-disable */

    /**
     * Get the date or time when this time zone offset starts.
     * @returns The start date or time of this time zone offset.
     * @deprecated Use {@link getStart} instead.
     */
    start = this.getStart

    /**
     * Get the offset which is offset from during this time zone offset.
     * @returns The offset in a format such as "+0100" or "-0230".
     * @deprecated Use {@link getOffsetFrom} instead.
     */
    offsetFrom = this.getOffsetFrom

    /**
     * Get the offset which is offset to during this time zone offset.
     * @returns The offset in a format such as "+0100" or "-0230".
     * @deprecated Use {@link getOffsetTo} instead.
     */
    offsetTo = this.getOffsetTo

    /**
     * @deprecated Use {@link getComment} instead.
     */
    comment = this.getComment

    /**
     * Get the name of this time zone offset.
     * @returns The time zone offset name if it exists.
     * @deprecated Use {@link getTimeZoneName} instead.
     */
    timeZoneName = this.getTimeZoneName
}
