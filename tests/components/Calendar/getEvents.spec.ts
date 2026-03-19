import {
    Calendar,
    CalendarDateTime,
    CalendarEvent,
    Component,
} from '../../../src'

let calendar: Calendar
beforeEach(() => {
    calendar = new Calendar('footest')
})

it('returns no events in empty calendars', () => {
    // calendar has no components by default
    const result = calendar.getEvents()
    expect(result).toStrictEqual([])
})

it('returns no events if there are only other subcomponents', () => {
    calendar.addComponent(new Component('DUMMY'))
    const result = calendar.getEvents()
    expect(result).toStrictEqual([])
})

it('returns only components that are events', () => {
    calendar.addComponent(new Component('DUMMY'))
    calendar.addComponent(
        new CalendarEvent(
            'MyEvent',
            new CalendarDateTime('20260319T160000'),
            new CalendarDateTime('20260319T160000')
        )
    )
    calendar.addComponent(new Component('VTODO'))
    const result = calendar.getEvents()
    expect(result).toHaveLength(1)
    expect(result[0]).toBeInstanceOf(CalendarEvent)
    expect((result[0] as CalendarEvent).getUid()).toBe('MyEvent')
})
