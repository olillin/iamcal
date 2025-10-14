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
