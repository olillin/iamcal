export interface Property {
    name: string
    params: string[]
    value: string
}

// Max line length as defined by RFC 5545 3.1.
const MAX_LINE_LENGTH = 75

export class Component {
    name: string
    properties: Array<Property>
    components: Array<Component>

    constructor(name: string, properties?: Array<Property>, components?: Array<Component>) {
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
                line = " " + line.substring(MAX_LINE_LENGTH)
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

    setProperty(name: string, value: string) {
        for (const property of this.properties) {
            if (property.name === name) {
                property.value = value
                return
            }
        }
        this.properties.push({
            name: name,
            params: [],
            value: value,
        })
    }

    getPropertyParams(name: string): string[] | null {
        for (const property of this.properties) {
            if (property.name === name) {
                return property.params
            }
        }
        return null
    }

    setPropertyParams(name: string, params: string[]) {
        for (const property of this.properties) {
            if (property.name === name) {
                property.params = params
            }
        }
    }
}

export class Calendar extends Component {
    name = 'VCALENDAR'

    constructor(component: Component) {
        super(component.name, component.properties, component.components)
    }

    events(): Array<CalendarEvent> {
        const events = new Array<CalendarEvent>()

        for (let component of this.components) {
            if (component.name === 'VEVENT') {
                events.push(new CalendarEvent(component))
            }
        }

        return events
    }
}

export class CalendarEvent extends Component {
    name = 'VEVENT'

    constructor(component: Component) {
        super(component.name, component.properties, component.components)
    }

    summary(): string {
        return this.getProperty('SUMMARY')!.value
    }

    setSummary(value: string) {
        this.setProperty("SUMMARY", value)
    }

    description(): string {
        return this.getProperty('DESCRIPTION')!.value
    }

    setDescription(value: string) {
        this.setProperty("DESCRIPTION", value)
    }

    location(): string | undefined {
        return this.getProperty('LOCATION')?.value
    }

    setLocation(value: string) {
        this.setProperty("LOCATION", value)
    }

    start(): Date {
        return new Date(this.getProperty('DTSTART')!.value)
    }

    setStart(value: Date) {
        this.setProperty("DTSTART", value.toISOString())
    }

    end(): Date {
        return new Date(this.getProperty('DTEND')!.value)
    }
    
    setEnd(value: Date) {
        this.setProperty("DTEND", value.toISOString())
    }
}
