import AdmZip from 'adm-zip'
import fs from 'fs'
import { loadCalendarSync } from '../../src'

const destinationPath = __dirname + '/resources/temp'

/**
 * Load a compessed calendar file.
 * @param filename The file to load.
 * @returns The time it took to parse the file in milliseconds.
 */
function loadCompressed(filename: string): number {
    const zip = new AdmZip(filename)
    zip.extractAllTo(destinationPath)
    const name = filename.split(/\/(?=[^/]*$)/)[1]
    const calendarPath = `${destinationPath}/${name.replace(/\.zip$/, '')}`

    const start = performance.now()
    loadCalendarSync(calendarPath)
    const end = performance.now()

    return end - start
}

it('can load a calendar file successfully', () => {
    expect(() => {
        loadCalendarSync(__dirname + '/resources/calendar.ics')
    }).not.toThrow()
})

it('can load a large calendar file with 1,000 events', () => {
    expect(() => {
        const time = loadCompressed(__dirname + '/resources/1-000-events.ics.zip')
        console.log(`Took ${time.toFixed(0)} ms to load 1,000 events`)
    }).not.toThrow()
})

it('can load a large calendar file with 40,000 events', () => {
    expect(() => {
        const time = loadCompressed(__dirname + '/resources/40-000-events.ics.zip')
        console.log(`Took ${time.toFixed(0)} ms to load 40,000 events`)
    }).not.toThrow()
})

afterAll(() => {
    fs.rm(destinationPath, { recursive: true, force: true }, () => {})
})
