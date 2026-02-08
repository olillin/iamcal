import type { calendar_v3 } from "googleapis"
import { CalendarDateOrTime, CalendarEvent, padZeros, parseDateString, Property } from "."

function formatDate(date: Date): string {
    return padZeros(date.getFullYear(), 4) + '-'
        + padZeros(date.getMonth() + 1, 2) + '-'
        + padZeros(date.getDate(), 2)
}

function formatDateTime(date: Date): string {
    return date.toISOString()
}

export function toGoogleDate(date: CalendarDateOrTime): calendar_v3.Schema$EventDateTime {
    if (date.isFullDay()) {
        return {
            date: formatDate(date.getDate())
        }
    } else {
        return {
            dateTime: formatDateTime(date.getDate())
        }
    }
}

function toGoogleEvent(event: CalendarEvent): calendar_v3.Schema$Event {
    if (!event.getProperty('DTEND')) {
        throw new Error('Event is missing DTEND which is required')
    }

    return {
        start: toGoogleDate(event.getStart()),
        end: toGoogleDate(event.getEnd()),
        summary: event.getSummary(),
        description: event.getDescription(),
        location: event.getLocation(),
    }
}

