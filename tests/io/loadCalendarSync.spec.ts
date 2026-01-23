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

it('takes less than 5,000ms to load 1,000 events', () => {
    const time = loadCompressed(__dirname + '/resources/1-000-events.ics.zip')
    expect(time).toBeLessThan(5000)
}, 6_000)

it('does not have a complexity worse than linear', () => {
    const time1 = loadCompressed(__dirname + '/resources/10-000-events.ics.zip')
    const time2 = loadCompressed(__dirname + '/resources/20-000-events.ics.zip')
    const time3 = loadCompressed(__dirname + '/resources/40-000-events.ics.zip')

    console.log(`Took ${time1.toFixed(0)} ms to parse 10,000 events`)
    console.log(`Took ${time2.toFixed(0)} ms to parse 20,000 events`)
    console.log(`Took ${time3.toFixed(0)} ms to parse 40,000 events`)

    expect(time2 / time1).toBeLessThan(2.5)
    expect(time3 / time2).toBeLessThan(2.5)
    expect(time3 / time1).toBeLessThan(5.0)
}, 100_000)

afterAll(() => {
    fs.rm(destinationPath, { recursive: true, force: true }, () => {})
})
