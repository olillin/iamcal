class VNode {
    name: String
    elements: Array<String|VNode>

    serialize(): String {
        let serialized = `BEGIN:${this.name}`
        for (let element of this.elements) {
            if (element instanceof VNode) {
                serialized += "\n" + element.serialize()
            } else {
                serialized += "\n" + element
            }
        }
        serialized += `\nEND:${this.name}`

        return serialized
    }

    deserialize(serialized: String): VNode {
        // TODO
    }

    /**
     * @returns All `VNode` elements
     */
    children(): Array<VNode> {
        return this.elements.filter(e => e instanceof VNode)
    }

    /**
     * @returns All string elements
     */
    fields(): Array<String> {
        return this.elements.filter(e => e instanceof String)
    }
}

class Calendar extends VNode {
    name = "VCALENDAR"

    events(): Array<CalendarEvent> {
        const events = new Array<CalendarEvent>()
        
        for (let node of this.children()) {
            if (node.name == "EVENT") {
                events.push(node as CalendarEvent)
            }
        }

        return events
    }
}

class CalendarEvent extends VNode {
    name = "VEVENT"

    start(): Date {
        // TODO
    }
}

/**
 * Read a calendar from a .ical file
 * @param file Path to the file to read
 */
function load(file: String): Calendar {

}

/**
 * Write a calendar to a .ical file
 * @param calendar The calendar
 * @param file Path to the file to write
 */
function dump(calendar: Calendar, file: String) {

}