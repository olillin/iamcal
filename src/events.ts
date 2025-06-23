import { Component } from '.'

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
            component.setProperty('DTSTAMP', dtstamp.toISOString())
        } else {
            component = a as Component
        }
        super(component.name, component.properties, component.components)
    }

    stamp(): Date {
        return new Date(this.getProperty('DTSTAMP')!.value)
    }

    setStamp(value: Date) {
        this.setProperty('DTSTAMP', value.toISOString())
    }

    uid(): string {
        return this.getProperty('UID')!.value
    }

    setUid(value: string) {
        this.setProperty('UID', value)
    }

    summary(): string {
        return this.getProperty('SUMMARY')!.value
    }

    setSummary(value: string) {
        this.setProperty('SUMMARY', value)
    }

    removeSummary() {
        this.removePropertiesWithName('SUMMARY')
    }

    description(): string {
        return this.getProperty('DESCRIPTION')!.value
    }

    setDescription(value: string) {
        this.setProperty('DESCRIPTION', value)
    }

    removeDescription() {
        this.removePropertiesWithName('DESCRIPTION')
    }

    location(): string | undefined {
        return this.getProperty('LOCATION')?.value
    }

    setLocation(value: string) {
        this.setProperty('LOCATION', value)
    }

    removeLocation() {
        this.removePropertiesWithName('LOCATION')
    }

    start(): Date {
        return new Date(this.getProperty('DTSTART')!.value)
    }

    setStart(value: Date) {
        this.setProperty('DTSTART', value.toISOString())
    }

    removeStart() {
        this.removePropertiesWithName('DTSTART')
    }

    end(): Date {
        return new Date(this.getProperty('DTEND')!.value)
    }

    setEnd(value: Date) {
        this.setProperty('DTEND', value.toISOString())
    }

    removeEnd() {
        this.removePropertiesWithName('DTEND')
    }

    created(): Date | undefined {
        const text = this.getProperty('CREATED')?.value
        if (!text) return
        return new Date(text)
    }

    setCreated(value: Date) {
        this.setProperty('CREATED', value.toISOString())
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

    setGeo(latitude: number, longitude: number) {
        const text = `${latitude},${longitude}`
    }
}


export class CalendarEventCollection extends Array<CalendarEvent> {
    constructor(events: CalendarEvent[])
    constructor(...events: CalendarEvent[])
    constructor(events: any) {
        super(...events as CalendarEvent[])
        Object.setPrototypeOf(this, CalendarEventCollection.prototype)
    }

    add(event: CalendarEvent) {
        this.push(event)
    }

    remove(event: CalendarEvent) {
        const index = this.indexOf(event)
        if (index !== -1) {
            this.splice(index, 1)
        }
    }

    findByUid(uid: string): CalendarEvent | undefined {
        return this.find(event => event.uid() === uid)
    }
}