import readline from 'readline'
import { Readable } from 'stream'
import { Component } from './component'
import { Calendar, CalendarEvent } from './components'
import {
    isNameChar,
    isParameterValueChar,
    isPropertyValueChar,
} from './patterns'
import { Property } from './property/Property'
import {
    unescapePropertyParameterValue,
    unescapeTextPropertyValue,
} from './property/escape'

/** Represents an error that occurs when deserializing a calendar component. */
export class DeserializationError extends Error {
    name = 'DeserializationError'
}

/**
 * Deserialize a calendar component.
 * @param lines The serialized component as a **readline** interface.
 * @param strict If true, newlines must be CRLF. Defaults to false.
 * @returns The deserialized calendar component object.
 * @throws {DeserializationError} If the component is invalid.
 */
export async function deserializeComponent(
    lines: readline.Interface,
    strict: boolean = false
): Promise<Component> {
    const component = new Component('')
    let done = false

    // We use a stack to keep track of nested components
    const stack = new Array<string>()

    const subcomponentLines = new Array<string>()

    const processLine = async (line: string) => {
        if (line.trim() === '') return

        if (done) {
            throw new DeserializationError(
                'Found trailing data after component end'
            )
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
                throw new DeserializationError(
                    'Unexpected component end outside of components'
                )
            }

            const stackName = stack.pop()
            const name = line.slice(line.indexOf(':') + 1)
            if (stackName !== name) {
                throw new DeserializationError('Malformed subcomponent')
            }

            // Check the length of the stack after being popped
            if (stack.length == 1) {
                subcomponentLines.push(line)
                const subcomponent = await deserializeComponentString(
                    subcomponentLines.join('\r\n'),
                    strict
                )
                subcomponentLines.length = 0

                component.components.push(subcomponent)
            } else if (stack.length > 1) {
                subcomponentLines.push(line)
            } else if (stack.length == 0) {
                done = true
            }
        } else {
            if (stack.length == 0)
                throw new DeserializationError(
                    'Found stray property outside of components'
                )

            if (stack.length > 1) {
                // Line of subcomponent
                subcomponentLines.push(line)
            } else {
                // Property
                const property = deserializeProperty(line, strict)
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
        throw new DeserializationError('Component has no end')
    }

    return component
}

/**
 * Deserialize a calendar component string.
 * @param text The serialized component.
 * @param strict If true, newlines must be CRLF. Defaults to false.
 * @returns The deserialized component object.
 * @throws {DeserializationError} If the component is invalid.
 */
export async function deserializeComponentString(
    text: string,
    strict: boolean = false
): Promise<Component> {
    const stream = Readable.from(text)
    const lines = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
    })
    return deserializeComponent(lines, strict)
}

/**
 * Parse a serialized calendar.
 * @param text A serialized calendar as you would see in an iCalendar file.
 * @returns The parsed calendar object.
 */
export async function parseCalendar(text: string): Promise<Calendar> {
    const component = await deserializeComponentString(text)
    return new Calendar(component)
}

/**
 * Parse a serialized calendar event.
 * @param text A serialized event as you would see in an iCalendar file.
 * @returns The parsed event object.
 */
export async function parseEvent(text: string): Promise<CalendarEvent> {
    const component = await deserializeComponentString(text)
    return new CalendarEvent(component)
}

/**
 * Deserialize a component property.
 * @param line The serialized content line that defines this property.
 * @param strict If true, newlines must be CRLF. Defaults to false.
 * @returns The deserialized property.
 * @throws {DeserializationError} If content line is invalid.
 */
