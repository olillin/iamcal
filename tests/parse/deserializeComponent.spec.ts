import { deserializeComponentString } from '../../src/parse'

// TODO
it('unescapes commas in property values', async () => {
    const serialized = `BEGIN:X-COMPONENT
X-PROP:value\\,with\\, commas
END:X-COMPONENT`
    const component = await deserializeComponentString(serialized)
    const prop = component.getProperty('X-PROP')
    expect(prop).not.toBeNull()
    expect(prop!.value).toBe('value,with, commas')
})
