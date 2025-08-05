import { Component } from '../component'
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

    setMethod(value: string): this {
        return this.setProperty('METHOD', value)
    }

    removeMethod() {
        this.removePropertiesWithName('METHOD')
    }

    calendarName(): string | undefined {
        return this.getProperty('X-WR-CALNAME')?.value
    }

    setCalendarName(value: string): this {
        return this.setProperty('X-WR-CALNAME', value)
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
