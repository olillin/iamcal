import AdmZip from 'adm-zip'
import fs from 'fs'
import { load } from '../../src'

const destinationPath = __dirname + '/resources/temp'

/**
 * Load a compessed calendar file.
 * @param filename The file to load.
 * @returns The time it took to parse the file in milliseconds.
 */
async function loadCompressed(filename: string): Promise<number> {
    const zip = new AdmZip(filename)
    zip.extractAllTo(destinationPath)
    const name = filename.split(/\/(?=[^/]*$)/)[1]
    const calendarPath = `${destinationPath}/${name.replace(/\.zip$/, '')}`

    const start = performance.now()
    await load(calendarPath)
    const end = performance.now()

    return end - start
}

it('can load a calendar file successfully', () => {
    expect(async () => {
        await load(__dirname + '/resources/calendar.ics')
    }).not.toThrow()
})

it('takes less than 5,000ms to load 1,000 events', async () => {
    const time = await loadCompressed(
        __dirname + '/resources/1-000-events.ics.zip'
    )
    expect(time).toBeLessThan(500)
}, 6_000)

it('does not have a complexity worse than linear', async () => {
    const time1 = await loadCompressed(
        __dirname + '/resources/10-000-events.ics.zip'
    )
    const time2 = await loadCompressed(
        __dirname + '/resources/20-000-events.ics.zip'
    )
    const time3 = await loadCompressed(
        __dirname + '/resources/40-000-events.ics.zip'
    )

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
