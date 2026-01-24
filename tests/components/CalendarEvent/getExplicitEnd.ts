import {
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
} from '../../../src'

it('returns explicit DTEND if set', () => {
    const start = new CalendarDateTime('20260123T012345')
    const end = new CalendarDateTime('20260123T123456')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setEnd(end)

    const expected = end
    expect(event.getExplicitEnd()).toStrictEqual(expected)
})

it('returns undefined if not set and type is DATE-TIME', () => {
    const start = new CalendarDateTime('20260123T012345')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    expect(event.getExplicitEnd()).toBeUndefined()
})

it('returns undefined if not set and type is DATE', () => {
    const start = new CalendarDate('20260123')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    expect(event.getExplicitEnd()).toBeUndefined()
})

