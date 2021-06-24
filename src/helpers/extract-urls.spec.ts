import extractURLs from './extract-urls'

test('domains are extracted from text', async () => {
  const input = 'foo ' +
    'random text http://example.com foo.bar' +
    'with newlines ( https://timeisltd.com ) bar'
  expect(extractURLs(input)).toStrictEqual(['http://example.com', 'https://timeisltd.com'])
})