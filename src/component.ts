import { CalendarDateOrTime } from './date'
import { Property } from './property/Property'
import type { AllowedPropertyName, KnownPropertyName } from './property/names'
import {
    MissingPropertyError,
    PropertyValidationError,
    validateProperty,
} from './property/validate'

/**
 * Represents an error which occurs while validating a calendar component.
 */
export class ComponentValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ComponentValidationError'
    }
}

/**
 * Represents an error which occurs when trying to perform an operation which
 * would break the state of a calendar component.
 */
export class IllegalOperationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IllegalOperationError'
    }
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
            this.properties = []
            properties.forEach(property => {
                this.addProperty(property)
            })
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
            const line = property.serialize()
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

    setProperty(name: string, value: string | CalendarDateOrTime): this {
        for (const property of this.properties) {
            if (property.name !== name) continue

            if (typeof value === 'string') {
                property.value = value
                return this
            }

            const dateProperty = Property.fromDate(name, value)

            // Update value type
            if (dateProperty.getValueType() === 'DATE')
                property.setValueType('DATE')
            else property.removeValueType()

            // Update value
            property.value = dateProperty.value

            return this
        }
        // Property is new
        this.properties.push(
            typeof value === 'string'
                ? new Property(name, value)
                : Property.fromDate(name, value)
        )
        return this
    }

    /**
     * Add a property to this component.
     * @param property The property to add.
     * @returns This component for chaining.
     * @throws {IllegalOperationError} If the property cannot be added to this component.
     */
    addProperty(property: Property): this {
        // TODO: Validate if property can be added to this component.
        this.properties.push(property)
        return this
    }

    /**
     * Check whether this component has a certain property.
     * @param name The property name to check.
     * @param value An optional value to check against the property. If this is specified the property value must equal this value.
     * @returns Whether the property is present and matches the value if given.
     */
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

    /**
     * Validate the component according to the rules of the iCalendar
     * specification.
     *
     * This method should be overridden by subclasses to
     * implement specific validation logic. The methods
     * {@link validateRequiredProperty} and {@link validateOptionalProperty} may
     * help with this.
     * @throws {ComponentValidationError} If the component is invalid.
     */
    validate(): void {}

    /**
     * Validate that a property exists and is valid using {@link validateProperty}.
     * @param propertyName The name of the property to validate.
     * @throws {MissingPropertyError} If the property doesn't exist on this component.
     * @throws {PropertyValidationError} If the property exists but is invalid.
     */
    validateRequiredProperty(propertyName: AllowedPropertyName) {
        const property = this.getProperty(propertyName)
        if (property == null)
            throw new MissingPropertyError(
                `Missing required property ${propertyName}`
            )
        validateProperty(property)
    }

    /**
     * Validate that a property is valid using {@link validateProperty} if it exists.
     * @param propertyName The name of the property to validate.
     * @throws {PropertyValidationError} If the property exists and is invalid.
     */
    validateOptionalProperty(propertyName: AllowedPropertyName) {
        const property = this.getProperty(propertyName)
        if (property != null) validateProperty(property)
    }

    /**
     * Validate all properties on this component.
     *
     * If a property is in `requiredProperties` it is
     * validated with {@link validateRequiredProperty}, otherwise it is
     * validated with {@link validateOptionalProperty}.
     * @param requiredProperties A list of property names which are required on this component.
     */
    validateAllProperties(requiredProperties?: AllowedPropertyName[]) {
        requiredProperties?.forEach(propertyName => {
            if (!this.hasProperty(propertyName)) {
                throw new MissingPropertyError(
                    `Missing required property ${propertyName}`
                )
            }
        })

        this.properties.forEach(property => {
            if (
                requiredProperties?.includes(property.name as KnownPropertyName)
            ) {
                this.validateRequiredProperty(property.name)
            } else {
                this.validateOptionalProperty(property.name)
            }
        })
    }
}
