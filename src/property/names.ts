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

/**
 * Check if a property name is known. A property name is known if it is present
 * in {@link knownPropertyNames}.
 * @param name The property name to check.
 * @returns If the name is a known property name.
 */
export function isKnownPropertyName(
    name: AllowedPropertyName
): name is KnownPropertyName {
    return knownPropertyNames.includes(name as KnownPropertyName)
}
