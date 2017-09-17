import * as express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as mysql from 'mysql'
import * as fs from 'fs'
import * as escape from 'escape-html'
import * as json2csv from 'json2csv'

dotenv.config()
const server = express()
const envAry = ['AUTH_KEY','DB_HOST','DB_PORT','DB_USR','DB_USR_PW','DB_NAME',
'DB_TBL_NAME','NODE_ENV','HTTP_PORT'].forEach( (element: string) => {
  if (!process.env[element]) {
    console.error(`Environment variable ${element} is MISSING`)
  }
})

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization') // in FE: headers: {'Authorization': `0123456789abcdef`}
  next()
})

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USR,
  password: process.env.DB_USR_PW,
  database: process.env.DB_NAME
})

function _getDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USR,
    password: process.env.DB_USR_PW,
    database: process.env.DB_NAME
  })
}

function _insert(queryStmt: any, tblName?: any) {
  return new Promise((resolve, reject) => {
    if (queryStmt) {
      const date = new Date()
      pool.getConnection((err, conn) => {
        if (err) {
          console.error(`[${date}] Failed to DB CONNECT, `, err)
          conn.release()
          reject(err)
        } else {
          conn.query(
              queryStmt,
              (err: any, results: any, fields: any) => {
                if (err){
                  console.error(`[${date}] Failed to INSERT for ${tblName}, `, err)
                  conn.release()
                  reject(err)
                } else {
                  console.log(`[${date}] Successed to INSERT for ${tblName}`)
                  conn.release()
                  resolve(true)
                }
            })
        }
      })
    }
  })
}

function _select(queryStmt:any, tblName?: any) {
  return new Promise((resolve, reject) => {
    const date = new Date()
    pool.getConnection( (err, conn) => {
        if (err) {
          console.error(`[${date}] Failed to DB CONNECT, `, err)
          conn.release()
          reject(false);
        } else {
          conn.query(queryStmt, (error: any, result: any, fields: any) => {
            if (err){
              console.error(`[${date}] Failed to DB INSERT, `, err)
              conn.release()
              reject(false);
            } else {
              conn.release()
              resolve(JSON.stringify(result))
            }
          })
        }
      })
  })
}

server.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).end('Successed to GET /')
})

server.get('/user', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const primaryUuid = escape(req.query.uuid) || '' // in FE: params: {uuid: uuidValue}
  const secondaryUuid = escape(req.query.secUuid) || ''
  let queryStmt = ''
  if (primaryUuid && req.headers.authorization === process.env.AUTH_KEY) {
    queryStmt = `SELECT * FROM ${process.env.DB_TBL_DEVICE} WHERE PRIMARY_UUID='${primaryUuid}';`
    _select(queryStmt, 'user')
      .then((result) => {
        res.status(200).end(result.toString())
      })
      .catch(err => res.status(400).end(err))
  } else if (secondaryUuid && req.headers.authorization === process.env.AUTH_KEY) {
    queryStmt = `SELECT * FROM ${process.env.DB_TBL_SESSION} WHERE SECONDARY_UUID='${secondaryUuid}' ORDER BY END_DATE;`
    _select(queryStmt, 'session')
      .then((result) => {
        res.status(200).end(result.toString())
      })
      .catch(err => res.status(400).end(err))
  } else {
    res.status(403).send('Incorrect Authorization header')
  }
})

server.get('/bleData/session/:csvName', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const conn = _getDbConnection()
  const date = new Date()
  const csvName = req.params.csvName
  const csvColumns = ['CATEGORY', 'VALUE1', 'VALUE2', 'LABEL1', 'LABEL2', 'LABEL3', 'DATE']
  const sessionUuid = csvName.replace('.csv', '')

  if (sessionUuid) {
    const queryStmt = `SELECT * FROM ${process.env.DB_TBL_EVENT} WHERE SESSION_UUID='${sessionUuid}' ORDER BY DATE;`
    // _select(queryStmt, 'session')
    //   .then((result) => {
    //       const csv = json2csv({data: result, fields: csvColumns})
    //     // res.status(200).end(result.toString())
    //   })
    //   .catch(err => res.status(400).end(err))
    conn.connect((err) => {
      if (err) {
        console.error(`[${date}] Failed to DB CONNECT, `, err)
        res.status(500).end(err)
      } else {
        conn.query(queryStmt, (error: any, result: any, fields: any) => {
          if (err){
            console.error(`[${date}] Failed to DB READ, `, err)
            res.status(500).end(err)
          } else {
            const csvResult = json2csv({data: result, fields: csvColumns})
            res.setHeader('Content-disposition', `attachment; filename=${csvName}`);
            res.set('Content-Type', 'text/csv');
            res.status(200).end(csvResult);
          }
        })
      }
      conn.end()
    })
  } else {
    res.status(403).send('Incorrect Authorization header')
  }
})

server.post('/bleData/device', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.headers.authorization === process.env.AUTH_KEY) {
    const postDate = new Date()
    const uuid = escape(req.body.uuid)
    const list = req.body.decayType
    const model = req.body.model
    const os = req.body.os
    const date = req.body.date
    const qDevice = `INSERT INTO ${process.env.DB_TBL_DEVICE} (UUID, LIST) VALUES(
      '${uuid}', '${list}') ON DUPLICATE KEY UPDATE LIST = '${list}';`
    const qDesc = `INSERT INTO ${process.env.DB_TBL_DEVICE_DESC} (DEVICE_UUID, MODEL, OS, DATE) VALUES(
      '${uuid}', '${model}', '${os}', '${date}') ON DUPLICATE KEY UPDATE MODEL = '${model}', OS = '${os}', DATE = '${date}';`
  
    console.log(`[${postDate}] POST for /bleData/device`)
  
    _insert(qDevice, 'device')
      .then(() => _insert(qDesc, 'device_desc'))
      .then(() => res.status(200).send('Successed to post Device Data'))
  } else {
    res.status(403).send('Incorrect Authorization header')
  }
})

server.listen(process.env.HTTP_PORT, () => {
  console.log(`[${new Date()}] Server listening on PORT ${process.env.HTTP_PORT}...`)
})