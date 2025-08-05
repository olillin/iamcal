import { ICalendarDate } from './date'

// Max line length as defined by RFC 5545 3.1.
const MAX_LINE_LENGTH = 75

export interface Property {
    name: string
    params: string[]
    value: string
}

export class Component {
    name: string
    properties: Property[]
    components: Component[]

    constructor(
        name: string,
        properties?: Property[],
        components?: Component[]
    ) {
        this.name = name
        if (properties) {
            this.properties = properties
        } else {
            this.properties = []
        }
        if (components) {
            this.components = components
        } else {
            this.components = []
        }
    }

    serialize(): string {
        // Create lines
        const lines = [`BEGIN:${this.name}`]

        for (const property of this.properties) {
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

        for (const component of this.components) {
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

    setProperty(name: string, value: string | ICalendarDate): this {
        for (const property of this.properties) {
            if (property.name === name) {
                if (typeof value === 'string') {
                    property.value = value
                } else {
                    const prop = value.toProperty(name)
                    property.params = prop.params
                    property.value = prop.value
                }
                return this
            }
        }
        this.properties.push(
            typeof value === 'string'
                ? {
                      name: name,
                      params: [],
                      value: value,
                  }
                : value.toProperty(name)
        )
        return this
    }

    hasProperty(name: string, value?: string): boolean {
        for (const property of this.properties) {
            if (
                property.name === name &&
                (value === undefined || property.value === value)
            ) {
                return true
            }
        }
        return false
    }

    removePropertiesWithName(name: string) {
        const index = this.properties.findIndex(p => p.name === name)
        if (index === -1) return
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

    addComponents(components: Component[]): this {
        this.components.push(...components)
        return this
    }

    /**
     * Remove a component from this component.
     * @param component The component to remove.
     * @returns `true` if the component was removed. `false` if the component was not present.
     */
    removeComponent(component: Component): boolean {
        const index = this.components.indexOf(component)
        if (index === -1) return false

        // Remove element at index from list
        this.components.splice(index, 1)

        return true
    }

    getComponentsWithName(name: string): Component[] {
        const components: Component[] = []

        for (const component of this.components) {
            if (component.name === name) {
                components.push(component)
            }
        }

        return components
    }
}
