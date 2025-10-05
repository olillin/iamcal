import { load } from '../../src'

it('can load a calendar file successfully', () => {
    expect(async () => {
        await load(__dirname + '/calendar.ics')
    }).not.toThrow()
})

it('takes less than 5,000ms to load 1,000 events', async () => {
    const start = performance.now()
    await load(__dirname + '/1000-events.ics')
    const end = performance.now()
    expect(end - start).toBeLessThan(500)
}, 6_000)

it('does not have a complexity worse than linear', async () => {
    const start = performance.now()
    await load(__dirname + '/10-000-events.ics')
    const end1 = performance.now()
    await load(__dirname + '/20-000-events.ics')
    const end2 = performance.now()
    await load(__dirname + '/40-000-events.ics')
    const end3 = performance.now()

    const time1 = end1 - start
    const time2 = end2 - end1
    const time3 = end3 - end2

    console.log(`Took ${time1.toFixed(0)} ms to parse 10,000 events`)
    console.log(`Took ${time2.toFixed(0)} ms to parse 20,000 events`)
    console.log(`Took ${time3.toFixed(0)} ms to parse 40,000 events`)

    expect(time2 / time1).toBeCloseTo(2, 1)
    expect(time3 / time2).toBeCloseTo(2, 1)
    expect(time3 / time1).toBeCloseTo(4, 1)
}, 100_000)
