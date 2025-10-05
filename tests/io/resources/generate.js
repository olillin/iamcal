const {
    Calendar,
    CalendarDate,
    CalendarDateTime,
    CalendarEvent,
    dump,
    padZeros,
} = require('../..')

/**
 * Generate a calendar containing a certain amount of events.
 * @param {number} eventCount How many events the calendar should contain.
 * @param {string} filename The filename to save the calendar as.
 * @returns {Promise<string>} The filename of the created calendar.
 */
async function generateEvents(eventCount, filename) {
    const calendar = new Calendar('abcd')
    for (let i = 0; i < eventCount; i++) {
        const stamp = new CalendarDateTime('20250708T120000')
        const start =
            i % 2 === 0
                ? new CalendarDateTime('20250708T120000')
                : new CalendarDate('20250708')
        const end =
            i % 2 === 0
                ? new CalendarDateTime('20250708T130000')
                : new CalendarDate('20250709')
        const description =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

        const event = new CalendarEvent(
            padZeros(i, String(eventCount - 1).length),
            stamp,
            start
        )
            .setEnd(end)
            .setSummary(`Event ${i}`)
            .setDescription(description)
            .setLocation('Lorem ipsum')
        calendar.addComponent(event)
    }

    await dump(calendar, filename)
    return filename
}

generateEvents(1_000, '1-000-events.ics')
generateEvents(10_000, '10-000-events.ics')
generateEvents(20_000, '20-000-events.ics')
generateEvents(40_000, '40-000-events.ics')
