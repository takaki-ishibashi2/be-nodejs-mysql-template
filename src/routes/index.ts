import * as express from 'express'
import { deviceRoute } from './device'
import { homeRoute } from './home'
import { healthRoute } from './health'

export const routes = (server: express.Application) => {
  deviceRoute(server)
  homeRoute(server)
  healthRoute(server)
}