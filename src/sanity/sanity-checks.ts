import * as request from 'supertest'
import { printHeader } from '../helpers/console'
import appConfig from '../app.config'
import gsuiteConfig from '../modules/googleapis/googleapis.config'
import { CustomError } from 'ts-custom-error'
import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'
import googleapis from '../modules/googleapis/googleapis.module'
import microsoftgraph from '../modules/microsoftgraph/microsoftgraph.module'

class Skipped extends CustomError {
  public constructor (
    message?: string,
  ) {
    super(message)
  }
}

const check = (name: string, fn: () => Promise<void>, abortOnFail = false) => {
  return {
    name: name,
    fn: fn,
    abortOnFail: abortOnFail
  }
}

const checkSuite = (name, checks) => {
  return {
    name: name,
    checks: checks
  }
}

const configSuite = () => {
  const checks = [
    check('Server options are set', async () => {
      // check that either http or https (or both) are set
      const [httpPort, httpsPort, sslKey, sslCert] = await Promise.all([appConfig.httpPort, appConfig.httpsPort, appConfig.sslKey, appConfig.sslCert])
      if (!httpPort && !httpsPort) {
        throw Error('Http port nor https port is set.')
      }
      if (httpsPort && (!sslKey)) {
        throw Error('No SSL key set. Either set it or disable https.')
      }
      if (httpsPort && (!sslCert)) {
        throw Error('No SSL cert set. Either set it or disable https.')
      }
    }, true),
    check('Can read secrets from Azure Vault', async () => {
      const vaultName = process.env.AZURE_KEY_VAULT_NAME
      if (!Boolean(vaultName)) {
        throw new Skipped('Azure Key Vault not configured.')
      }
      const credential = new DefaultAzureCredential()
      const vaultUrl = `https://${vaultName}.vault.azure.net`
      const client = new SecretClient(vaultUrl, credential)
      try {
        await client.getSecret('dummy')
      } catch (err) {
        if (err.name && err.name.includes('AuthenticationError')) {
          throw Error(`Authentication error. See details below.\n${err.message}`)
        } else if (err.name === 'RestError') {
          // no error except 404 is allowed
          if (!err.statusCode || err.statusCode != 404) {
            throw Error(`Unable to read a secret. See below for details.\n${err.message}`)
          }
        } else {
          throw Error(`Unable to read a secret. See below for details.\n${err.message}`)
        }
      }
    }, true),
    check('Can read secrets from Google Secret Manager', async () => {
      const gsmProject = process.env.GCP_SECRET_MANAGER_PROJECT_ID
      if (!Boolean(gsmProject)) {
        throw new Skipped('Google Secret Manager not configured.')
      }
      const client = new SecretManagerServiceClient()
      const name = `projects/${gsmProject}/secrets/dummy/versions/latest`
      try {
        await client.accessSecretVersion({ name })
      } catch (err) {
        // no error except gRPC status 5 (i.e. NOT FOUND) is allowed
        if (!err.code || err.code != 5) {
          throw Error(`Unable to read a secret. See below for details.\n${err.message}`)
        }
      }
    }, true),
    check('API token is set', async () => {
      const token = await appConfig.apiToken
      if (!Boolean(token)) {
        throw Error('API token not set. Check configuration.')
      }
      if (token.length < 32) {
        throw Error('API token has insufficient length (must be at least 32).')
      }
    }, true),
  ]
  return checkSuite('CONFIG', checks)
}

const appSuite = (app) => {
  const checks = [
    check('Healthcheck is responding', async () => {
      const client = request(app)
      const response = await client.get('/hc')
      if (response.text !== 'OK') {
        throw Error(`Unexpected response from healthcheck: ${response.text}`)
      }
    }),
    check('Diag is responding', async () => {
      const apiToken = await appConfig.apiToken
      const client = request(app)
      const response = await client.get('/diag').set('Authorization', `Bearer ${apiToken}`)
      if (!Boolean(response.body?.version)) {
        throw Error(`Unexpected response from diag: ${response.text}`)
      }
    }),
    check('Routes are registered', async () => {
      const routes = []
      app._router.stack.forEach(function (route) {
        if (route.route && route.route.path) {
          routes.push(route.route.path)
        }
      })
      // there are 3 'service' endpoints
      if (routes.length < 4) {
        throw Error(`Only ${routes.length} registered.`)
      }
    }),
  ]
  return checkSuite('APP', checks)
}

