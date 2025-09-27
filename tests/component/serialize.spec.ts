import { Component } from '../../src/component'

it('escapes commas in property values', () => {
    const component = new Component('X-COMPONENT')
    component.setProperty('X-PROP', 'value,with, commas')

    const serialized = component.serialize()

    const line1 = serialized.split('\n')[1]
    expect(line1).toBe(String.raw`X-PROP:value\,with\, commas`)
})

it('escapes backslashes in property values', () => {
    const component = new Component('X-COMPONENT')
    component.setProperty('X-PROP', String.raw`this\has\\\backslashes`)

    const serialized = component.serialize()

    const line1 = serialized.split('\n')[1]
    expect(line1).toBe(String.raw`X-PROP:this\\has\\\\\\backslashes`)
})
