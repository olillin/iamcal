import { CalendarDate } from '../../../src/date'
import { Property } from '../../../src/property/Property'

// TODO
it('returns a string in the form "NAME;param=value:value"', () => {
    const property = new Property('DTSTART', new CalendarDate('20251006'))
})
