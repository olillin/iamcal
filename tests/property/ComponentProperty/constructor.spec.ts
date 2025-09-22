import { ComponentProperty, Property } from '../../../src/property'

it('can be created with no property parameters', () => {
    const property = new ComponentProperty('X-PROP', 'My value')
    expect(property.name).toBe('X-PROP')
    expect(property.value).toBe('My value')
})

it('can be created with property parameters', () => {
    const property = new ComponentProperty('X-PROP', 'My value', {
        LANGUAGE: 'en',
        ENCODING: 'utf8',
    })
    expect(property.getParameter('LANGUAGE')).toBe('en')
    expect(property.getParameter('ENCODING')).toBe('utf8')
})
