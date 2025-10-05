import { parseDateString, parseDateTimeString } from './date'
import * as patterns from './patterns'
import { matchesWholeString } from './patterns'

/** @deprecated Use {@link ComponentProperty} instead. */
export interface Property {
    name: string
    params: string[]
    value: string
}

/**
 * Represents a property of a calendar component described by RFC 5545 in
 * Section 3.5.
 */
export class ComponentProperty implements Property {
    name: string
    value: string
    private _parameters: Map<string, string[]>
    public get parameters(): Map<string, string[]> {
        return this._parameters
    }
    /** @deprecated */
    public get params(): string[] {
        const params: string[] = []
        for (const [key, values] of this._parameters.entries()) {
            for (const value of values) {
                params.push(`${key}=${value}`)
            }
        }
        return params
    }

    constructor(
        name: string,
        value: string,
        params: { [k: string]: string | string[] } = {}
    ) {
        this.name = name
        this.value = value
        this._parameters = new Map()
        for (const [key, value] of Object.entries(params)) {
            this._parameters.set(
                key,
                typeof value === 'string' ? [value] : value
            )
        }
    }

    /**
     * Shorthand to create a ComponentProperty from a Property object until
     * Property is removed.
     * @param property The property to convert.
     * @returns The converted property.
     * @see {@link Property}
     * @deprecated Use the constructor instead.
     */
    static fromObject(property: Property): ComponentProperty {
        const prop = new ComponentProperty(property.name, property.value)
        for (const param of property.params) {
            const [paramName, paramValue] = param.split('=')
            prop.setParameter(paramName, paramValue)
        }
        return prop
    }

    setParameter(name: string, value: string | string[]) {
        this._parameters.set(name, typeof value === 'string' ? [value] : value)
    }

    /**
     * Get the values of a parameter on this property.
     * @param name The name of the parameter to get the values of.
     * @returns The values of the parameter, or undefined if the parameter is unset.
     */
    getParameter(name: string): string[] | undefined {
        return this._parameters.get(name)
    }

    /**
     * Get the first value of a parameter.
     * @param name The parameter name.
     * @returns The first value of the parameter if the parameter is set, else undefined.
     */
    getFirstParameter(name: string): string | undefined {
        return this.getParameter(name)?.[0]
    }

    /**
     * Remove all values of a parameter.
     * @param name The name of the parameter to remove.
     */
    removeParameter(name: string) {
        this._parameters.delete(name)
    }

    /**
     * Check whether this property has a parameter.
     * @param name The parameter name.
     * @returns Whether the parameter is present.
     */
    hasParameter(name: string): boolean {
        return this.getParameter(name) !== undefined
    }

    /**
     * Serialize this property into a contennt line.
     * @returns The serialized content line.
     */
    serialize(): string {
        const escapedParams = []
        for (const [paramName, paramValues] of this._parameters.entries()) {
            const escapedParamValue = paramValues
                .map(paramValue => escapePropertyParameterValue(paramValue))
                .join(',')
            escapedParams.push(`;${paramName}=${escapedParamValue}`)
        }
        const serializedValue =
            this.getValueType() === 'TEXT'
                ? escapeTextPropertyValue(this.value)
                : this.value
        return this.name + escapedParams.join() + ':' + serializedValue
    }

    /**
     * Set the value type of this property.
     * @param valueType The new value of the VALUE parameter.
     */
    setValueType(valueType: AllowedValueType) {
        this.setParameter('VALUE', valueType)
    }

    /**
     * Remove the explicit value type of this property.
     *
     * Note that this will not remove the inferred value type of this property.
     */
    removeValueType() {
        this.removeParameter('VALUE')
    }

    /**
     * Get the value type of this property. If the `VALUE` parameter is unset
     * the type will be inferred based on {@link name} or default to 'TEXT' if
     * the property is unknown.
     * @returns The value type of this property.
     */
    getValueType(): AllowedValueType {
        const setType = this.getParameter('VALUE')
        if (typeof setType === 'string') {
            return setType
        }
        if (typeof setType === 'object') {
            return setType[0]
        }

        const inferredType = supportedValueTypes[
            this.name as KnownPropertyName
        ]?.[0] as KnownValueType | undefined
        return inferredType ?? 'TEXT'
    }

