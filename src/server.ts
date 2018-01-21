import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as basicAuth from 'express-basic-auth'
import * as modules from './modules'
import * as path from 'path'
import { logger } from './logger'
import { config } from './config'
import { routes } from './routes'

logger.info(`Starting in environment '${config.runEnv}'.`)

const server = express()
const API_VERSION = config.apiVersion

server.disable('x-powered-by') // why?: Remove platform info in BE from response header
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, UPDATE')
  res.setHeader('Access-Control-Allow-Headers', 'X-API-Key, Content-Type')
  next()
})

server.set('trust proxy', true) // why?: Trust 'x-forwarded-*' headers from a load balancer

routes(server)

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

const basicAuthHandler = createBasicAuthHandler()

server.use(basicAuthHandler,
  express.static(path.join(__dirname, 'public'),
  {maxAge: 0})
)

server.listen(config.port, () => {
  logger.info(`Server listening on PORT '${config.port}'...`)
})
