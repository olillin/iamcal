import {
    validateDuration,
    PropertyValidationError,
} from '../../../src/property/validate'

it('should allow P15DT5H0M20S', () => {
    expect(() => validateDuration('P15DT5H0M20S')).not.toThrow()
})
it('should allow PT5H0M20S', () => {
    expect(() => validateDuration('PT5H0M20S')).not.toThrow()
})
it('should allow PT0M20S', () => {
    expect(() => validateDuration('PT0M20S')).not.toThrow()
})
it('should allow PT20S', () => {
    expect(() => validateDuration('PT20S')).not.toThrow()
})
it('should allow PT0M', () => {
    expect(() => validateDuration('PT0M')).not.toThrow()
})
it('should allow PT5H0M', () => {
    expect(() => validateDuration('PT5H0M')).not.toThrow()
})
it('should allow P7W', () => {
    expect(() => validateDuration('P7W')).not.toThrow()
})
it('should allow P15D', () => {
    expect(() => validateDuration('P15D')).not.toThrow()
})

it('should not allow ABCDEF', () => {
    expect(() => validateDuration('ABCDEF')).toThrow(PropertyValidationError)
})
it('should not allow P', () => {
    expect(() => validateDuration('P')).toThrow(PropertyValidationError)
})
it('should not allow PT', () => {
    expect(() => validateDuration('PT')).toThrow(PropertyValidationError)
})
it('should not allow PW', () => {
    expect(() => validateDuration('PW')).toThrow(PropertyValidationError)
})
it('should not allow PT5H20S', () => {
    expect(() => validateDuration('PT5H20S')).toThrow(PropertyValidationError)
})
it('should not allow 15DT5H0M20S', () => {
    expect(() => validateDuration('15DT5H0M20S')).toThrow(
        PropertyValidationError
    )
})
it('should not allow T5H0M20S', () => {
    expect(() => validateDuration('T5H0M20S')).toThrow(PropertyValidationError)
})
it('should not allow T0M20S', () => {
    expect(() => validateDuration('T0M20S')).toThrow(PropertyValidationError)
})
it('should not allow T20S', () => {
    expect(() => validateDuration('T20S')).toThrow(PropertyValidationError)
})
it('should not allow T0M', () => {
    expect(() => validateDuration('T0M')).toThrow(PropertyValidationError)
})
it('should not allow T5H0M', () => {
    expect(() => validateDuration('T5H0M')).toThrow(PropertyValidationError)
})
it('should not allow 7W', () => {
    expect(() => validateDuration('7W')).toThrow(PropertyValidationError)
})
it('should not allow 15D', () => {
    expect(() => validateDuration('15D')).toThrow(PropertyValidationError)
})
it('should not allow PDT2H3M4S', () => {
    expect(() => validateDuration('PDT2H3M4S')).toThrow(PropertyValidationError)
})
it('should not allow P1DTH3M4S', () => {
    expect(() => validateDuration('P1DTH3M4S')).toThrow(PropertyValidationError)
})
it('should not allow P1DT2HM4S', () => {
    expect(() => validateDuration('P1DT2HM4S')).toThrow(PropertyValidationError)
})
it('should not allow P1DT2H3MS', () => {
    expect(() => validateDuration('P1DT2H3MS')).toThrow(PropertyValidationError)
})