    /**
     * Set the `ALTREP` parameter for this property.
     * @param uri A URI that points to an alternate representation for a textual property value.
     */
    setAlternateTextRepresentation(uri: string) {
        validateCalendarUserAddress(uri)
        this.setParameter('ALTREP', uri)
    }

    /**
     * Get the `ALTREP` parameter for this property.
     * @returns The value of the `ALTREP` parameter, or undefined if unset.
     */
    getAlternateTextRepresentation(): string | undefined {
        return this.getParameter('ALTREP')?.[0]
    }

    /**
     * Remove the `ALTREP` parameter for this property.
     */
    removeAlternateTextRepresentation() {
        this.removeParameter('ALTREP')
    }

    /**
     * Set the `CN` parameter for this property.
     * @param commonName The common name to be associated with the calendar user specified by this property.
     */
    setCommonName(commonName: string) {
        this.setParameter('CN', commonName)
    }

    /**
     * Get the `CN` parameter for this property.
     * @returns The value of the `CN` parameter, or undefined if unset.
     */
    getCommonName(): string | undefined {
        return this.getParameter('CN')?.[0]
    }

    /**
     * Remove the `CN` parameter for this property.
     */
    removeCommonName() {
        this.removeParameter('CN')
    }

    /**
     * Set the `CUTYPE` parameter for this property.
     * @param userType The type of calendar user specified by the property.
     */
    setCalendarUserType(userType: CalendarUserType) {
        this.setParameter('CUTYPE', userType)
    }

    /**
     * Get the `CUTYPE` parameter for this property.
     * @returns The value of the `CUTYPE` parameter, or undefined if unset.
     */
    getCalendarUserType(): CalendarUserType | undefined {
        return this.getParameter('CUTYPE')?.[0]
    }

    /**
     * Remove the `CUTYPE` parameter for this property.
     */
    removeCalendarUserType() {
        this.removeParameter('CUTYPE')
    }

    /**
     * Set the `DELEGATED-FROM` parameter for this property.
     * @param delegators Calendar users whom have been delegated participation in a group-scheduled event or to-do by the calendar user specified by the property.
     */
    setDelegators(...delegators: string[]) {
        delegators.forEach(validateCalendarUserAddress)
        this.setParameter('DELEGATED-FROM', delegators)
    }

    /**
     * Get the `DELEGATED-FROM` parameter for this property.
     * @returns The value of the `DELEGATED-FROM` parameter, or undefined if unset.
     */
    getDelegators(): string[] | undefined {
        return this.getParameter('DELEGATED-FROM')
    }

    /**
     * Remove the `DELEGATED-FROM` parameter for this property.
     */
    removeDelegators() {
        this.removeParameter('DELEGATED-FROM')
    }

    /**
     * Set the `DIR` parameter for this property.
     * @param uri A directory entry associated with the calendar user specified by this property.
     */
    setDirectoryEntryReference(uri: string) {
        validateCalendarUserAddress(uri)
        this.setParameter('DIR', uri)
    }

    /**
     * Get the `DIR` parameter for this property.
     * @returns The value of the `DIR` parameter, or undefined if unset.
     */
    getDirectoryEntryReference(): string | undefined {
        return this.getParameter('DIR')?.[0]
    }

    /**
     * Remove the `DIR` parameter for this property.
     */
    removeDirectoryEntryReference() {
        this.removeParameter('DIR')
    }

    /**
     * Set the `ENCODING` parameter for this property.
     * @param encoding An alternate inline encoding for this property value.
     */
    setEncoding(encoding: Encoding) {
        this.setParameter('ENCODING', encoding)
    }

    /**
     * Get the `ENCODING` parameter for this property.
     * @returns The value of the `ENCODING` parameter, or undefined if unset.
     */
    getEncoding(): Encoding | undefined {
        return this.getParameter('ENCODING')?.[0] as Encoding | undefined
    }

    /**
     * Remove the `ENCODING` parameter for this property.
     */
    removeEncoding() {
        this.removeParameter('ENCODING')
    }

    /**
     * Set the `FMTTYPE` parameter for this property.
     * @param contentType The content type of a referenced object as "type/subtype".
     * @example
     * property.setFormatType('application/msword')
     */
    setFormatType(contentType: string) {
        validateContentType(contentType)
        this.setParameter('FMTTYPE', contentType)
    }

