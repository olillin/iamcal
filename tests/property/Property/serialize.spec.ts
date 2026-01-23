import { CalendarDate } from '../../../src/date'
import { Property } from '../../../src/property/Property'

it('returns a string in the form "NAME;param=value:value"', () => {
    const property = Property.fromDate('DTSTART', new CalendarDate('20251006'))

    const serialized = property.serialize()

    expect(serialized).toBe('DTSTART;VALUE=DATE:20251006')
})

it('folds long lines', () => {
    const property = new Property(
        'DESCRIPTION',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at rutrum velit, condimentum semper arcu. Sed sed nisi mollis, semper est ut, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum, euismod sit amet magna ac, vulputate accumsan ex. Phasellus ullamcorper accumsan ultrices. Nullam vehicula ipsum neque, nec malesuada lectus volutpat vel. Nunc rhoncus lectus sed lorem pretium tempus.'
    )

    const serialized = property.serialize()

    expect(serialized).toContain('\r\n ')
})

it('quotes unsafe parameter values', () => {
    const property = new Property('LOCATION', 'House 123', {
        ALTREP: 'https://example.com/house123',
    })

    const serialized = property.serialize()

    expect(serialized).toBe(
        'LOCATION;ALTREP="https://example.com/house123":House 123'
    )
})

it('escapes special characters in value', () => {
    const property = new Property(
        'DESCRIPTION',
        'This sentence, contains a comma'
    )

    const serialized = property.serialize()

    expect(serialized).toBe('DESCRIPTION:This sentence\\, contains a comma')
})

it('supports no params', () => {
    const property = new Property('DESCRIPTION', 'This is my description')

    const serialized = property.serialize()

    expect(serialized).toBe('DESCRIPTION:This is my description')
})

it('supports multiple params', () => {
    const property = new Property('SUMMARY', 'value', {
        VALUE: 'TEXT',
        LANGUAGE: 'en-US',
        ALTREP: 'http://e.se',
    })

    const serialized = property.serialize()

    expect(serialized).toBe(
        'SUMMARY;VALUE=TEXT;LANGUAGE=en-US;ALTREP="http://e.se":value'
    )
})

it('does not return a string ending with a newline', () => {
    let property = Property.fromDate('DTSTART', new CalendarDate('20251006'))
    let serialized = property.serialize()
    expect(serialized).not.toMatch(/[\r\n]$/s)

    property = new Property(
        'DESCRIPTION',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at rutrum velit, condimentum semper arcu. Sed sed nisi mollis, semper est ut, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum, euismod sit amet magna ac, vulputate accumsan ex. Phasellus ullamcorper accumsan ultrices. Nullam vehicula ipsum neque, nec malesuada lectus volutpat vel. Nunc rhoncus lectus sed lorem pretium tempus.'
    )
    serialized = property.serialize()
    expect(serialized).not.toMatch(/[\r\n]$/s)
})

it('capitalizes property names', () => {
    const property = new Property('summary', 'My event')
    const serialized = property.serialize()
    expect(serialized).toBe('SUMMARY:My event')
})
