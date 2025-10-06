import { CalendarDate, CalendarDateTime } from '../../../src/date'
import { Property } from '../../../src/property/Property'

it('can be created with no property parameters', () => {
    const property = new Property('X-PROP', 'My value')
    expect(property.name).toBe('X-PROP')
    expect(property.value).toBe('My value')
})

it('can be created with property parameters', () => {
    const property = new Property('X-PROP', 'My value', {
        LANGUAGE: 'en',
        ENCODING: 'utf8',
    })
    expect(property.getParameter('LANGUAGE')).toStrictEqual(['en'])
    expect(property.getParameter('ENCODING')).toStrictEqual(['utf8'])
})

it('converts the key of property parameters to uppercase', () => {
    const property = new Property('X-PROP', 'My value', {
        value: 'TEXT',
    })
    expect(property.getParameter('VALUE')).toStrictEqual(['TEXT'])
})

it('can be created from a CalendarDate', () => {
    const property = new Property('DTSTART', new CalendarDate('20251006'))

    expect(property.name).toBe('DTSTART')
    expect(property.value).toBe('20251006')
    expect(property.parameters).toStrictEqual(new Map([['VALUE', 'DATE']]))
})

it('can be created from a CalendarDateTime', () => {
    const property = new Property(
        'DTSTART',
        new CalendarDateTime('20251006T120000')
    )

    expect(property.name).toBe('DTSTART')
    expect(property.value).toBe('20251006')
    expect(property.parameters).toStrictEqual(new Map())
})

it('can not be created from a CalendarDate and params', () => {
    expect(() => {
        // @ts-expect-error This is a test for invalid syntax, so an error is expected
        const property = new Property('DTSTART', new CalendarDate('20251006'), {
            VALUE: 'DATE-TIME',
        })
    }).toThrow()
})

it('can not be created from a CalendarDateTime and params', () => {
    expect(() => {
        // @ts-expect-error This is a test for invalid syntax, so an error is expected
        const property = new Property(
            'DTSTART',
            new CalendarDateTime('20251006T120000'),
            { VALUE: 'DATE' }
        )
    }).toThrow()
})
