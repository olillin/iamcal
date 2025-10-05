import type { AllowedPropertyName, KnownPropertyName } from './names'

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
 * The value types that each known property supports as defined by the iCalendar
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
 * Get the default value type of a property based on its name.
 * @param name The name of the property.
 * @returns The default value type of the property, or `TEXT` if the property is unknown.
 */
export function getDefaultValueType(name: AllowedPropertyName): KnownValueType {
    const defaultType = supportedValueTypes[
        name.toUpperCase() as KnownPropertyName
    ]?.[0] as KnownValueType | undefined
    return defaultType ?? 'TEXT'
}
