import fs from 'fs'
import readline from 'readline'
import { Calendar } from './components/Calendar'
import {
    DeserializationError,
    deserializeComponent,
    deserializeComponentString,
} from './parse'
import { ComponentValidationError } from './component'

/**
 * Read a calendar from a iCalendar file.
 * @param path Path to the file.
 * @returns The calendar deserialized from the file.
 * @throws {DeserializationError} If the file content is not a valid calendar.
 * @deprecated Use `loadCalendarSync` instead.
 */
export async function load(path: fs.PathLike): Promise<Calendar> {
    const stream = fs.createReadStream(path)
    const lines = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
    })

    const component = await deserializeComponent(lines)

    if (component.name != 'VCALENDAR') {
        throw new DeserializationError('Component must be a VCALENDAR')
    }

    return new Calendar(component)
}

/**
 * Read a calendar from a iCalendar file.
 * @param path Path to the file.
 * @param encoding The file encoding, defaults to UTF-8.
 * @returns The calendar deserialized from the file.
 * @throws {DeserializationError} If the file content is not a valid component.
 * @throws {ComponentValidationError} If the deserialized component is not a VCALENDAR.
 */
export function loadCalendarSync(
    path: fs.PathLike,
    encoding: BufferEncoding = 'utf8'
): Calendar {
    const text = fs.readFileSync(path, { encoding: encoding })
    const component = deserializeComponentString(text)
    return new Calendar(component)
}

/**
 * Write a calendar to a file.
 * @param calendar The calendar to write to file.
 * @param path Path to the file to write.
 * @example
 * dump(myCalendar, 'calendar.ics')
 * @deprecated Use `dumpCalendarSync` instead.
 */
export function dump(calendar: Calendar, path: string): Promise<void> {
    return new Promise(resolve => {
        fs.writeFile(path, calendar.serialize(), () => {
            resolve()
        })
    })
}

/**
 * Write a calendar to a file.
 * @param calendar The calendar to write to file.
 * @param path Path to the file to write.
 * @param encoding The file encoding, defaults to UTF-8.
 * @example
 * dump(myCalendar, 'calendar.ics')
 */
export function dumpCalendarSync(
    calendar: Calendar,
    path: string,
    encoding: BufferEncoding = 'utf8'
): void {
    const text = calendar.serialize()
    fs.writeFileSync(path, text, { encoding: encoding })
}
