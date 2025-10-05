import { ComponentProperty } from '../../../src/property'

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
    expect(property.getParameter('LANGUAGE')).toStrictEqual(['en'])
    expect(property.getParameter('ENCODING')).toStrictEqual(['utf8'])
})
