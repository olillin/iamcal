import fs from 'fs'
import readline from 'readline'
import { Calendar } from './components/Calendar'
import { deserialize } from './parse'

/**
 * Read a calendar from a .ical file
 * @param path Path to the file to read
 * @throws DeserializationError Component must be of valid format
 * @throws TypeError Component must be a `VCALENDAR`
 */
export async function load(path: fs.PathLike): Promise<Calendar> {
    const stream = fs.createReadStream(path)
    const lines = readline.createInterface({ input: stream, crlfDelay: Infinity })

    const component = await deserialize(lines)

    if (component.name != 'VCALENDAR') {
        throw TypeError('Component is not a calendar')
    }

    return new Calendar(component)
}

/**
 * Write a calendar to a .ical file
 * @param calendar The calendar
 * @param path Path to the file to write
 */
export function dump(calendar: Calendar, path: string): Promise<void> {
    return new Promise(resolve => {
        fs.writeFile(path, calendar.serialize(), () => {
            resolve()
        })
    })
}
