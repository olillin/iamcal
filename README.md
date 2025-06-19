# iamcal [![build status](https://img.shields.io/github/actions/workflow/status/olillin/iamcal/npm-test.yml?style=flat-square)](https://github.com/olillin/iamcal/actions/workflows/npm-test.yml) [![npm badge](<https://img.shields.io/npm/v/iamcal?style=flat-square&color=red>)](https://www.npmjs.com/package/iamcal)

A library for reading, modifying and writing [ICalendar](https://en.wikipedia.org/wiki/ICalendar) files.

## Installation

**iamcal** can be installed from the npm registry:

```console
npm install iamcal
```

## Getting started

### Parsing and editing a calendar

This code:

```typescript
import { Calendar } from 'iamcal'
import { dump } from 'iamcal/io'
import { parseCalendar } from 'iamcal/parse'

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

calendar.events().forEach(event => {
    if (event.summary() === "🎉iamcal release party") {
        event.setLocation("My house (budget cuts sorry)")
    }
})

await dump(calendar, "./new_calendar.ics")
```

produces the file `new_calendar.ics`:

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
