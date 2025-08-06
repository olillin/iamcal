import {
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    Property,
} from '../../../src'

it('sets DTSTAMP', () => {
    const start = new CalendarDateTime('20250101T123456')
    const stamp = new CalendarDateTime('20250101T123456')
    const event = new CalendarEvent('1234', new Date(0), start)

    event.setStamp(stamp)

    const expected: Property = {
        name: 'DTSTAMP',
        params: [],
        value: '20250101T123456',
    }
    expect(event.getProperty('DTSTAMP')).toEqual(expected)
})

it('can be set with a Date object', () => {
    const start = new CalendarDateTime('20250101T123456')
    const stamp = new CalendarDateTime('20250101T123456')
    const event = new CalendarEvent('1234', new Date(0), start)

    expect(() => {
        event.setStamp(stamp)
    }).not.toThrow()
})

it('cannot be set with a CalendarDate object', () => {
    const start = new CalendarDateTime('20250101T123456')
    const stamp = new CalendarDate('20250101')
    const event = new CalendarEvent('1234', new Date(0), start)

    expect(() => {
        // @ts-expect-error
        event.setStamp(stamp)
    }).toThrow()
})
