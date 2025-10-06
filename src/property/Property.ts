import { CalendarDateOrTime } from 'src/date'
import {
    escapePropertyParameterValue,
    escapeTextPropertyValue,
    foldLine,
} from './escape'
import {
    AlarmTriggerRelationship,
    CalendarUserType,
    Encoding,
    FreeBusyTimeType,
    ParticipationRole,
    ParticipationStatus,
    RecurrenceIdentifierRange,
    RelationshipType,
    RsvpExpectation,
} from './parameter'
import { validateCalendarUserAddress, validateContentType } from './validate'
import { AllowedValueType, getDefaultValueType } from './valueType'

/**
 * Represents a property of a calendar component as described by RFC 5545 in
 * Section 3.5.
 */
export class Property {
    private _name: string
    public get name(): string {
        return this._name
    }
    public set name(value: string) {
        this._name = value.toUpperCase()
    }

    value: string

    private _parameters: Map<string, string[]>
    public get parameters(): Map<string, string[]> {
        return this._parameters
    }

    constructor(
        name: string,
        value: string,
        params: { [k: string]: string | string[] } = {}
    ) {
        this._name = name.toUpperCase()
        this.value = value
        this._parameters = new Map()
        for (const [key, value] of Object.entries(params)) {
            this._parameters.set(
                key.toUpperCase(),
                typeof value === 'string' ? [value] : value
            )
        }
    }

    static fromDate(name: string, value: CalendarDateOrTime): Property {
        return new Property(
            name,
            value.getValue(),
            value.isFullDay() ? { VALUE: 'DATE' } : undefined
        )
    }

    setParameter(name: string, value: string | string[]) {
        this._parameters.set(
            name.toUpperCase(),
            typeof value === 'string' ? [value] : value
        )
    }

    /**
     * Get the values of a parameter on this property.
     * @param name The name of the parameter to get the values of.
     * @returns The values of the parameter, or undefined if the parameter is unset.
     */
    getParameter(name: string): string[] | undefined {
        return this._parameters.get(name.toUpperCase())
    }

    /**
     * Get the first value of a parameter.
     * @param name The name of the parameter to get the value of.
     * @returns The first value of the parameter if the parameter is set, else undefined.
     */
    getFirstParameter(name: string): string | undefined {
        return this.getParameter(name.toUpperCase())?.[0]
    }

    /**
     * Remove all values of a parameter.
     * @param name The name of the parameter to remove.
     */
    removeParameter(name: string) {
        this._parameters.delete(name.toUpperCase())
    }

    /**
     * Check whether this property has a parameter.
     * @param name The parameter name to check.
     * @returns Whether the parameter is present.
     */
    hasParameter(name: string): boolean {
        return this.getParameter(name.toUpperCase()) !== undefined
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
        const line = this.name + escapedParams.join() + ':' + serializedValue
        return foldLine(line)
    }

    /**
     * Set the value type of this property.
     * @param valueType The new value of the VALUE parameter.
     */
    setValueType(valueType: AllowedValueType) {
        this.setParameter('VALUE', valueType.toUpperCase())
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
        const assignedValueType = this.getParameter('VALUE')?.[0].toUpperCase()
        return assignedValueType ?? getDefaultValueType(this.name)
    }

    /**
     * Check whether this property has an explicit value type set.
     * @returns Whether this property has the VALUE parameter.
     */
    hasValueType(): boolean {
        return this.hasParameter('VALUE')
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
