import { Calendar } from './calendar'
import { dump, load } from './parse'

(async function main() {
    const calendar: Calendar = await load('demo.ics')

    calendar.events().forEach(event => {
        event.setLocation("Nowhere")
    })

    dump(calendar, "modified.ics")
})()
