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
