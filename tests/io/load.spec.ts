import { load } from '../../src'

it('can load a calendar file successfully', () => {
    expect(async () => {
        await load(__dirname + '/calendar.ics')
    }).not.toThrow()
})

it('takes less than 500ms to load 1000 events', async () => {
    const start = performance.now()
    await load(__dirname + '/1000-events.ics')
    const end = performance.now()
    expect(end - start).toBeLessThan(500)
})
