import { parseDateString, parseDateTimeString } from './date'
import * as patterns from './patterns'
import { matchesWholeString } from './patterns'

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
 * Get the value type of a property, as defined by the VALUE parameter.
 * @param property The property to get the value type of.
 * @returns The value type if present, else `undefined`.
 * @throws If the parameter value is misformed.
 */
export function getPropertyValueType(
    property: Property
): AllowedValueType | undefined

/**
 * Get the value type of a property, as defined by the VALUE parameter.
 * @param property The property to get the value type of.
 * @param defaultValue The default value to return if the property VALUE parameter is not present.
 * @returns The value type if present, else `defaultValue` or `undefined`.
 * @throws If the parameter value is misformed.
 */
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
        throw new Error('Parameter value is misformed')
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

/**
 * Validate if a property value is a valid binary string.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateBinary(value: string) {
    if (!matchesWholeString(patterns.valueTypeBinary, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for BINARY`
        )
}

/**
 * Validate if a property value is a valid boolean.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateBoolean(value: string) {
    if (!matchesWholeString(patterns.valueTypeBoolean, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for BOOLEAN`
        )
}

/**
 * Validate if a property value is a valid calendar user address.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateCalendarUserAddress(value: string) {
    try {
        new URL(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for CAL-ADDRESS`
        )
    }
}

/**
 * Validate if a property value is a valid date.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateDate(value: string) {
    try {
        parseDateString(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for DATE`
        )
    }
}

/**
 * Validate if a property value is a valid date-time.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateDateTime(value: string) {
    try {
        parseDateTimeString(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for DATETIME`
        )
    }
}

/**
 * Validate if a property value is a valid duration.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateDuration(value: string) {
    if (!matchesWholeString(patterns.valueTypeDuration, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for DURATION`
        )
}

/**
 * Validate if a property value is a valid float.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateFloat(value: string) {
    if (!matchesWholeString(patterns.valueTypeFloat, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for FLOAT`
        )
}

/**
 * Validate if a property value is a valid integer.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateInteger(value: string) {
    if (!matchesWholeString(patterns.valueTypeInteger, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for INTEGER`
        )
}

/**
 * Validate if a property value is a valid period.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validatePeriod(value: string) {
    if (!matchesWholeString(patterns.valueTypePeriod, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for PERIOD`
        )
}

/**
 * Validate if a property value is a valid recurrence rule.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateRecurrenceRule(value: string) {
    // TODO: Not implemented
}

/**
 * Validate if a property value is valid text.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateText(value: string) {
    if (!matchesWholeString(patterns.valueTypeText, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for TEXT`
        )
}

/**
 * Validate if a property value is a valid time.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateTime(value: string) {
    if (!matchesWholeString(patterns.valueTypeTime, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for TIME`
        )
}

/**
 * Validate if a property value is a valid URI.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateUri(value: string) {
    try {
        new URL(value)
    } catch {
        throw new PropertyValidationError(
            `${value} does not match pattern for URI`
        )
    }
}

/**
 * Validate if a property value is a valid UTC offset.
 * @param value The property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateUtcOffset(value: string) {
    if (!matchesWholeString(patterns.valueTypeUtcOffset, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for UTC-OFFSET`
        )
}

/**
 * Validate a property value for a set value type.
 * @param value The property value to validate.
 * @param type The property value type which `value` will be validated against.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateValue(value: string, type: AllowedValueType) {
    switch (type) {
        case 'BINARY':
            validateBinary(value)
            break
        case 'BOOLEAN':
            validateBoolean(value)
            break
        case 'CAL-ADDRESS':
            validateCalendarUserAddress(value)
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
            validateRecurrenceRule(value)
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

/* eslint-disable jsdoc/require-description-complete-sentence --
 * Does not allow line to end with ':'.
 **/

/**
 * Validate the value of a property based on it's value type.
 *
 * The validation will fail if the property:
 *
 * - has a value which is not valid for its value type.
 * - has a value type which is not valid for that property.
 * - has no known value type and is invalid TEXT. (see below)
 *
 * Unknown properties are validated as TEXT by if no value type is set, as
 * defined by {@link https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.8|RFC5545#3.8.8.}
 * @param property The property to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
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
/* eslint-enable jsdoc/require-description-complete-sentence */