    /**
     * Get the `FMTTYPE` parameter for this property.
     * @returns The value of the `FMTTYPE` parameter, or undefined if unset.
     */
    getFormatType(): string | undefined {
        return this.getParameter('FMTTYPE')?.[0]
    }

    /**
     * Remove the `FMTTYPE` parameter for this property.
     */
    removeFormatType() {
        this.removeParameter('FMTTYPE')
    }

    /**
     * Set the `FBTYPE` parameter for this property.
     * @param freeBusy The free or busy time type.
     */
    setFreeBusyTimeType(freeBusy: FreeBusyTimeType) {
        this.setParameter('FBTYPE', freeBusy)
    }

    /**
     * Get the `FBTYPE` parameter for this property.
     * @returns The value of the `FBTYPE` parameter, or undefined if unset.
     */
    getFreeBusyTimeType(): FreeBusyTimeType | undefined {
        return this.getParameter('FBTYPE')?.[0]
    }

    /**
     * Remove the `FBTYPE` parameter for this property.
     */
    removeFreeBusyTimeType() {
        this.removeParameter('FBTYPE')
    }

    /**
     * Set the `LANGUAGE` parameter for this property.
     * @param language The language tag identifying the language of text values on this property.
     */
    setLanguage(language: string) {
        this.setParameter('LANGUAGE', language)
    }

    /**
     * Get the `LANGUAGE` parameter for this property.
     * @returns The value of the `LANGUAGE` parameter, or undefined if unset.
     */
    getLanguage(): string | undefined {
        return this.getParameter('LANGUAGE')?.[0]
    }

    /**
     * Remove the `LANGUAGE` parameter for this property.
     */
    removeLanguage() {
        this.removeParameter('LANGUAGE')
    }

    /**
     * Set the `MEMBER` parameter for this property.
     * @param groups The group or list memberships of the calendar user specified by this property.
     * @example
     * const property = new ComponentProperty('ATTENDEE', 'mailto:user@example.org')
     * property.setMembership('mailto:group@example.org')
     */
    setMembership(...groups: string[]) {
        groups.forEach(validateCalendarUserAddress)
        this.setParameter('MEMBER', groups)
    }

    /**
     * Get the `MEMBER` parameter for this property.
     * @returns The value of the `MEMBER` parameter, or undefined if unset.
     */
    getMembership(): string[] | undefined {
        return this.getParameter('MEMBER')
    }

    /**
     * Remove the `MEMBER` parameter for this property.
     */
    removeMembership() {
        this.removeParameter('MEMBER')
    }

    /**
     * Set the `PARTSTAT` parameter for this property.
     * @param status The participation status for the calendar user specified by this property.
     */
    setParticipationStatus(status: ParticipationStatus) {
        this.setParameter('PARTSTAT', status)
    }

    /**
     * Get the `PARTSTAT` parameter for this property.
     * @returns The value of the `PARTSTAT` parameter, or undefined if unset.
     */
    getParticipationStatus(): ParticipationStatus | undefined {
        return this.getParameter('PARTSTAT')?.[0] as
            | ParticipationStatus
            | undefined
    }

    /**
     * Remove the `PARTSTAT` parameter for this property.
     */
    removeParticipationStatus() {
        this.removeParameter('PARTSTAT')
    }

    /**
     * Set the `RANGE` parameter for this property.
     * @param range The effective range of recurrence instances from the instance specified by the recurrence identifier specified by this property.
     */
    setRecurrenceIdentifierRange(range: RecurrenceIdentifierRange) {
        this.setParameter('RANGE', range)
    }

    /**
     * Get the `RANGE` parameter for this property.
     * @returns The value of the `RANGE` parameter, or undefined if unset.
     */
    getRecurrenceIdentifierRange(): RecurrenceIdentifierRange | undefined {
        return this.getParameter('RANGE')?.[0] as
            | RecurrenceIdentifierRange
            | undefined
    }

    /**
     * Remove the `RANGE` parameter for this property.
     */
    removeRecurrenceIdentifierRange() {
        this.removeParameter('RANGE')
    }

    /**
     * Set the `RELATED` parameter for this property.
     * @param relationship The relationship of the alarm trigger with respect to the start or end of the calendar component.
     */
    setAlarmTriggerRelationship(relationship: AlarmTriggerRelationship) {
        this.setParameter('RELATED', relationship)
    }

