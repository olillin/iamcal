import { getDefaultValueType } from '../../../src/property/valueType'

it('returns DATE-TIME for DTSTART', () => {
    const valueType = getDefaultValueType('DTSTART')
    expect(valueType).toBe('DATE-TIME')
})

it('returns DATE-TIME for DTEND', () => {
    const valueType = getDefaultValueType('DTEND')
    expect(valueType).toBe('DATE-TIME')
})

it('returns DATE-TIME for DTSTAMP', () => {
    const valueType = getDefaultValueType('DTSTAMP')
    expect(valueType).toBe('DATE-TIME')
})

it('returns TEXT for UID', () => {
    const valueType = getDefaultValueType('UID')
    expect(valueType).toBe('TEXT')
})

it('returns TEXT for SUMMARY', () => {
    const valueType = getDefaultValueType('SUMMARY')
    expect(valueType).toBe('TEXT')
})

it('returns TEXT for DESCRIPTION', () => {
    const valueType = getDefaultValueType('DESCRIPTION')
    expect(valueType).toBe('TEXT')
})

it('returns CAL-ADDRESS for ATTENDEE', () => {
    const valueType = getDefaultValueType('ATTENDEE')
    expect(valueType).toBe('CAL-ADDRESS')
})

it('is case-insensitive', () => {
    const valueType = getDefaultValueType('dtstart')
    expect(valueType).toBe('DATE-TIME')
})

it('returns TEXT for unknown properties', () => {
    const valueType = getDefaultValueType('X-UNKNOWN')
    expect(valueType).toBe('TEXT')
})
