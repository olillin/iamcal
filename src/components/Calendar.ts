import { KnownPropertyName } from '../property'
import { Component, ComponentValidationError } from '../component'
import { CalendarEvent } from './CalendarEvent'

/**
 * Represents a VCALENDAR component, the root component of an iCalendar file.
 */
export class Calendar extends Component {
    name = 'VCALENDAR'

    /**
     * @param prodid A unique identifier of the program creating the calendar.
     * @example
     * new Calendar('-//Google Inc//Google Calendar 70.9054//EN')
     */
    constructor(prodid: string)

    /**
     * @param prodid A unique identifier of the program creating the calendar.
     * @param version The version of the iCalendar specification that this calendar uses.
     * @example
     * new Calendar('-//Google Inc//Google Calendar 70.9054//EN')
     */
    constructor(prodid: string, version: string)

    /**
     * @param component A VCALENDAR component.
     */
    constructor(component: Component)
    constructor(a?: string | Component, b?: string) {
        let component: Component
        if (a instanceof Component) {
            component = a as Component
            Calendar.prototype.validate.call(component)
        } else {
            const prodid = a as string
            const version = (b as string) ?? '2.0'
            component = new Component('VCALENDAR')
            component.setProperty('PRODID', prodid)
            component.setProperty('VERSION', version)
        }
        super(component.name, component.properties, component.components)
    }

    validate() {
        if (this.name !== 'VCALENDAR')
            throw new ComponentValidationError(
                'Component name must be VCALENDAR'
            )
        const requiredProperties: KnownPropertyName[] = ['PRODID', 'VERSION']
        this.validateAllProperties(requiredProperties)
    }

    getEvents(): CalendarEvent[] {
        return this.getComponentsWithName('VEVENT').map(
            c => new CalendarEvent(c)
        )
    }

    removeEvent(event: CalendarEvent): boolean
    removeEvent(uid: string): boolean
    removeEvent(a: CalendarEvent | string): boolean {
        if (a instanceof CalendarEvent) {
            const event = a as CalendarEvent
            return this.removeComponent(event)
        } else {
            const uid = a as string
            for (const event of this.getEvents()) {
                if (event.getUid() !== uid) continue
                return this.removeComponent(event)
            }
        }
        return false
    }

    getProductId(): string {
        return this.getProperty('PRODID')!.value
    }

    setProductId(value: string): this {
        return this.setProperty('PRODID', value)
    }

    getVersion(): string {
        return this.getProperty('VERSION')!.value
    }

    setVersion(value: string): this {
        return this.setProperty('VERSION', value)
    }

    getCalendarScale(): string | undefined {
        return this.getProperty('CALSCALE')?.value
    }

    setCalendarScale(value: string): this {
        return this.setProperty('CALSCALE', value)
    }

    removeCalendarScale() {
        this.removePropertiesWithName('CALSCALE')
    }

    getMethod(): string | undefined {
        return this.getProperty('METHOD')?.value
    }

    setMethod(value: string): this {
        return this.setProperty('METHOD', value)
    }

    removeMethod() {
        this.removePropertiesWithName('METHOD')
    }

    getCalendarName(): string | undefined {
        return this.getProperty('X-WR-CALNAME')?.value
    }

    setCalendarName(value: string): this {
        return this.setProperty('X-WR-CALNAME', value)
    }

    removeCalendarName() {
        this.removePropertiesWithName('X-WR-CALNAME')
    }

    getCalendarDescription(): string | undefined {
        return this.getProperty('X-WR-CALDESC')?.value
    }

    setCalendarDescription(value: string): this {
        return this.setProperty('X-WR-CALDESC', value)
    }

    removeCalendarDescription() {
        this.removePropertiesWithName('X-WR-CALDESC')
    }

    /** @deprecated use {@link getEvents} instead */
    events = this.getEvents
    /** @deprecated use {@link getProductId} instead */
    prodId = this.getProductId
    /** @deprecated use {@link setProductId} instead */
    setProdId = this.setProductId
    /** @deprecated use {@link getVersion} instead */
    version = this.getVersion
    /** @deprecated use {@link getCalendarScale} instead */
    calScale = this.getCalendarScale
    /** @deprecated use {@link setCalendarScale} instead */
    setCalScale = this.setCalendarScale
    /** @deprecated use {@link removeCalendarScale} instead */
    removeCalScale = this.removeCalendarScale
    /** @deprecated use {@link getMethod} instead */
    method = this.getMethod
    /** @deprecated use {@link getCalendarName} instead */
    calendarName = this.getCalendarName
    /** @deprecated use {@link getCalendarDescription} instead */
    calendarDescription = this.getCalendarDescription
}
