import { ComponentProperty, Property } from '../../../src/property'

const property: Property = {
    name: 'X-PROP',
    value: 'My value',
    params: ['LANGUAGE=en'],
}

it('sets the correct name', () => {
    const cp = ComponentProperty.fromObject(property)
    expect(cp.name).toBe('X-PROP')
})

it('sets the correct value', () => {
    const cp = ComponentProperty.fromObject(property)
    expect(cp.value).toBe('My value')
})

it('sets the correct parameters', () => {
    const cp = ComponentProperty.fromObject(property)
    expect(cp.hasParameter('LANGUAGE')).toBeTruthy()
    expect(cp.getParameter('LANGUAGE')).toEqual(['en'])
})
