import {
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    CalendarDuration,
} from '../../../src'

it('returns explicit DURATION if set', () => {
    const start = new CalendarDateTime('20260123T012345')
    const duration = new CalendarDuration('P5H')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setDuration(duration)

    const expected = duration
    expect(event.getDuration()).toStrictEqual(expected)
})

it('returns instant duration if unset with type DATE-TIME', () => {
    const start = new CalendarDateTime('20260123T012345')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    const expected = new CalendarDuration('PT0S')
    expect(event.getDuration()).toStrictEqual(expected)
})

it('returns one day if unset with type DATE', () => {
    const start = new CalendarDate('20260123')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    )

    const expected = new CalendarDuration('P1D')
    expect(event.getDuration()).toStrictEqual(expected)
})

it('returns calculated duration if end is set with type DATE-TIME', () => {
    const start = new CalendarDateTime('20260123T123456')
    const end = new CalendarDateTime('20260123T153557')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setEnd(end)

    const expected = new CalendarDuration('PT3H2M1S')
    expect(event.getEnd()).toStrictEqual(expected)
})

it('returns calculated duration if end is set with type DATE', () => {
    const start = new CalendarDateTime('20260123')
    const end = new CalendarDateTime('20260125')
    const event = new CalendarEvent(
        '1234',
        new CalendarDateTime('20260123T123456'),
        start
    ).setEnd(end)

    const expected = new CalendarDuration('P2D')
    expect(event.getEnd()).toStrictEqual(expected)
})
