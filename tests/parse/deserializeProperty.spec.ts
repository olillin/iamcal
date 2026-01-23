import { deserializeProperty, Property } from '../../src'

it('can parse a string in the form "NAME;param=value:value"', () => {
    const serialized = 'DTSTART;VALUE=DATE:20251006'

    const property = deserializeProperty(serialized)

    const expected = new Property('DTSTART', '20251006', { VALUE: 'DATE' })
    expect(property).toStrictEqual(expected)
})

it('unfolds all lines', () => {
    const serialized = `SUMMARY:my \r
 long\r
 line wowowow`

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', 'my longline wowowow')
    expect(property).toStrictEqual(expected)
})

it('can unfold with tabs', () => {
    const serialized = `SUMMARY:my \r
\tlong\r
\tline wowowow`

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', 'my longline wowowow')
    expect(property).toStrictEqual(expected)
})

it('can unfold without CR when not in strict mode', () => {
    const serialized = `SUMMARY:my 
 long
 line wowowow`

    const property = deserializeProperty(serialized, false)

    const expected = new Property('SUMMARY', 'my longline wowowow')
    expect(property).toStrictEqual(expected)
})

it('is not in strict mode by default', () => {
    const serialized = `SUMMARY:my 
 long
 line wowowow`

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', 'my longline wowowow')
    expect(property).toStrictEqual(expected)
})

it('throws if fold has no whitespace', () => {
    const serialized = `SUMMARY:long \r
line`

    expect(() => {
        deserializeProperty(serialized)
    }).toThrow()
})

it('throws if fold has no LF', () => {
    const serialized = `SUMMARY:long \r line`

    expect(() => {
        deserializeProperty(serialized)
    }).toThrow()
})

it('throws if fold has no CR and in strict mode', () => {
    const serialized = `SUMMARY:long 
 line`

    expect(() => {
        deserializeProperty(serialized, true)
    }).toThrow()
})

it('allows line to be folded without CR if not in strict mode', () => {
    const serialized = `SUMMARY:long 
 line`

    const prop = deserializeProperty(serialized, false)

    const expected = new Property('SUMMARY', 'long line')
    expect(prop).toStrictEqual(expected)
})

it('unquotes parameter values', () => {
    let serialized = 'LOCATION;ALTREP="https://example.com/house123":House 123'
    let property = deserializeProperty(serialized)
    let expected = 'https://example.com/house123'
    expect(property.getFirstParameter('ALTREP')).toStrictEqual(expected)

    serialized = 'DTSTART;VALUE="DATE":20251007'
    property = deserializeProperty(serialized)
    expected = 'DATE'
    expect(property.getFirstParameter('VALUE')).toStrictEqual(expected)
})

it('unescapes special characters in value', () => {
    const serialized = 'DESCRIPTION:My description\\, has commas!'

    const property = deserializeProperty(serialized)

    const expected = 'My description, has commas!'
    expect(property.value).toStrictEqual(expected)
})

it('can parse a string in the form "NAME:value"', () => {
    const serialized = 'DTSTART:20251006T123456'

    const property = deserializeProperty(serialized)

    const expected = new Property('DTSTART', '20251006T123456')
    expect(property).toStrictEqual(expected)
})

