import fs from 'fs'
import readline from 'readline'
import { Calendar } from './components/Calendar'
import { DeserializationError, deserializeComponent } from './parse'

/**
 * Read a calendar from a iCalendar file.
 * @param path Path to the file.
 * @returns The calendar deserialized from the file.
 * @throws {DeserializationError} If the file content is not a valid calendar.
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
 * Write a calendar to a file.
 * @param calendar The calendar to write to file.
 * @param path Path to the file to write.
 * @example
 * dump(myCalendar, 'calendar.ics')
 */
export function dump(calendar: Calendar, path: string): Promise<void> {
    return new Promise(resolve => {
        fs.writeFile(path, calendar.serialize(), () => {
            resolve()
        })
    })
}
