import { Component } from '../../src/component'
import { CalendarDate, CalendarDateTime } from '../../src/date'
import { deserializeComponentString } from '../../src/parse'
import { Property } from '../../src/property/Property'

it('can parse an empty component', async () => {
    const serialized = `BEGIN:X-COMPONENT
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized)

    const expected = new Component('X-COMPONENT')
    expect(component).toStrictEqual(expected)
})

it('can parse a component with a property', async () => {
    const serialized = `BEGIN:X-COMPONENT
SUMMARY:This is a summary
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized)

    const expected = new Component('X-COMPONENT', [
        new Property('SUMMARY', 'This is a summary'),
    ])
    expect(component).toStrictEqual(expected)
})

it('can parse a component with multiple properties', async () => {
    const serialized = `BEGIN:X-COMPONENT
SUMMARY:This is a summary
DTSTART;VALUE=DATE:20251011
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized)

    const expected = new Component('X-COMPONENT', [
        new Property('SUMMARY', 'This is a summary'),
        Property.fromDate('DTSTART', new CalendarDate('20251011')),
    ])
    expect(component).toStrictEqual(expected)
})

it('can parse a calendar with an event', async () => {
    const serialized = `BEGIN:VCALENDAR
PRODID:-//Example Corp.//CalDAV Client//EN
VERSION:2.0
BEGIN:VEVENT
UID:abc123
SUMMARY:This is a summary
DTSTAMP:20251011T123456
DTSTART;VALUE=DATE:20251011
END:VEVENT
END:VCALENDAR`

    const component = await deserializeComponentString(serialized)

    const stamp = new CalendarDateTime('20251011T123456')
    const start = new CalendarDate('20251011')
    const expected = new Component(
        'VCALENDAR',
        [
            new Property('PRODID', '-//Example Corp.//CalDAV Client//EN'),
            new Property('VERSION', '2.0'),
        ],
        [
            new Component('VEVENT', [
                new Property('UID', 'abc123'),
                new Property('SUMMARY', 'This is a summary'),
                Property.fromDate('DTSTAMP', stamp),
                Property.fromDate('DTSTART', start),
            ]),
        ]
    )
    expect(component).toStrictEqual(expected)
})

it('unescapes commas in property values', async () => {
    const serialized = `BEGIN:X-COMPONENT
X-PROP:value\\,with\\, commas
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized)
    const prop = component.getProperty('X-PROP')

    expect(prop).not.toBeNull()
    expect(prop!.value).toBe('value,with, commas')
})

it('can use CRLF', async () => {
    const serialized = `BEGIN:X-COMPONENT\r
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized)

    const expected = new Component('X-COMPONENT')
    expect(component).toStrictEqual(expected)
})

it('can use CRLF in strict mode', async () => {
    const serialized = `BEGIN:X-COMPONENT\r
END:X-COMPONENT`

    const component = await deserializeComponentString(serialized, true)

    const expected = new Component('X-COMPONENT')
    expect(component).toStrictEqual(expected)
})

// it('throws if using LF in strict mode', async () => {
//     const serialized = `BEGIN:X-COMPONENT
// END:X-COMPONENT`

//     expect(async () => {
//         await deserializeComponentString(serialized, true)
//     }).toThrow()
// })

// it('passes strict mode to deserializeProperty', async () => {
//     const serialized = `BEGIN:X-COMPONENT\r
// SUMMARY:This is a
//  summary\r
// END:X-COMPONENT`

//     expect(async () => {
//         await deserializeComponentString(serialized, true)
//     }).toThrow()
// })

// it('passes strict mode to subcomponents', async () => {
//     const serialized = `BEGIN:X-COMPONENT\r
// BEGIN:X-COMPONENT\r
// BEGIN:X-COMPONENT\r
// SUMMARY:This is a
//  summary\r
// END:X-COMPONENT\r
// END:X-COMPONENT\r
// END:X-COMPONENT`

//     expect(async () => {
//         await deserializeComponentString(serialized, true)
//     }).toThrow()
// })
