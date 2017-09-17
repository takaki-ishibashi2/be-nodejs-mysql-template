import * as loadtest from 'loadtest'
import * as dotenv from 'dotenv'
dotenv.config()

interface LoadTestOptions {
    concurrency?: number,
    headers: {
      Authorization: string
    },
    insecure?: boolean,
    method?: 'GET',
    maxRequests?: number,
    requestPerSecond?: number,
    timeout?: number,
    url: string
}

const opts: LoadTestOptions = {
  concurrency: 1,
  headers: {
    Authorization: `${process.env.API_KEY}`,
  },
  insecure: true,
  method: 'GET',
  maxRequests: 5,
  requestPerSecond: 1,
  timeout: 3000,
  url: `${process.env.TEST_BASE_URL}/`
}

loadtest.loadTest(opts, (error: any, result: any) => {
  if (error) return console.error('Got an error: %s', error)
  console.log('Tests run sucessfull:', result)
})
