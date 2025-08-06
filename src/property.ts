import { ComponentValidationError } from './component'
import { parseDateString, parseDateTimeString } from './date'
import { matchesWholeString } from './patterns'
import * as patterns from './patterns'

export interface Property {
    name: string
    params: string[]
    value: string
}

export const knownPropertyNames = [
    'CALSCALE',
    'METHOD',
    'PRODID',
    'VERSION',
    'ATTACH',
    'CATEGORIES',
    'CLASS',
    'COMMENT',
    'DESCRIPTION',
    'GEO',
    'LOCATION',
    'PERCENT-COMPLETE',
    'PRIORITY',
    'RESOURCES',
    'STATUS',
    'SUMMARY',
    'COMPLETED',
    'DTEND',
    'DUE',
    'DTSTART',
    'DURATION',
    'FREEBUSY',
    'TRANSP',
    'TZID',
    'TZNAME',
    'TZOFFSETFROM',
    'TZOFFSETTO',
    'TZURL',
    'ATTENDEE',
    'CONTACT',
    'ORGANIZER',
    'RECURRENCE-ID',
    'RELATED-TO',
    'URL',
    'UID',
    'EXDATE',
    'RDATE',
    'RRULE',
    'ACTION',
    'REPEAT',
    'TRIGGER',
    'CREATED',
    'DTSTAMP',
    'LAST-MODIFIED',
    'SEQUENCE',
    'REQUEST-STATUS',
] as const
export type KnownPropertyName = (typeof knownPropertyNames)[number]
export type AllowedPropertyName =
    | KnownPropertyName
    | (`X-${string}` & {})
    | (string & {})

export const knownValueTypes = [
    'BINARY',
    'BOOLEAN',
    'CAL-ADDRESS',
    'DATE',
    'DATE-TIME',
    'DURATION',
    'FLOAT',
    'INTEGER',
    'PERIOD',
    'RECUR',
    'TEXT',
    'TIME',
    'URI',
    'UTC-OFFSET',
] as const
export type KnownValueType = (typeof knownValueTypes)[number]
export type AllowedValueType = KnownValueType | (string & {})

/**
 * The value types that each property supports as defined by the iCalendar
 * specification. The first in the list is the default type.
 */
export const supportedValueTypes: {
    [name in KnownPropertyName]: KnownValueType[]
} = {
    CALSCALE: ['TEXT'],
    METHOD: ['TEXT'],
    PRODID: ['TEXT'],
    VERSION: ['TEXT'],
    ATTACH: ['URI', 'BINARY'],
    CATEGORIES: ['TEXT'],
    CLASS: ['TEXT'],
    COMMENT: ['TEXT'],
    DESCRIPTION: ['TEXT'],
    GEO: ['FLOAT'],
    LOCATION: ['TEXT'],
    'PERCENT-COMPLETE': ['INTEGER'],
    PRIORITY: ['INTEGER'],
    RESOURCES: ['TEXT'],
    STATUS: ['TEXT'],
    SUMMARY: ['TEXT'],
    COMPLETED: ['DATE-TIME'],
    DTEND: ['DATE-TIME', 'DATE'],
    DUE: ['DATE-TIME', 'DATE'],
    DTSTART: ['DATE-TIME', 'DATE'],
    DURATION: ['DURATION'],
    FREEBUSY: ['PERIOD'],
    TRANSP: ['TEXT'],
    TZID: ['TEXT'],
    TZNAME: ['TEXT'],
    TZOFFSETFROM: ['UTC-OFFSET'],
    TZOFFSETTO: ['UTC-OFFSET'],
    TZURL: ['URI'],
    ATTENDEE: ['CAL-ADDRESS'],
    CONTACT: ['TEXT'],
    ORGANIZER: ['CAL-ADDRESS'],
    'RECURRENCE-ID': ['DATE-TIME', 'DATE'],
    'RELATED-TO': ['TEXT'],
    URL: ['URI'],
    UID: ['TEXT'],
    EXDATE: ['DATE-TIME', 'DATE'],
    RDATE: ['DATE-TIME', 'DATE', 'PERIOD'],
    RRULE: ['RECUR'],
    ACTION: ['TEXT'],
    REPEAT: ['INTEGER'],
    TRIGGER: ['DURATION', 'DATE-TIME'],
    CREATED: ['DATE-TIME'],
    DTSTAMP: ['DATE-TIME'],
    'LAST-MODIFIED': ['DATE-TIME'],
    SEQUENCE: ['INTEGER'],
    'REQUEST-STATUS': ['TEXT'],
}

/**
 * Get the parameter value of the property VALUE parameter.
 * @param property The property to get the value type of.
 * @param defaultValue The default value to return if the property VALUE parameter is not present.
 * @returns The value type if present, else `defaultValue` or `undefined`.
 * @throws If the parameter value is invalid.
 */