it('can parse a string in the form "NAME;param1=value1;param2=value2:value"', () => {
    const serialized = 'DTSTART;VALUE=DATE;PARAM=my-value:20251006'

    const property = deserializeProperty(serialized)

    const expected = new Property('DTSTART', '20251006', {
        VALUE: 'DATE',
        PARAM: 'my-value',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse parameters containing special characters when quoted', () => {
    const serialized = 'X-PROP;PARAM=";:=,":value'

    const property = deserializeProperty(serialized)

    const expected = new Property('X-PROP', 'value', {
        PARAM: ';:=,',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse parameters containing allowed unquoted special characters', () => {
    const serialized = 'X-PROP;PARAM==:value'

    const property = deserializeProperty(serialized)

    const expected = new Property('X-PROP', 'value', {
        PARAM: '=',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse parameters containing allowed unquoted special characters', () => {
    const serialized = 'X-PROP;PARAM1==1=;PARAM2==2=:value'

    const property = deserializeProperty(serialized)

    const expected = new Property('X-PROP', 'value', {
        PARAM1: '=1=',
        PARAM2: '=2=',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse parameters containing allowed unquoted special characters', () => {
    const serialized = 'X-PROP;PARAM1==1=;PARAM2==2=:value'

    const property = deserializeProperty(serialized)

    const expected = new Property('X-PROP', 'value', {
        PARAM1: '=1=',
        PARAM2: '=2=',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse empty parameter values', () => {
    const serialized = 'ATTENDEE;PARAM=:value'

    const property = deserializeProperty(serialized)

    const expected = new Property('ATTENDEE', 'value', {
        PARAM: '',
    })
    expect(property).toStrictEqual(expected)
})

it('can parse quoted parameter values before line fold', () => {
    const serialized = `ATTENDEE;PARAM="abc"
 :value`

    const property = deserializeProperty(serialized)

    const example = new Property('ATTENDEE', 'value', {
        PARAM: 'abc',
    })
    expect(property).toStrictEqual(example)
})

it('can parse an unquoted parameter value after a quoted value', () => {
    const serialized = `ATTENDEE;PARAM1="abc";PARAM2=def:value`

    const property = deserializeProperty(serialized)

    const example = new Property('ATTENDEE', 'value', {
        PARAM1: 'abc',
        PARAM2: 'def',
    })
    expect(property).toStrictEqual(example)
})

it('can parse a quoted parameter value after another quoted value', () => {
    const serialized = `ATTENDEE;PARAM1="abc";PARAM2="def":value`

    const property = deserializeProperty(serialized)

    const example = new Property('ATTENDEE', 'value', {
        PARAM1: 'abc',
        PARAM2: 'def',
    })
    expect(property).toStrictEqual(example)
})

it('can parse values containing colons', () => {
    const serialized = 'ATTENDEE;RSVP=TRUE:mailto: j=smith@example.com'

    const property = deserializeProperty(serialized)

    const expected = new Property('ATTENDEE', 'mailto: j=smith@example.com', {
        RSVP: 'TRUE',
    })
    expect(property).toStrictEqual(expected)
})

it('allows one quote', () => {
    const serialized = 'SUMMARY:"value'

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', '"value')
    expect(property).toStrictEqual(expected)
})

it('allows two quotes', () => {
    const serialized = 'SUMMARY:"valu"e'

    const property = deserializeProperty(serialized)

    const expected = new Property('SUMMARY', '"valu"e')
    expect(property).toStrictEqual(expected)
})

it('throws if no colon is present', () => {
    const serialized = 'LOCATION=Incorrect format'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if quoted parameter value contains DQUOTE', () => {
    const serialized = 'ATTENDEE;PARAM=""":value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if unquoted parameter value contains DQUOTE', () => {
    const serialized = 'SUMMARY;key=a"b:value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if quoted parameter has leading characters', () => {
    const serialized = 'SUMMARY;key=a"b":value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if quoted parameter has trailing characters', () => {
    const serialized = 'SUMMARY;key="a"b:value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if unquoted parameter value contains SEMICOLON', () => {
    let serialized = 'ATTENDEE;PARAM=;:value'
    expect(() => deserializeProperty(serialized)).toThrow()

    serialized = 'ATTENDEE;PARAM2=a;b:value'
    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if parameter is blank', () => {
    const serialized = 'ATTENDEE;:value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if parameter is has no key', () => {
    const serialized = 'ATTENDEE;=value:value'

    expect(() => deserializeProperty(serialized)).toThrow()
})

it('throws if parameter quotes are unterminated', () => {
    const serialized = 'SUMMARY;key="value:value'

    expect(() => deserializeProperty(serialized)).toThrow()
})
