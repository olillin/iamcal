/* eslint-disable */

const {
    Calendar,
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    dump,
    padZeros,
} = require('../..')

const calendar = new Calendar('abcd')
for (let i = 0; i <= 999; i++) {
    const stamp = new CalendarDateTime('20250708T120000')
    const start =
        i % 2 === 0
            ? new CalendarDateTime('20250708T120000')
            : new CalendarDate('20250708')
    const end =
        i % 2 === 0
            ? new CalendarDateTime('20250708T130000')
            : new CalendarDate('20250709')
    const description = String.raw`Lorem ipsum dolor sit amet\, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam\, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident\, sunt in culpa qui officia deserunt mollit anim id est laborum.`

    const event = new CalendarEvent(padZeros(i, 3), stamp, start)
        .setEnd(end)
        .setSummary(`Event ${i}`)
        .setDescription(description)
        .setLocation('Lorem ipsum')
    calendar.addComponent(event)
}
dump(calendar, '1000-events.ics')
