import { Calendar, CalendarDateTime, CalendarEvent, Component } from '../../../src'

const time = new CalendarDateTime("20260319T170000")

let calendar: Calendar
let event: CalendarEvent
beforeEach(() => {
	calendar = new Calendar("")
	event = new CalendarEvent("foobar", time, time)
	calendar.addComponent(event)
})

it('can remove an event by instance', () => {
	calendar.removeEvent(event)
	expect(calendar.components).toStrictEqual([])
})

it('can remove an event by UID', () => {
	calendar.removeEvent("foobar")
	expect(calendar.components).toStrictEqual([])
})

it('does not remove events with other IDs', () => {
	calendar.removeEvent("spam")
	expect(calendar.components).toHaveLength(1)
})

it('does not remove other components events with other IDs', () => {
	calendar.addComponent(new Component("FOO"))
	calendar.removeEvent("foobar")
	expect(calendar.components).toHaveLength(1)
})
