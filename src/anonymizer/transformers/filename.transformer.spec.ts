import { filename } from './filename.transformer'

test('Anonymize filename', () => {
  const filenames = [
    'test.jpg',
    '.env',
    ` Asd "' _*a&23MJSkwe.png`,
    'some.tar.gz',
    'noextension'
  ]
  const results = [
    'xxxx.jpg',
    '.env',
    'xxxxxxxxxxxxxxxxxxxx.png',
    'xxxxxxxx.gz',
    'xxxxxxxxxxx'
  ]

  filenames.forEach((key: string, index: number) => {
    const value = results[index]
    expect(filename(key)).toBe(value)
  })
})
