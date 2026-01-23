import { parseDateString, parseDateTimeString } from '../date'
import * as patterns from '../patterns'
import { matchesWholeString } from '../patterns'
import type { Property } from './Property'
import { isKnownPropertyName, type KnownPropertyName } from './names'
import { type AllowedValueType, supportedValueTypes } from './valueType'

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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateRecurrenceRule(value: string) {
    // TODO: Not implemented
}

/**
 * Validate if a property value is valid text.
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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
 * @param value The unescaped property value to validate.
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

/**
 * Validate if a value is a valid content type.
 * @param value The value to validate.
 * @throws {PropertyValidationError} If the validation fails.
 */
export function validateContentType(value: string) {
    if (!matchesWholeString(patterns.contentType, value))
        throw new PropertyValidationError(
            `${value} does not match pattern for content type`
        )
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
    if (isKnownPropertyName(property.name)) {
        const name: KnownPropertyName = property.name
        supportedTypes = supportedValueTypes[name]
    }

    // Get value type
    const valueType = property.getValueType()

    // Check if value type is unsupported by the property
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
