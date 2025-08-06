import { padZeros } from '../../src'

it('returns 00123 for 123 with length 5', () => {
    const length = 5
    const num = 123
    const result = padZeros(num, length)
    expect(result).toBe('00123')
})

it('returns 52 for 52 with length 2', () => {
    const length = 2
    const num = 52
    const result = padZeros(num, length)
    expect(result).toBe('52')
})

it('returns string with length 6 for length 6', () => {
    const length = 6
    const num = 3
    const result = padZeros(num, length)
    expect(result).toHaveLength(length)
})

it('returns string with length 8 for length 8', () => {
    const length = 8
    const num = 12
    const result = padZeros(num, length)
    expect(result).toHaveLength(length)
})

it('returns string with length 2 for length 2', () => {
    const length = 2
    const num = 1
    const result = padZeros(num, length)
    expect(result).toHaveLength(length)
})

it('returns 000 for 0 and length 3', () => {
    const length = 3
    const num = 0
    const result = padZeros(num, length)
    expect(result).toBe('000')
})

it('throws if number has more digits than length argument with 1000 and length 3', () => {
    const length = 3
    const num = 1000
    expect(() => padZeros(num, length)).toThrow()
})

it('throws if number has more digits than length argument with 31415 and length 2', () => {
    const length = 2
    const num = 31415
    expect(() => padZeros(num, length)).toThrow()
})

it("doesn't throw if with length 1 and num 0", () => {
    const length = 1
    const num = 0
    expect(() => padZeros(num, length)).not.toThrow()
})

it('throws if number is decimal', () => {
    const length = 4
    const num = 1.5
    expect(() => padZeros(num, length)).toThrow()
})

it('throws if number is negative', () => {
    const length = 3
    const num = -5
    expect(() => padZeros(num, length)).toThrow()
})

it('throws if length is decimal', () => {
    const length = 3.5
    const num = 1
    expect(() => padZeros(num, length)).toThrow()
})

it('throws if length is negative', () => {
    const length = -1
    const num = 5
    expect(() => padZeros(num, length)).toThrow()
})

it('throws if length is equal to 0', () => {
    let length = 0
    let num = 5
    expect(() => padZeros(num, length)).toThrow()
})
