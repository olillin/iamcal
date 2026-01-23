import { Property } from '../../../src/property/Property'

it('is uppercase after creation', () => {
    const property = new Property('dtstart', '20251005T120000')
    expect(property.name).toBe('DTSTART')
})

it('is uppercase after assignment', () => {
    const property = new Property('dtstart', '20251005T120000')
    property.name = 'dtstart'
    expect(property.name).toBe('DTSTART')
})
