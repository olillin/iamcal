# iamcal [![build status](https://img.shields.io/github/actions/workflow/status/olillin/iamcal/npm-test.yml?style=flat-square)](https://github.com/olillin/iamcal/actions/workflows/npm-test.yml) [![npm badge](https://img.shields.io/npm/v/iamcal?style=flat-square&color=red)](https://www.npmjs.com/package/iamcal)

A library for reading, modifying and writing [iCalendar](https://en.wikipedia.org/wiki/ICalendar) files.

## Installation

**iamcal** can be installed from the npm registry:

```console
npm install iamcal
```

## Getting started

### Parsing and editing a calendar

Below is an example of editing a calendar file.

```typescript
import { Calendar, dump, parseCalendar } from 'iamcal'

const calendar: Calendar = await parseCalendar(`
BEGIN:VCALENDAR
VERSION:2.0
PRODID:example
BEGIN:VEVENT
SUMMARY:🎉iamcal release party
LOCATION:Las Vegas!!
UID:20241209T100000Z-EF79AE@example.com
DTSTAMP:20241209T100000Z
DTSTART:20241211T200000Z
DTEND:20241211T230000Z
END:VEVENT
END:VCALENDAR
`)

calendar.getEvents().forEach(event => {
    if (event.getSummary() === '🎉iamcal release party') {
        event.setLocation('My house (budget cuts sorry)')
    }
})

await dump(calendar, './new_calendar.ics')
```

Running the code will produce the file `new_calendar.ics`:

```icalendar
BEGIN:VCALENDAR
VERSION:2.0
PRODID:example
BEGIN:VEVENT
SUMMARY:🎉iamcal release party
LOCATION:My house (budget cuts sorry)
UID:20241209T100000Z-EF79AE@example.com
DTSTAMP:20241209T100000Z
DTSTART:20241211T200000Z
DTEND:20241211T230000Z
END:VEVENT
END:VCALENDAR
```

### Creating a new calendar

Below is an example of creating a new calendar from scratch.

```typescript
const calendar = new Calendar('example')

const uid = '6c9fabd0-cc8f-4900-b795-40e3d125b233'
const stamp = new CalendarDateTime('2025-07-06T12:00:00')
const start = new CalendarDateTime('2025-07-08T17:00:00')
const end = new CalendarDateTime('2025-07-08T20:00:00')

const event = new CalendarEvent(uid, stamp, start)
    .setEnd(end)
    .setSummary('Celebrating my new calendar!')
    .setDescription('I made it with iamcal')

calendar.addComponent(event)

const calendarText = calendar.serialize()
console.log(calendarText)
```

Running the code above will produce the following output:

```icalendar
BEGIN:VCALENDAR
PRODID:example
VERSION:2.0
BEGIN:VEVENT
UID:6c9fabd0-cc8f-4900-b795-40e3d125b233
DTSTAMP:20250706T120000
DTSTART:20250708T170000
DTEND:20250708T200000
SUMMARY:Celebrating my new calendar!
DESCRIPTION:I made it with iamcal
END:VEVENT
END:VCALENDAR
```
