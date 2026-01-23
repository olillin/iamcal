import {
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    CalendarDuration,
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
    expect(event.getEnd()).toStrictEqual(expected)
})

it('returns DTSTART for implied duration with type DATE-TIME', () => {
    const start = new CalendarDateTime('20260123T012345')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    const expected = start
    expect(event.getEnd()).toStrictEqual(expected)
})

it('returns the next day for implied duration with type DATE', () => {
    const start = new CalendarDate('20260123')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    const expected = new CalendarDate('20260124')
    expect(event.getEnd()).toStrictEqual(expected)
})

it('returns calculated end if duration is set with type DATE-TIME', () => {
    const start = new CalendarDateTime('20260123T012345')
    const duration = new CalendarDuration('PT5H')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setDuration(duration)

    const expected = new CalendarDateTime('20260123T062345')
    expect(event.getEnd()).toStrictEqual(expected)
})

it('returns calculated end if duration is set with type DATE', () => {
    const start = new CalendarDateTime('20260123T012345')
    const duration = new CalendarDuration('P2D')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setDuration(duration)

    const expected = new CalendarDateTime('20260125T012345')
    expect(event.getEnd()).toStrictEqual(expected)
})

