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

it('can serialize empty components', () => {
    const component = new Component('X-COMPONENT')

    const serialized = component.serialize()

    const expected = `BEGIN:X-COMPONENT
END:X-COMPONENT`
    expect(serialized).toBe(expected)
})

it('can serialize multiline properties', () => {
    const component = new Component('X-COMPONENT')
    component.setProperty('DESCRIPTION', 'Aktivitet: Tentamen\n' +
        'Kurs: Principer för parallell programmering (DIT392GU, TDA384)\n' +
        'Hitta din tentamen: https://cloud.timeedit.net/chalmers/web/public/ri1Q4.html\n' +
        'Registrering: 2026-06-06 - 2026-07-02')

    const serialized = component.serialize()

    const expected = `BEGIN:X-COMPONENT
DESCRIPTION:Aktivitet: Tentamen\\nKurs: Principer för parallell programmerin\r
 g (DIT392GU\\, TDA384)\\nHitta din tentamen: https://cloud.timeedit.net/chal\r
 mers/web/public/ri1Q4.html\\nRegistrering: 2026-06-06 - 2026-07-02
END:X-COMPONENT`
    expect(serialized).toBe(expected)
})
