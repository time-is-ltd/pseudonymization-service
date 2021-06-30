import { bootstrap } from '../bootstrap'
import {
  getUserMessageSchema,
  listCalendarEventsSchema,
  listUserCalendarsSchema,
  listUserMessagesSchema
} from './googleapis-schemas'

const Ajv = require('ajv')
const request = require('supertest')

const gsuite_test_user = process.env.GSUITE_TEST_USER
const api_token = process.env.API_TOKEN
const ajv = new Ajv()

let app
let server

const validateBodyUsingSchema = (body: Object, schema: Object) => {
  const validate = ajv.compile(schema)
  const valid = validate(body)
  if (!valid) {
    console.log(validate.errors)
  }
  expect(valid).toBeTruthy()
}

beforeAll(async () => {
  app = await bootstrap()
  server = app.listen(30003)
})

afterAll(async () => {
  server.close()
})

test('healthcheck returns 200/OK', async () => {
  await request(app).get('/healthcheck').expect(200)
    .then((response) => {
      expect(response.text).toBe('OK')
    })
})

test('withstands stress load', async () => {
  const requests = []
  for (let i = 0; i < 1000; i++) {
    requests.push(request(app).get('/healthcheck')
      .expect(200)
      .then((response) => {
        expect(response.text).toBe('OK')
      }))
  }
  await Promise.all(requests)
})

test('unknown endpoint returns 404', async () => {
  await request(app).get('/foobar')
    .expect(404)
})

test('no bearer returns 403', async () => {
  await request(app).get(`/www.googleapis.com/calendar/v3/users/${gsuite_test_user}/calendars/${gsuite_test_user}/events`)
    .expect(403)
})

test('invalid bearer returns 403', async () => {
  await request(app).get(`/www.googleapis.com/calendar/v3/users/${gsuite_test_user}/calendars/${gsuite_test_user}/events`)
    .set('Authorization', 'Bearer foobar')
    .expect(403)
})

test('can list gsuite emails', async () => {
  await request(app).get(`/www.googleapis.com/gmail/v1/users/${gsuite_test_user}/messages`)
    .set('Authorization', `Bearer ${api_token}`)
    .expect(200)
    .then((response) => {
      validateBodyUsingSchema(response.body, listUserMessagesSchema)
    })
})

test('can get individual gsuite email', async () => {
  await request(app).get(`/www.googleapis.com/gmail/v1/users/${gsuite_test_user}/messages/17a0f96a2ab5ab11`)
    .set('Authorization', `Bearer ${api_token}`)
    .expect(200)
    .then((response) => {
      validateBodyUsingSchema(response.body, getUserMessageSchema)
    })
})

test('can list gsuite calendars', async () => {
  await request(app).get(`/www.googleapis.com/calendar/v3/users/${gsuite_test_user}/calendarList`)
    .set('Authorization', `Bearer ${api_token}`)
    .then((response) => {
      validateBodyUsingSchema(response.body, listUserCalendarsSchema)
    })
})

test('can list gsuite calendar events', async () => {
  await request(app).get(`/www.googleapis.com/calendar/v3/users/${gsuite_test_user}/calendars/${gsuite_test_user}/events`)
    .set('Authorization', `Bearer ${api_token}`)
    .then((response) => {
      validateBodyUsingSchema(response.body, listCalendarEventsSchema)
    })
})






