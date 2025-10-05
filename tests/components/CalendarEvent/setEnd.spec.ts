import {
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    ComponentProperty,
} from '../../../src'

it('sets DTEND', () => {
    const start = new CalendarDateTime('20250101T123456')
    const end = new Date('2025-01-01T12:34:56')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    event.setEnd(end)

    const expected = new ComponentProperty('DTEND', '20250101T123456')
    expect(event.getProperty('DTEND')).toStrictEqual(expected)
})

it('can be set with a Date object', () => {
    const start = new CalendarDateTime('20250101T123456')
    const end = new Date('2025-01-01T12:34:56')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    expect(() => {
        event.setEnd(end)
    }).not.toThrow()
})

it("doesn't throw if start and end are DATETIME", () => {
    const start = new CalendarDateTime('20250101T123456')
    const end = new CalendarDateTime('20250101T123456')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    expect(() => {
        event.setEnd(end)
    }).not.toThrow()
})

it("doesn't throw if start and end are DATE", () => {
    const start = new CalendarDate('20250101')
    const end = new CalendarDate('20250101')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    expect(() => {
        event.setEnd(end)
    }).not.toThrow()
})

it('throws if start is DATE and end is DATETIME', () => {
    const start = new CalendarDate('20250101')
    const end = new CalendarDateTime('20250101T123456')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    expect(() => {
        event.setEnd(end)
    }).toThrow()
})

it('throws if start is DATETIME and end is DATE', () => {
    const start = new CalendarDateTime('20250101T123456')
    const end = new CalendarDate('20250101')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    )

    expect(() => {
        event.setEnd(end)
    }).toThrow()
})

it('removes DURATION', () => {
    const start = new CalendarDate('20250101')
    const end = new CalendarDate('20250102')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20250101T123456'),
        start
    ).setDuration('P1D')

    event.setEnd(end)

    expect(event.hasProperty('DURATION')).toBeFalsy()
})
