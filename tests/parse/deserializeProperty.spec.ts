import { deserializeProperty, Property } from '../../src'

// TODO
it('unfolds lines', () => {
    const serialized = `SUMMARY:my \r
 long\r
 line wowowow`

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', 'my longline wowowow')
    expect(property).toStrictEqual(expected)
})
