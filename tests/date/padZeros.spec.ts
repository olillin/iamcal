import { padZeros } from "../../src/date"

it('should return a string of the same length as length argument', () => {
    let length = 6
    let num = 3
    let result = padZeros(num, length)
    expect(result).toHaveLength(length)

    length = 8
    num = 12
    result = padZeros(num, length)
    expect(result).toHaveLength(length)

    length = 2
    num = 0
    result = padZeros(num, length)
    expect(result).toHaveLength(length)
})

it('should throw if number has more digits than length argument', () => {
    let length = 3
    let num = 1000
    expect(() => padZeros(num, length)).toThrow()

    length = 2
    num = 100
    expect(() => padZeros(num, length)).toThrow()

    length = 2
    num = 31415
    expect(() => padZeros(num, length)).toThrow()
})

it('should throw if number is decimal', () => {
    const length = 4
    const num = 1.5
    expect(() => padZeros(num, length)).toThrow()
})

it('should throw if number is negative', () => {
    const length = 3
    const num = -5
    expect(() => padZeros(num, length)).toThrow()
})

it('should throw if length is decimal', () => {
    const length = 3.5
    const num = 1.5
    expect(() => padZeros(num, length)).toThrow()
})

it('should throw if length is less than or equal to 0', () => {
    let length = 0
    let num = 0
    expect(() => padZeros(num, length)).toThrow()

    length = -123
    num = 0
    expect(() => padZeros(num, length)).toThrow()
})
