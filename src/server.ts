import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as basicAuth from 'express-basic-auth'
import * as modules from './modules'
import * as path from 'path'
import { logger } from './logger'
import { config } from './config'
import { routes } from './routes'

logger.info(`Starting in environment '${config.runEnv}'.`)

function createBasicAuthHandler (): express.RequestHandler {
  const usrOpts: basicAuth.IUsersOptions = {
    users: {},
    challenge: true,
  }

  if (
    config.basicAuthUser
    && config.basicAuthUser.length > 0
    && config.basicAuthPass
    && config.basicAuthPass.length > 0
  ) {
    usrOpts.users[config.basicAuthUser] = config.basicAuthPass

    return basicAuth(usrOpts)
  } else {
    logger.error(`Missing non-empty Basic Auth user or password from environment variables, defaulting everything to 403.`)

    return (req, res) => {
      return modules.sendErrorMessage(res, 403, '')
    }
  }
}

const server = express()
const API_VERSION = config.apiVersion
const basicAuthHandler = createBasicAuthHandler()

server.disable('x-powered-by') // why?: Remove platform info in BE from response header
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, PATCH, POST, PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type')
  next()
})
server.use(basicAuthHandler,
  express.static(path.join(__dirname, 'public'),
  {maxAge: 0})
)
// why?: Disable request caching
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Expires', '-1')
  next()
})

server.set('trust proxy', true) // why?: Trust 'x-forwarded-*' headers from a load balancer

routes(server)

server.listen(config.port, () => {
  logger.info(`Server listening on PORT '${config.port}'...`)
})
