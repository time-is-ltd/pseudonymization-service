import { extractDomains } from './extract-domains.transformer'

const TEST_CASES = {
  multiline_message: {
    input: 'multiline ' +
      'message with ' +
      'link to zoom https://us02web.zoom.us/j/83606372592?pwd=MlF6N21zZ0JSbytoR0QzQzhoNmE1UT09',
    output: 'us02web.zoom.us',
    whitelist: undefined
  },
  multiple_domains: {
    input: 'text with https://us02web.zoom.us/j/83606372592?pwd=MlF6N21zZ0JSbytoR0QzQzhoNmE1UT09 multiple ' +
      'links https://teams.microsoft.com/l/meetup-join/19%3ameeting_NDY4YzZkNTAtYWRiNy00MmU1LTk0ZmYtODlmMWQ2NTVlOGRh%40thread.v2/0?context=%7b%22Tid%22%3a%223883adfd-6525-40cd-a346-6d7ba1fd38a6%22%2c%22Oid%22%3a%22f1bf7847-712a-4730-bea2-0279098d440f%22%7d',
    output: 'us02web.zoom.us teams.microsoft.com',
    whitelist: undefined
  },
  mixed_whitelisted_and_non_whitelisted_domains: {
    input: 'whitelisted https://us02web.zoom.us/j/836063 and non whitelisted https://microsoft.com/l4YzZkNTA',
    output: 'us02web.zoom.us',
    whitelist: ['zoom.us']
  },
  text_which_resembles_domain_but_is_not_a_domain: {
    input: 'this is a sentence ending with dot.net volume has peaked.',
    output: '',
    whitelist: undefined
  },
  html_text: {
    input: '...Join on your computer or mobile app</span>\\r\\n</div>\\r\\n' +
      '<a class=\\"me-email-headline\\" href=\\"https://teams.microsoft.com/l/meetup-join/19%3ameeting_NDY4YzZkNTAtYWRiNy00MmU1LTk0ZmYtODlmMWQ2NTVlOGRh%40thread.v2/0?context=%7b%22Tid%22%3a%223883adfd-6525-40cd-a346-6d7ba1fd38a6%22%2c%22Oid%22%3a%22f1bf7847-712a-4730-bea2-0279098d440f%22%7d\\" target=\\"_blank\\" rel=\\"noreferrer noopener\\"' +
      ' style=\\"font-size:14px; font-family:\'Segoe UI Semibold\',\'Segoe UI\',\'Helvetica Neue\',Helvetica,Arial,sans-serif; text-decoration:underline; ' +
      'color:#6264a7\\">Click\\r\\n here to join the meeting</a> </div>\\r\\n<div style=\\"margin-bottom:24px; margin-top:20px\\">' +
      '<a class=\\"me-email-link\\" target=\\"_blank\\" href=\\"https://aka.ms/JoinTeamsMeeting\\" ' +
      'rel=\\"noreferrer noopener\\" style=\\"font-size:14px; text-decoration:underline; color:#6264a7; font-family:\'Segoe UI\',\'Helvetica Neue\',Helvetica,Arial,sans-serif\\">Learn\\r\\n More</a> | ' +
      '<a class=\\"me-email-link\\" target=\\"_blank\\" href=\\"https://teams.microsoft.com/meetingOptions/?organizerId=f1bf7847-712a-4730-bea2-0279098d440f&amp...',
    output: 'teams.microsoft.com aka.ms',
    whitelist: undefined
  }
}

test('Extract third party domains', () => {
  for (const label in TEST_CASES) {
    const testCase = TEST_CASES[label]
    expect(extractDomains(testCase.input, true, testCase.whitelist)).toBe(testCase.output)
  }
})

test('Do not extract domains', () => {
  for (const label in TEST_CASES) {
    const testCase = TEST_CASES[label]
    expect(extractDomains(testCase.input, false)).toBe('')
  }
})