export function deserializeProperty(
    line: string,
    strict: boolean = false
): Property {
    // A stack to store characters before joining to a string
    const stack = new Array<string>(line.length)
    let stackPos = 0

    /**
     * Get the string currently contained in {@link stack} and reset the stack.
     * @returns The string of characters below {@link stackPos} in {@link stack}.
     */
    function gatherStack(): string {
        const s = stack.slice(0, stackPos).join('')
        stackPos = 0
        return s
    }

    let propertyName: string | undefined = undefined
    const rawParameters: Map<string, string[]> = new Map()

    let currentParam: string | undefined = undefined
    let quoted: boolean = false
    let hasQuote: boolean = false
    enum Step {
        Name,
        ParamName,
        ParamValue,
        Value,
    }
    let step: Step = Step.Name

    for (const char of line) {
        // Handle folded content lines
        const last = stack[stackPos - 1]
        if (last === '\r') {
            if (char !== '\n')
                throw new DeserializationError('Invalid CR in content line.')

            stack[stackPos++] = char
            continue
        } else if (char === '\n')
            if (strict) {
                throw new DeserializationError('Invalid LF in content line.')
            } else {
                stack[stackPos++] = char
                continue
            }

        if (last === '\n') {
            if (char !== ' ' && char !== '\t')
                throw new DeserializationError('Invalid CRLF in content line.')

            // Valid folded line sequence, remove (CR)LF
            if (stack[stackPos - 2] === '\r') {
                stackPos -= 2
            } else {
                stackPos -= 1
            }
            continue
        }

        if (char === '\r') {
            stack[stackPos++] = char
            continue
        }

        // Process character
        if (step === Step.Name) {
            // Continue parsing name
            if (isNameChar(char)) {
                stack[stackPos++] = char
            } else if (char === ';') {
                // End of name, begin parameters
                propertyName = gatherStack()
                stackPos = 0
                step = Step.ParamName
            } else if (char === ':') {
                // End of name, begin value
                propertyName = gatherStack()
                stackPos = 0
                step = Step.Value
            } else {
                throw new DeserializationError(
                    `Invalid character "${char}" in content line name.`
                )
            }
        } else if (step === Step.ParamName) {
            // Continue parsing parameter name
            if (isNameChar(char)) {
                stack[stackPos++] = char
            } else if (char === '=') {
                // End of parameter name, begin parameter value
                if (stackPos === 0)
                    throw new DeserializationError(
                        'Parameter name cannot be empty.'
                    )

                currentParam = gatherStack()
                if (!rawParameters.has(currentParam)) {
                    rawParameters.set(currentParam, [])
                }
                step = Step.ParamValue
            } else {
                throw new DeserializationError(
                    `Invalid character "${char}" in parameter name.`
                )
            }
        } else if (step === Step.ParamValue) {
            // Continue parsing parameter value
            if (char === '"') {
                if (quoted) {
                    quoted = false
                } else {
                    if (stackPos !== 0)
                        throw new DeserializationError(
                            'Invalid characters before quote in parameter value.'
                        )

                    quoted = true
                    hasQuote = true
                }
            } else if (isParameterValueChar(char, quoted)) {
                if (!quoted && hasQuote)
                    if (stackPos !== 0)
                        throw new DeserializationError(
                            'Invalid characters after quote in parameter value.'
                        )

                stack[stackPos++] = char
            } else if (char === ',') {
                // End of parameter value, begin next parameter value
                if (currentParam === undefined)
                    throw new DeserializationError(
                        'Invalid state, parameter name is undefined.'
                    )
                const paramValue = gatherStack()
                rawParameters.get(currentParam)!.push(paramValue)
                hasQuote = false
                step = Step.ParamValue
            } else if (char === ';') {
                // End of parameter value, begin next parameter name
                if (currentParam === undefined)
                    throw new DeserializationError(
                        'Invalid state, parameter name is undefined.'
                    )
                const paramValue = gatherStack()
                rawParameters.get(currentParam)!.push(paramValue)
                step = Step.ParamName
            } else if (char === ':') {
                // End of parameter value, begin value
                if (currentParam === undefined)
                    throw new DeserializationError(
                        'Invalid state, parameter name is undefined.'
                    )
                const paramValue = gatherStack()
                rawParameters.get(currentParam)!.push(paramValue)
                step = Step.Value
            }
        } else if (step === Step.Value) {
            // Continue parsing value
            if (isPropertyValueChar(char)) {
                stack[stackPos++] = char
            } else if (char === '\r' || char === '\n') {
                stack[stackPos++] = char
            }
        } else {
            throw new DeserializationError('Parser got lost, step is invalid.')
        }
    }

    // Final checks
    if (quoted)
        throw new DeserializationError(
            'Unterminated quote in content line value.'
        )
    if (!propertyName) {
        throw new DeserializationError(`Invalid content line, invalid format.`)
    }

    // The content line value is whatever is left in the stack
    const rawValue: string = gatherStack()

    // Parse parameters and value
    const parsedParameters: { [k: string]: string[] } = {}
    for (const [key, values] of rawParameters) {
        const parsedValues = values.map(unescapePropertyParameterValue)
        parsedParameters[key] = parsedValues
    }
    const parsedValue = unescapeTextPropertyValue(rawValue)

    return new Property(propertyName, parsedValue, parsedParameters)
}