export function getPropertyValueType(
    property: Property
): AllowedValueType | undefined
export function getPropertyValueType(
    property: Property,
    defaultValue: AllowedValueType
): AllowedValueType
export function getPropertyValueType(
    property: Property,
    defaultValue: AllowedValueType | undefined
): AllowedValueType | undefined
export function getPropertyValueType(
    property: Property,
    defaultValue?: AllowedValueType | undefined
): AllowedValueType | undefined {
    const found = property.params.find(param => /^VALUE=.+$/i.test(param))
    if (!found) return defaultValue

    if (!patterns.matchesWholeString(patterns.paramValue, found)) {
        throw new Error('Invalid parameter value')
    }

    // Return as uppercase if known value
    const value = found?.split('=')[1]
    if ((knownValueTypes as readonly string[]).includes(value.toUpperCase())) {
        return value.toUpperCase()
    }

    return value
}

/** Represents an error which occurs while validating a calendar property. */
export class PropertyValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PropertyValidationError'
    }
}

/** Represents an error which occurs if a required property is missing. */
export class MissingPropertyError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'MissingPropertyError'
    }
}

export function validateBinary(value: string) {
    if (!matchesWholeString(patterns.valueTypeBinary, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for BINARY`
        )
}

export function validateBoolean(value: string) {
    if (!matchesWholeString(patterns.valueTypeBoolean, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for BOOLEAN`
        )
}

export function validateCalAddress(value: string) {
    try {
        new URL(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for CAL-ADDRESS`
        )
    }
}

export function validateDate(value: string) {
    try {
        parseDateString(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for DATE`
        )
    }
}

export function validateDateTime(value: string) {
    try {
        parseDateTimeString(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for DATETIME`
        )
    }
}

export function validateDuration(value: string) {
    if (!matchesWholeString(patterns.valueTypeDuration, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for DURATION`
        )
}

export function validateFloat(value: string) {
    if (!matchesWholeString(patterns.valueTypeFloat, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for FLOAT`
        )
}

export function validateInteger(value: string) {
    if (!matchesWholeString(patterns.valueTypeInteger, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for INTEGER`
        )
}

export function validatePeriod(value: string) {
    if (!matchesWholeString(patterns.valueTypePeriod, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for PERIOD`
        )
}

export function validateRecur(value: string) {
    // TODO: Not implemented
}

export function validateText(value: string) {
    if (!matchesWholeString(patterns.valueTypeText, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for TEXT`
        )
}

export function validateTime(value: string) {
    if (!matchesWholeString(patterns.valueTypeTime, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for TIME`
        )
}

export function validateUri(value: string) {
    try {
        new URL(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for URI`
        )
    }
}

export function validateUtcOffset(value: string) {
    if (!matchesWholeString(patterns.valueTypeUtcOffset, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for UTC-OFFSET`
        )
}

export function validateValue(value: string, type: AllowedValueType) {
    switch (type) {
        case 'BINARY':
            validateBinary(value)
            break
        case 'BOOLEAN':
            validateBoolean(value)
            break
        case 'CAL-ADDRESS':
            validateCalAddress(value)
            break
        case 'DATE':
            validateDate(value)
            break
        case 'DATE-TIME':
            validateDateTime(value)
            break
        case 'DURATION':
            validateDuration(value)
            break
        case 'FLOAT':
            validateFloat(value)
            break
        case 'INTEGER':
            validateInteger(value)
            break
        case 'PERIOD':
            validatePeriod(value)
            break
        case 'RECUR':
            validateRecur(value)
            break
        case 'TEXT':
            validateText(value)
            break
        case 'TIME':
            validateTime(value)
            break
        case 'URI':
            validateUri(value)
            break
        case 'UTC-OFFSET':
            validateUtcOffset(value)
            break
        default:
            console.warn(`Cannot validate value, unknown type ${type}`)
            break
    }
}

export function validateProperty(property: Property) {
    // Get supported and default types
    let supportedTypes: AllowedValueType[] | undefined = undefined
    let defaultType: AllowedValueType | undefined = undefined

    if (knownPropertyNames.includes(property.name as KnownPropertyName)) {
        const name = property.name as KnownPropertyName
        supportedTypes = supportedValueTypes[name]
        defaultType = supportedTypes[0]
    }

    // Find value type
    const valueType = getPropertyValueType(property, defaultType)

    // If value type is unknown, validate as TEXT
    if (valueType === undefined) {
        try {
            validateText(property.value)
        } catch (e) {
            throw e instanceof PropertyValidationError
                ? new PropertyValidationError(
                      `Unknown property ${property.name} is not valid text`
                  )
                : e
        }
        return
    }

    // Check if type is unsupported
    if (supportedTypes !== undefined && !supportedTypes.includes(valueType)) {
        throw new PropertyValidationError(
            supportedTypes.length === 1
                ? `Property ${property.name} has unsupported value type ${valueType}, must be ${supportedTypes[0]}`
                : `Property ${property.name} has unsupported value type ${valueType}, must be one of ${supportedTypes.join(', ')}`
        )
    }

    // Validate according to value type
    validateValue(property.value, valueType)
}
