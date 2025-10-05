import {
    CalendarDateTime,
    CalendarEvent,
    Component,
    ComponentProperty,
} from '../../../src'

it('sets the UID property', () => {
    const uid = '1234'
    const stamp = new CalendarDateTime('2025-07-05T16:00:00')
    const start = new CalendarDateTime('2025-08-06T17:30:00')

    const event = new CalendarEvent(uid, stamp, start)

    const expected = new ComponentProperty('UID', uid)
    expect(event.getProperty('UID')).toEqual(expected)
})

it('sets the DTSTAMP property', () => {
    const uid = '1234'
    const stamp = new CalendarDateTime('2025-07-05T16:00:00')
    const start = new CalendarDateTime('2025-08-06T17:30:00')

    const event = new CalendarEvent(uid, stamp, start)

    const expected = new ComponentProperty('DTSTAMP', '20250705T160000')
    expect(event.getProperty('DTSTAMP')).toEqual(expected)
})

it('sets the DTSTART property', () => {
    const uid = '1234'
    const stamp = new CalendarDateTime('2025-07-05T16:00:00')
    const start = new CalendarDateTime('2025-08-06T17:30:00')

    const event = new CalendarEvent(uid, stamp, start)

    const expected = new ComponentProperty('DTSTART', '20250806T173000')
    expect(event.getProperty('DTSTART')).toEqual(expected)
})

it('can be created from a CalendarEvent', () => {
    const uid = '1234'
    const stamp = new CalendarDateTime('2025-07-05T16:00:00')
    const start = new CalendarDateTime('2025-08-06T17:30:00')

    const base = new CalendarEvent(uid, stamp, start)

    let event: CalendarEvent | null = null
    expect(() => {
        event = new CalendarEvent(base)
    }).not.toThrow()
    if (event != null) {
        expect(event).toBeInstanceOf(CalendarEvent)
        expect(event).toEqual(base)
    }
})

it('throws if created from a component that is not a VEVENT', () => {
    const component = new Component('INVALID')
    component.setProperty('UID', '1234')
    component.setProperty('DTSTAMP', '20250705T160000')
    component.setProperty('DTSTART', '20250806T173000')

    expect(() => {
        new CalendarEvent(component)
    }).toThrow()
})

it('throws if created from a VEVENT component without UID', () => {
    const component = new Component('VEVENT')
    component.setProperty('DTSTAMP', '20250705T160000')
    component.setProperty('DTSTART', '20250806T173000')

    expect(() => {
        new CalendarEvent(component)
    }).toThrow()
})

it('throws if created from a VEVENT component without DTSTAMP', () => {
    const component = new Component('VEVENT')
    component.setProperty('UID', '1234')
    component.setProperty('DTSTART', '20250806T173000')

    expect(() => {
        new CalendarEvent(component)
    }).toThrow()
})

it('throws if created from a VEVENT component without DTSTART', () => {
    const component = new Component('VEVENT')
    component.setProperty('UID', '1234')
    component.setProperty('DTSTAMP', '20250705T160000')

    expect(() => {
        new CalendarEvent(component)
    }).toThrow()
})
