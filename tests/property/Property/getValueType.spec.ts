import { Property } from '../../../src'

it('returns the explicit type when set', () => {
    const property = new Property('DTSTART', '20250729T120000Z', {
        VALUE: 'DATE',
    })
    const result = property.getValueType()
    expect(result).toBe('DATE')
})

it('returns default when parameter missing', () => {
    const property = new Property('DTSTART', '20250729T120000Z')
    const result = property.getValueType()
    expect(result).toBe('DATE-TIME')
})

it('returns TEXT for unknown parameters', () => {
    const property = new Property('X-UNKNOWN', '')
    const result = property.getValueType()
    expect(result).toBe('TEXT')
})

it('is case-insensitive', () => {
    const property = new Property('DTSTART', '20250729', {
        value: 'date',
    })
    const result = property.getValueType()
    expect(result).toStrictEqual('DATE')
})