const gsuiteSuite = (app, module, testUser) => {
  const skipIfCannotCheck = () => {
    if (!module.enabled) {
      throw new Skipped('Google APIs module not enabled.')
    }
    if (!testUser) {
      throw new Skipped('Gsuite test user not set (GSUITE_TEST_USER).')
    }
  }
  const callGoogleApi = async (endpoint, requiredScope, items) => {
    skipIfCannotCheck()
    const scopes = await gsuiteConfig.scopes
    if (!scopes.includes(requiredScope)) {
      throw new Skipped(`Scope not set (${requiredScope}).`)
    }
    const apiToken = await appConfig.apiToken
    const client = request(app)
    let response
    try {
      response = await client.get(endpoint).set('Authorization', `Bearer ${apiToken}`)
    } catch (err) {
      throw Error(`Unable to get ${items}. See below for details:\n${err.message}`)
    }
    if (response.status >= 300) {
      throw Error(`Unable to get ${items} - status ${response.status} (${response.text})`)
    }
  }
  const checks = [
    check('Get calendar list', async () => {
      await callGoogleApi(
        `/www.googleapis.com/calendar/v3/users/${testUser}/calendarList`,
        'https://www.googleapis.com/auth/calendar.readonly',
        'calendars'
      )
    }),
    check('Get messages list', async () => {
      await callGoogleApi(
        `/www.googleapis.com/gmail/v1/users/${testUser}/messages`,
        'https://www.googleapis.com/auth/gmail.readonly',
        'messages'
      )
    }),
  ]
  return checkSuite('GSUITE', checks)
}

const o365Suite = (app, module, testUser) => {
  const skipIfCannotCheck = () => {
    if (!module.enabled) {
      throw new Skipped('Microsoft Graph module not enabled.')
    }
    if (!testUser) {
      throw new Skipped('O365 test user not set (O365_TEST_USER).')
    }
  }
  const callGraphApi = async (endpoint, items) => {
    skipIfCannotCheck()
    const apiToken = await appConfig.apiToken
    const client = request(app)
    let response
    try {
      response = await client.get(endpoint).set('Authorization', `Bearer ${apiToken}`)
    } catch (err) {
      throw Error(`Unable to get ${items}. See below for details:\n${err.message}`)
    }
    if (response.status >= 300) {
      throw Error(`Unable to get ${items} - status ${response.status} (${response.text})`)
    }
  }
  const checks = [
    check('Get calendar list', async () => {
      await callGraphApi(`/graph.microsoft.com/v1.0/users/${testUser}/calendars`, 'calendars')
    }),
    check('Get messages list', async () => {
      await callGraphApi(`/graph.microsoft.com/v1.0/users/${testUser}/messages`, 'messages')
    }),
    check('Get events list', async () => {
      await callGraphApi(`/graph.microsoft.com/v1.0/users/${testUser}/events`, 'events')
    }),
    check('Get mail folders', async () => {
      await callGraphApi(`/graph.microsoft.com/v1.0/users/${testUser}/mailFolders`, 'mail folders')
    }),
  ]
  return checkSuite('O365', checks)
}

export const runInitChecks = async (app) => {
  const googleApiModule = await googleapis()
  const gsuiteTestUser = process.env.GSUITE_TEST_USER
  const msGraphModule = await microsoftgraph()
  const o365TestUser = process.env.O365_TEST_USER

  const suites = [
    configSuite(),
    appSuite(app),
    gsuiteSuite(app, googleApiModule, gsuiteTestUser),
    o365Suite(app, msGraphModule, o365TestUser)
  ]

  printHeader('RUNNING CHECKS', '=')
  let abort = false
  let total = 0
  let skipped = 0
  let failed = 0
  for (let suite of suites) {
    printHeader(`${suite.name}`, '-')
    for (let check of suite.checks) {
      await check.fn().then(() => {
        console.log(`• ${check.name} - OK`)
      }).catch((error) => {
        if (error instanceof Skipped) {
          console.log(`• ${check.name} - SKIPPED: ${error.message}`)
          skipped += 1
        } else {
          console.log(`• ${check.name} - ERROR: ${error.message}`)
          failed += 1
          if (check.abortOnFail) {
            abort = true
          }
        }
      }).finally(() => {
        total += 1
      })
      if (abort) {
        break
      }
    }
    if (abort) {
      break
    }
  }
  if (abort) {
    console.log('Aborting sanity due to fatal error.')
  }
  printHeader(`Checks total: ${total}, skipped: ${skipped}, failed: ${failed}.`, ' ')
  if (failed) {
    console.log('Some of the error messages may have not be printed to protect privacy. ' +
      'To print all the details, consider temporarily setting VERBOSITY to "2".')
  }
}