    /**
     * Get the `RELATED` parameter for this property.
     * @returns The value of the `RELATED` parameter, or undefined if unset.
     */
    getAlarmTriggerRelationship(): AlarmTriggerRelationship | undefined {
        return this.getParameter('RELATED')?.[0] as
            | AlarmTriggerRelationship
            | undefined
    }

    /**
     * Remove the `RELATED` parameter for this property.
     */
    removeAlarmTriggerRelationship() {
        this.removeParameter('RELATED')
    }

    /**
     * Set the `RELTYPE` parameter for this property.
     * @param relationship The type of hierarchical relationship associated with the calendar component specified by the property.
     * @example
     * const property = new ComponentProperty('RELATED-TO', 'vevent-uid')
     * property.setRelationshipType('SIBLING')
     */
    setRelationshipType(relationship: RelationshipType) {
        this.setParameter('RELTYPE', relationship)
    }

    /**
     * Get the `RELTYPE` parameter for this property.
     * @returns The value of the `RELTYPE` parameter, or undefined if unset.
     */
    getRelationshipType(): RelationshipType | undefined {
        return this.getParameter('RELTYPE')?.[0] as RelationshipType | undefined
    }

    /**
     * Remove the `RELTYPE` parameter for this property.
     */
    removeRelationshipType() {
        this.removeParameter('RELTYPE')
    }

    /**
     * Set the `ROLE` parameter for this property.
     * @param role The participation role for the calendar user specified by this property.
     * @example
     * const property = new ComponentProperty('ATTENDEE', 'mailto:chair@example.org')
     * property.setParticipationRole('CHAIR')
     */
    setParticipationRole(role: ParticipationRole) {
        this.setParameter('ROLE', role)
    }

    /**
     * Get the `ROLE` parameter for this property.
     * @returns The value of the `ROLE` parameter, or undefined if unset.
     */
    getParticipationRole(): ParticipationRole | undefined {
        return this.getParameter('ROLE')?.[0] as ParticipationRole | undefined
    }

    /**
     * Remove the `ROLE` parameter for this property.
     */
    removeParticipationRole() {
        this.removeParameter('ROLE')
    }

    /**
     * Set the `RSVP` parameter for this property.
     * @param rsvp Whether there is an expectation of a favor of a reply from the calendar user specified by this property value.
     * @example
     * const property = new ComponentProperty('ATTENDEE', 'mailto:user@example.org')
     * property.setRsvpExpectation('TRUE')
     */
    setRsvpExpectation(rsvp: RsvpExpectation) {
        this.setParameter('RSVP', rsvp)
    }

    /**
     * Get the `RSVP` parameter for this property.
     * @returns The value of the `RSVP` parameter, or undefined if unset.
     */
    getRsvpExpectation(): RsvpExpectation | undefined {
        return this.getParameter('RSVP')?.[0] as RsvpExpectation | undefined
    }

    /**
     * Remove the `RSVP` parameter for this property.
     */
    removeRsvpExpectation() {
        this.removeParameter('RSVP')
    }

    /**
     * Set the `SENT-BY` parameter for this property.
     * @param sentBy The calendar user that is acting on behalf of the calendar user specified by the property.
     * @example
     * const property = new ComponentProperty('ORGANIZER', 'malto:jsmith@example.com')
     * property.setSentBy('mailto:sray@example.com')
     */
    setSentBy(sentBy: string) {
        validateCalendarUserAddress(sentBy)
        this.setParameter('SENT-BY', sentBy)
    }

    /**
     * Get the `SENT-BY` parameter for this property.
     * @returns The value of the `SENT-BY` parameter, or undefined if unset.
     */
    getSentBy(): string | undefined {
        return this.getParameter('SENT-BY')?.[0]
    }

    /**
     * Remove the `SENT-BY` parameter for this property.
     */
    removeSentBy() {
        this.removeParameter('SENT-BY')
    }

    /**
     * Set the `TZID` parameter for this property.
     * @param sentBy The identifier for the time zone definition for a time component in this property value.
     * @example
     * const property = new ComponentProperty('DTSTART', '20250101T120000')
     * property.setTimeZone('Europe/Stockholm')
     */
    setTimeZone(sentBy: string) {
        validateCalendarUserAddress(sentBy)
        this.setParameter('TZID', sentBy)
    }

