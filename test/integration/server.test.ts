import * as supertest from 'supertest'
import * as mocha from 'mocha'
import * as dotenv from 'dotenv'
dotenv.config()

const request = supertest(process.env.TEST_BASE_URL)

describe('server', () => {
  describe('Get /', () => {
    it('should return 200',  done => {
      request.get('/').expect(200, done)
    })
  })
})