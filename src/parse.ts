import readline from 'readline'
import { Readable } from 'stream'
import { Calendar, Component } from '.'
import { CalendarEvent } from './events'

export class DeserializationError extends Error {
    name = 'DeserializationError'
}

/**
 * Deserialize a calendar component
 * @param lines the serialized component as a readline interface
 */
export async function deserialize(lines: readline.Interface): Promise<Component> {
    const component = new Component('')
    let done = false

    // We use a stack to keep track of nested components
    const stack = new Array<string>()

    const subcomponentLines = new Array<string>()

    async function processLine(line: string) {
        if (line.trim() === '') return

        if (done) {
            throw new DeserializationError('Trailing data after component end')
        }

        if (line.startsWith('BEGIN:')) {
            // Begin component
            const name = line.slice(line.indexOf(':') + 1)
            stack.push(name)

            if (stack.length == 1) {
                component.name = name
            } else {
                subcomponentLines.push(line)
            }
        } else if (line.startsWith('END:')) {
            // End component
            if (stack.length == 0) {
                throw new DeserializationError('Component end before begin')
            }

            const stackName = stack.pop()
            const name = line.slice(line.indexOf(':') + 1)
            if (stackName !== name) {
                throw new DeserializationError('Malformed subcomponent')
            }

            // Check the length of the stack after being popped
            if (stack.length == 1) {
                subcomponentLines.push(line)
                const subcomponent = await deserializeString(subcomponentLines.join('\r\n'))
                subcomponentLines.length = 0

                component.components.push(subcomponent)
            } else if (stack.length > 1) {
                subcomponentLines.push(line)
            } else if (stack.length == 0) {
                done = true
            }
        } else {
            if (stack.length == 0) throw new DeserializationError('Property outside of components')

            if (stack.length > 1) {
                // Line of subcomponent
                subcomponentLines.push(line)
            } else {
                // Property
                const colon = line.indexOf(':')
                if (colon === -1) {
                    throw new DeserializationError(`Invalid content line: ${line}`)
                }
                const name = line.slice(0, colon)
                const value = line.slice(colon + 1)

                const params = name.split(';')
                const property = {
                    name: params[0],
                    params: params.slice(1),
                    value: value,
                }

                component.properties.push(property)
            }
        }
    }

    /*
    The following code unfolds lines and passes them to be processed above.

    According to RFC 5545 content lines may be split using a line "folding"
    technique. That is, a long line can be split between any two characters by
    inserting a newline immediately followed by a white-space character.

    For example, the line:

    DESCRIPTION:This is a long description that exists on a long line.

    Can be represented as:

    DESCRIPTION:This is a lo
        ng description
        that exists on a long line.
    */
    let unfoldedLine = ''
    for await (const line of lines) {
        if (line.startsWith(' ') || line.startsWith('\t')) {
            // Unfold continuation line (remove leading whitespace and append)
            unfoldedLine += line.replace(/[\r\n]/, '').slice(1)
        } else {
            if (unfoldedLine) {
                // Process the previous unfolded line
                await processLine(unfoldedLine)
            }
            // Start a new unfolded line
            unfoldedLine = line
        }
    }

    // Process the last unfolded line
    await processLine(unfoldedLine)

    // Check that component has been closed
    if (!done) {
        throw new DeserializationError('No component end')
    }

    return component
}

/**
 * Deserialize a calendar component
 * @param text the serialized component
 */
export async function deserializeString(text: string): Promise<Component> {
    const stream = Readable.from(text)
    const lines = readline.createInterface({ input: stream, crlfDelay: Infinity })
    return deserialize(lines)
}

/**
 * Parse a calendar in ICalendar format
 * @param text the serialized calendar
 * @returns the parsed calendar
 */
export async function parseCalendar(text: string): Promise<Calendar> {
    const component = await deserializeString(text)
    if (component.name !== "VCALENDAR")
        throw new DeserializationError("Not a calendar")
    return new Calendar(component)
}

/**
 * Parse an event in ICalendar format
 * @param text the serialized event
 * @returns the parsed event
 */
export async function parseEvent(text: string): Promise<CalendarEvent> {
    const component = await deserializeString(text)
    if (component.name !== "VEVENT")
        throw new DeserializationError("Not an event")
    return new CalendarEvent(component)
}