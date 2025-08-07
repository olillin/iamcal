import { CalendarDateTime, CalendarEvent } from '../../../src'

it('serializes as VEVENT', () => {
    const stamp = new CalendarDateTime('2025-08-06T17:30:00')
    const start = stamp
    const end = new CalendarDateTime('2025-08-06T18:30:00')

    const event = new CalendarEvent('1234', stamp, start).setEnd(end)
    const serialized = event.serialize()
    const firstRow = serialized.split('\n')[0]

    expect(firstRow).toBe('BEGIN:VEVENT')
})

it('throws without end or duration', () => {
    const stamp = new CalendarDateTime('2025-08-06T17:30:00')
    const start = stamp

    const event = new CalendarEvent('1234', stamp, start)

    expect(() => {
        event.serialize()
    }).toThrow()
})

it("doesn't throw when end is set", () => {
    const stamp = new CalendarDateTime('2025-08-06T17:30:00')
    const start = stamp
    const end = new CalendarDateTime('2025-08-06T18:30:00')

    const event = new CalendarEvent('1234', stamp, start).setEnd(end)

    expect(() => {
        event.serialize()
    }).not.toThrow()
})

it("doesn't throw when duration is set", () => {
    const stamp = new CalendarDateTime('2025-08-06T17:30:00')
    const start = stamp
    const duration = 'PT1H'

    const event = new CalendarEvent('1234', stamp, start).setDuration(duration)

    expect(() => {
        event.serialize()
    }).not.toThrow()
})
