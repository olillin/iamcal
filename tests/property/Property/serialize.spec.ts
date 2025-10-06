import { CalendarDate } from '../../../src/date'
import { Property } from '../../../src/property/Property'

// TODO
it('returns a string in the form "NAME;param=value:value"', () => {
    const property = Property.fromDate('DTSTART', new CalendarDate('20251006'))

    const serialized = property.serialize()

    expect(serialized).toBe('DTSTART;VALUE=DATE:20251006')
})

it('folds long lines', () => {
    const property = new Property(
        'Description',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at rutrum velit, condimentum semper arcu. Sed sed nisi mollis, semper est ut, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum, euismod sit amet magna ac, vulputate accumsan ex. Phasellus ullamcorper accumsan ultrices. Nullam vehicula ipsum neque, nec malesuada lectus volutpat vel. Nunc rhoncus lectus sed lorem pretium tempus.'
    )

    const serialized = property.serialize()

    expect(serialized).toContain('\r\n ')
})
