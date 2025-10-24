import { foldLine } from '../../../src'

it('folds long lines', () => {
    const line =
        'DESCRIPTION:Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at rutrum velit, condimentum semper arcu. Sed sed nisi mollis, semper est ut, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum, euismod sit amet magna ac, vulputate accumsan ex. Phasellus ullamcorper accumsan ultrices. Nullam vehicula ipsum neque, nec malesuada lectus volutpat vel. Nunc rhoncus lectus sed lorem pretium tempus.'

    const folded = foldLine(line)

    expect(folded).toContain('\r\n ')
})

it('does not fold short lines', () => {
    const line =
        'DESCRIPTION:This line is exactly 75 octets. And this is allowed by the spec'

    const folded = foldLine(line)

    expect(folded).toBe(line)
})

it('does not cut off last line', () => {
    const line =
        'DESCRIPTION:This line is just over 75 octets. In fact it is actually 80 octets.'

    const folded = foldLine(line)

    expect(folded).toBe(
        'DESCRIPTION:This line is just over 75 octets. In fact it is actually 80 oct\r\n ets.'
    )
})

it('folds consecutive lines to be 75 octets', () => {
    const line =
        'DESCRIPTION:Lorem ipsum dolor sit amet\\, consectetur adipiscing elit. Aliquam at rutrum velit\\, condimentum semper arcu. Sed sed nisi mollis\\, semper est ut\\, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum\\, euismod sit amet magna ac\\, vulputate accumsan ex. Phasellus ullamcorper accumsan ultrices. Nullam vehicula ipsum neque\\, nec malesuada lectus volutpat vel. Nunc rhoncus lectus sed lorem pretium tempus.'

    const folded = foldLine(line)

    expect(folded).toBe(
        `DESCRIPTION:Lorem ipsum dolor sit amet\\, consectetur adipiscing elit. Aliqu\r
 am at rutrum velit\\, condimentum semper arcu. Sed sed nisi mollis\\, semper\r
  est ut\\, mollis ex. Vestibulum id diam eros. Phasellus lobortis in ex sed\r
  tempor. Phasellus mattis varius sem et dapibus. Nunc purus ipsum\\, euismo\r
 d sit amet magna ac\\, vulputate accumsan ex. Phasellus ullamcorper accumsa\r
 n ultrices. Nullam vehicula ipsum neque\\, nec malesuada lectus volutpat ve\r
 l. Nunc rhoncus lectus sed lorem pretium tempus.`
    )
})
