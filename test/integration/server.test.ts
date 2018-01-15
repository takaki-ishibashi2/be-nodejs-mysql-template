import * as supertest from 'supertest'
import * as shuld from 'should'
require('dotenv').config()

const request = supertest(process.env.TEST_BASE_URL)
const authKey = process.env.AUTH_KEY
const deviceUuid = '9BD34864971340B8B98236700B2EDD3A'
const baseUrl = {
  device: '/bleData/device',
  deviceDesc: '/bleData/deviceDesc',
  session: '/bleData/session',
  event: '/bleData/event'
}

describe('Integration Test of RSSI Analytics Server', () => {
  describe('Ping', () => {
    it ('should return status 200', (done) => {
      request.get('/').expect(200, done)
    })
  })

  describe('Fail Response', () => {
    describe('Authorization header', () => {
      it ('should return status 403 if header is undefined.', (done) => {
        request.get('/bleData/device').expect(403, done)
      })
  
      it ('should return status 403 if header value is null.', (done) => {
        request.get('/bleData/device').set('Authorization', '').expect(403, done)
      })
      it ('should return status 403 if header value is incorrect.', (done) => {
        request.get('/bleData/device').set('Authorization', 'very incorrect authorization header').expect(403, done)
      })
    })
  
    describe('Get /bleData/device', () => {
      it ('should return status 400 when uuid is TOO LONG.', (done) => {
        request.get(`${baseUrl.device}?uuid=${deviceUuid}abcdefghijklmnopqrstu`)
        .set('Authorization', `${authKey}`)
        .expect(400, done)
      })

      it ('should return status 400 when uuid is TOO SHORT.', (done) => {
        request.get(`${baseUrl.device}?uuid=a`)
        .set('Authorization', `${authKey}`)
        .expect(400, done)
      })

      it ('should return status 400 when uuid is NULL.', (done) => {
        request.get(`${baseUrl.device}?uuid=`)
        .set('Authorization', `${authKey}`)
        .expect(400, done)
      })

      it ('should return status 400 when uuid is UNDEFINED.', (done) => {
        request.get(`${baseUrl.device}?uuid=undefined`)
        .set('Authorization', `${authKey}`)
        .expect(400, done)
      })
      it ('should return status 400 when uuid is NaN.', (done) => {
        request.get(`${baseUrl.device}?uuid=NaN`)
        .set('Authorization', `${authKey}`)
        .expect(400, done)
      })
    })

    describe('Get /bleData/deviceDesc', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
    describe('Get /bleData/session', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
    describe('Get /bleData/event', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
    
    describe('Post /bleData/device', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
    describe('Post /bleData/session', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
    describe('Post /bleConfig', () => {
      it ('should return status 200', (done) => {
        request.get('/').expect(200, done)
      })
    })
  })

  describe('Success Response', () => {
    describe(`Get ${baseUrl.device}`, () => {
      it ('should return status 200', (done) => {
        request.get(`${baseUrl.device}?uuid=${deviceUuid}`)
        .set('Authorization', `${authKey}`)
        .expect(200, done)
      })
    })
  })
})