    /**
     * Get the `TZID` parameter for this property.
     * @returns The value of the `TZID` parameter, or undefined if unset.
     */
    getTimeZone(): string | undefined {
        return this.getParameter('TZID')?.[0]
    }

    /**
     * Remove the `TZID` parameter for this property.
     */
    removeTimeZone() {
        this.removeParameter('TZID')
    }
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

export type CalendarUserType =
    | 'INDIVIDUAL'
    | 'GROUP'
    | 'RESOURCE'
    | 'ROOM'
    | 'UNKNOWN'
    | (string & {})
export type Encoding = '8BIT' | 'BASE64'
export type FreeBusyTimeType =
    | 'FREE'
    | 'BUSY'
    | 'BUSY-UNAVAILABLE'
    | 'BUSY-TENTATIVE'
    | (string & {})
export type ParticipationStatus =
    | 'NEEDS-ACTION'
    | 'ACCEPTED'
    | 'DECLINED'
    | 'TENTATIVE'
    | 'DELEGATED'
    | 'COMPLETED'
    | 'IN-PROCESS'
    | (string & {})
export type RecurrenceIdentifierRange = 'THISANDFUTURE'
export type AlarmTriggerRelationship = 'START' | 'END'
export type RelationshipType = 'PARENT' | 'CHILD' | 'SIBLING' | (string & {})
export type ParticipationRole =
    | 'CHAIR'
    | 'REQ-PARTICIPANT'
    | 'OPT-PARTICIPANT'
    | 'NON-PARTICIPANT'
    | (string & {})
export type RsvpExpectation = 'TRUE' | 'FALSE'

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
    defaultValue?: AllowedValueType
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

/**
 * Escape special characters in a TEXT property value.
 * @param value The property value to escape.
 * @returns The escaped property value.
 * @see {@link unescapeTextPropertyValue}
 */
export function escapeTextPropertyValue(value: string): string {
    return value.replace(/(?=[,;:\\"])/g, '\\').replace(/\r?\n/g, '\\n')
}

/**
 * Unescape special characters in a TEXT property value.
 * @param value The property value to unescape.
 * @returns The unescaped property value.
 * @throws If the value contains a bad escaped character (i.e. a character that should not be escaped).
 * @see {@link unescapeTextPropertyValue}
 */
export function unescapeTextPropertyValue(value: string): string {
    const broadBadEscapePattern = /(?<!\\)\\(\\\\)*[^\\,;:"nN]/
    const broadBadEscape = broadBadEscapePattern.exec(value)
    if (broadBadEscape) {
        const badEscape = value
            .substring(broadBadEscape.index)
            .match(/\\[^\\,;:"nN@]/)!
        const position = broadBadEscape.index + badEscape.index!
        throw new SyntaxError(
            `Bad escaped character '${badEscape[0]}' at position ${position}`
        )
    }

    const jsonValue = value.replace(/\\N/, '\\n').replace(/\\(?=[,;:"])/g, '')
    return JSON.parse(`"${jsonValue}"`) as string
}

/**
 * Escape a property parameter value.
 * @param param The parameter value to escape.
 * @returns The escaped parameter value.
 * @throws If the parameter value contains a DQUOTE (") character.
 * @see {@link unescapePropertyParameterValue}
 */
export function escapePropertyParameterValue(param: string): string {
    // Property parameter values MUST NOT contain the DQUOTE character.  The
    // DQUOTE character is used as a delimiter for parameter values that
    // contain restricted characters or URI text.
    if (param.includes('"')) {
        throw new Error('Parameter value must not contain DQUOTE (").')
    }

    // Property parameter values that contain the COLON, SEMICOLON, or COMMA
    // character separators MUST be specified as quoted-string text values.
    if (/[:;,]/.test(param)) {
        return `"${param}"`
    }
    return param
}

/**
 * Unescape a property parameter value.
 * @param param The parameter value to unescape.
 * @returns The unescaped parameter value.
 * @see {@link escapePropertyParameterValue}
 */
export function unescapePropertyParameterValue(param: string): string {
    if (param.startsWith('"') && param.endsWith('"')) {
        return param.slice(1, -1)
    }
    return param
}
