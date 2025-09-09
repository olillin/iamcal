/**
 * This test suite validates that content lines are serialized according to
 * RFC5545 3.1.
 */

import { Component } from '../../src/component'

let component: Component

beforeEach(() => {
    component = new Component('DUMMY')
})

it('uses CRLF and not LF', () => {
    component.setProperty('SUMMARY', 'Hello world')
    const serialized = component.serialize()
    expect(serialized).toMatch(/\r\n/)
    expect(serialized).not.toMatch(/(?<!\r)\n/)
})

it('has no lines longer than 75 characters', () => {
    component.setProperty(
        'SUMMARY',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    )
    component.setProperty(
        'ABC',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusm'
    )
    const serialized = component.serialize()
    const lines = serialized.split(/$/)
    console.log(lines)
    for (const line of lines) {
        expect(line.length).toBeLessThanOrEqual(75)
    }
})
